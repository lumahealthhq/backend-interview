import { kdTree } from 'kd-tree-javascript'
import { ScoredPatient } from "../../@types/scored-patient";
import { RecommenderConfig } from '../../domain/patients/patients-recommender-config';
import haversineDistance from '../../utils/math/haversine-distance';

/**
 * This class acts like a wrapper for a weighted K-d tree made with the goal of retrieving patients.
 */
export default class PatientsKdtree {
  private internalTree: ReturnType<PatientsKdtree['createKdTree']>;
  private patients: ScoredPatient[];
  private weights: RecommenderConfig['weights']
  private thresholdLocationDistance: RecommenderConfig['thresholdLocationDistance']

  constructor(scoredPatients: ScoredPatient[], config: RecommenderConfig) {
    this.weights = config.weights
    this.thresholdLocationDistance = config.thresholdLocationDistance

    this.patients = scoredPatients
    this.internalTree = this.createKdTree()
  }

  /**
   * The method that does k-nearest-neighbor retrieval. It returns the top K patients for a given hospital.
   *
   * The returned array contains patients data + their features scores (ageScore, replyTimeScore) + their final score.
   * @param hospitalLat
   * @param hospitalLong
   * @param count
   */
  public findPatients(hospitalLat: number, hospitalLong: number, count: number): Required<ScoredPatient>[] {
    const patients: Required<ScoredPatient>[] = []

    // Since a K-d tree stores points and them is able to, for a new given point, retrieve the top K closest points to it
    // Here we are simply creating the query point that'll be use to retrieve the closest points (already stored) to it.
    const queryPoints: KdTreePoint = {
      // This makes intuitive sense — we're just creating the query point using the hospital's latitude & longitude
      lat: hospitalLat,
      long: hospitalLong,

      // Since the static feature scores are internally stored in the range of [0, 1]
      // we always create the query points of them to 1 (max score), because that's what we are searching for:
      // the points closest to the max score.
      //
      // PS: the weights are applied at `treeDistanceFunction`
      age: 1,
      offers: 1,
      replyTime: 1,

      // This is just for bookkeeping
      idx: 0,
    }

    // The top K closest points from our `queryPoint`
    // Although they are guaranteed to be the top K, they are not ordered between themselves.
    const results = this.internalTree.nearest(queryPoints, count)

    // Since the results are not ordered between themselves, we just sort them here.
    results.sort((a, b) => a[1] - b[1])

    for (const result of results) {
      // Each result is an array with two items: [KdTreePoint, score]
      const patient = this.patients[result[0].idx]

      patients.push({
        ...patient,
        // Since we may want to display to the user how much the hospital location influenced the final score
        // we just add it to the final returned top K recommeded patients.
        locationScore: this.calculateLocationDistance(hospitalLat, hospitalLong, patient.location.latitude, patient.location.longitude),

        // Adding the score property that represents the final score in the range of [0, 10] to the array of recommended patients.
        score: result[1],
      })
    }

    return patients
  }

  public score(patient: ScoredPatient, hospitalLat: number, hospitalLong: number): number {
    const point = this.generatePoint(patient, 0)
    const weighted = this.applyWeights(point)
    const distance = this.calculateLocationDistance(
      patient.location.latitude,
      patient.location.longitude,
      hospitalLat,
      hospitalLong
    )

    const score = (this.weights.age - weighted.age) +
      (this.weights.offers - weighted.offers) +
      (this.weights.replyTime - weighted.replyTime) +
      distance

    return score
  }

  private createKdTree() {
    const points = this.getKdTreePoints()

    const kdtree = new kdTree(
      points,
      (a, b) => this.treeDistanceFunction(a, b),
      ['lat', 'long', 'age', 'offers', 'replyTime', 'idx']
    )

    return kdtree
  }

  private getKdTreePoints(): KdTreePoint[] {
    const points = []
    for (let i = 0; i < this.patients.length; i++) {
      const patient = this.patients[i]

      const point = this.generatePoint(patient, i)

      points.push(point)
    }

    return points
  }

  private generatePoint(patient: ScoredPatient, idx: number): KdTreePoint {
    const point = {
      idx,
      lat: patient.location.latitude,
      long: patient.location.longitude,
      age: patient.ageScore,
      offers: patient.offersScore,
      replyTime: patient.replyTimeScore,
    }

    return point
  }

  private treeDistanceFunction(a: KdTreePoint, b: KdTreePoint) {
    a = this.applyWeights({ ...a })
    b = this.applyWeights({ ...b })

    const locationDist = this.calculateLocationDistance(a.lat, a.long, b.lat, b.long)

    const ageDist = Math.abs(a.age - b.age)
    const offersDist = Math.abs(a.offers - b.offers)
    const replyTimeDist = Math.abs(a.replyTime - b.replyTime)

    const dist = locationDist + ageDist + offersDist + replyTimeDist
    return dist
  }

  private applyWeights(point: KdTreePoint): KdTreePoint {
    point.age *= this.weights.age
    point.offers *= this.weights.offers
    point.replyTime *= this.weights.replyTime

    return point
  }

  public calculateLocationDistance(lat1: number, long1: number, lat2: number, long2: number): number {
    let milesDistance = haversineDistance(lat1, long1, lat2, long2)
    if (milesDistance > this.thresholdLocationDistance) milesDistance = this.thresholdLocationDistance
    const normalizedDistance = milesDistance / this.thresholdLocationDistance

    return normalizedDistance * this.weights.location
  }
}

interface KdTreePoint {
  idx: number;
  lat: number;
  long: number;
  age: number;
  offers: number;
  replyTime: number;
}
