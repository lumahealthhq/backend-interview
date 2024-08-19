import PatientsRecommenderAdapter from "./patients-recommender"

// Instantianting the patientsRecommeder class. It needs to be a singleton because we are constructing a K-d tree
// And to have great perfomance, we only want to do this *once* — and not for every request.
const patientsRecommender = new PatientsRecommenderAdapter()

export default patientsRecommender
