import Patient from "../../../@types/patient"
import median from "../../../utils/math/median";

export interface SetStats {
  age: {
    mean: number;
    std: number;
  }
  offer: {
    mean: number;
    std: number;
    meanNumberOfOffers: number;
    medianAcceptance: number;
  }
  replyTime: {
    mean: number;
    std: number;
  }
  location: {
    latMean: number;
  }
}

export default function getSetStatsUsecase(patients: Patient[]): SetStats {
  const stats: SetStats = {
    age: {
      mean: 0,
      std: 0,
    },
    offer: {
      mean: 0,
      std: 0,
      meanNumberOfOffers: 0,
      medianAcceptance: 0
    },
    replyTime: {
      mean: 0,
      std: 0,
    },
    location: {
      latMean: 0
    }
  }

  if (patients.length === 0) return stats

  const offersAcceptance = []

  // calculating the mean and the min/max values
  for (const patient of patients) {
    stats.age.mean += patient.age
    stats.replyTime.mean += patient.averageReplyTime
    stats.location.latMean += patient.location.latitude

    const acceptanceRatio = patient.acceptedOffers / (patient.acceptedOffers + patient.canceledOffers)
    offersAcceptance.push(acceptanceRatio)
    stats.offer.mean += acceptanceRatio
    stats.offer.meanNumberOfOffers += patient.acceptedOffers + patient.canceledOffers
  }
  stats.age.mean /= patients.length
  stats.replyTime.mean /= patients.length
  stats.offer.mean /= patients.length
  stats.offer.meanNumberOfOffers /= patients.length
  stats.location.latMean /= patients.length

  // calculating the standard deviation
  for (const patient of patients) {
    stats.age.std += Math.pow(patient.age - stats.age.mean, 2)
    stats.replyTime.std += Math.pow(patient.averageReplyTime - stats.replyTime.mean, 2)

    const acceptanceRatio = patient.acceptedOffers / (patient.acceptedOffers + patient.canceledOffers)
    stats.offer.std += Math.pow(acceptanceRatio - stats.offer.mean, 2)
  }
  stats.age.std /= patients.length
  stats.replyTime.std /= patients.length
  stats.offer.std /= patients.length

  stats.age.std = Math.sqrt(stats.age.std)
  stats.replyTime.std = Math.sqrt(stats.replyTime.std)
  stats.offer.std = Math.sqrt(stats.offer.std)

  // getting the median offer acceptance (baseline)
  stats.offer.medianAcceptance = median(offersAcceptance)
  return stats
}
