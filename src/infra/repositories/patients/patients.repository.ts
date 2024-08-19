import PatientsRepositoryJsonFileImpl from "./patients-json-file.repository.impl";

/**
 * We can imagine here we could have different PatientsRepository, for instance
 * suppose we wanted to move our patients waitlist to a MongoDB collection,
 * we would just create a new PatientsRepositoryMongoImpl and substitute here in place of the JsonFileImpl.
 * We can, also, easily use different Impl depending on the environment (e.g. JsonFile for testing and Mongo for production)
 */
const PatientsRepository = PatientsRepositoryJsonFileImpl

export default PatientsRepository
