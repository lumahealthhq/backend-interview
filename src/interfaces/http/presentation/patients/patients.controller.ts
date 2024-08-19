import { FastifyReply, FastifyRequest } from "fastify";
import AppError from "../../../../domain/error/AppError";
import app from "../../../../app.singleton";
import patientsRecommender from "../../../../app/patients/patients-recommender.singleton";
import removeDetailUsecase from "../../../../app/patients/usecases/remove-scoring-detail.usecase";

export async function RecommendPatientsController(req: FastifyRequest, res: FastifyReply) {
  try {
    // No need to validate the query parameters here because they were already validaded by Fastify using the schema defined in `./patients.schema.ts`
    const { lat, long, limit, include_details } = req.query as any

    // Get the recommended patients for the given latitude + longitude
    const patients = patientsRecommender.recommend(lat, long, limit)

    // Since the return from `patientRecommender.recommend()` is an array that contains a bunch of extra information
    // such as the score of each feature — e.g. `ageScore`, `replyTimeScore` — we remove those additional properties
    // *unless* the user has requested them through the `include_details` query parameter.
    if (!include_details) {
      const nonDetailedPatients = removeDetailUsecase(patients)

      return res.send(nonDetailedPatients)
    }

    return res.send(patients)
  } catch (err: any) {
    // `AppError` is a custom error class that is throwed whenever there's some kind of business logic error
    // such as invalid latitude or longitude.
    if (err instanceof AppError) {
      app.logger.fatal(err.details, err.message)
      return res.code(err.code).send({
        error_message: err.message,
      })
    }

    app.logger.fatal(err)
    return res.code(500).send()
  }
}
