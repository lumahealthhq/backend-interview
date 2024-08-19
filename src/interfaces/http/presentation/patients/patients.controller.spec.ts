import { FastifyReply, FastifyRequest } from "fastify";
import { RecommendPatientsController } from "./patients.controller";
import AppError from "../../../../domain/error/AppError";
import app from "../../../../app.singleton";
import patientsRecommender from "../../../../app/patients/patients-recommender.singleton";
import removeDetailUsecase from "../../../../app/patients/usecases/remove-scoring-detail.usecase";

jest.mock("../../../../app/patients/patients-recommender.singleton");
jest.mock("../../../../app/patients/usecases/remove-scoring-detail.usecase");
jest.mock("../../../../app.singleton");

describe("RecommendPatientsController", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;

  beforeEach(() => {
    mockRequest = {
      query: {
        lat: "40.7128",
        long: "-74.0060",
        limit: "10",
        include_details: "true",
      },
    };

    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should recommend patients with details", async () => {
    const mockPatients = [{ id: 1, name: "John Doe", details: "Some details" }];
    (patientsRecommender.recommend as jest.Mock).mockReturnValue(mockPatients);

    await RecommendPatientsController(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(patientsRecommender.recommend).toHaveBeenCalledWith("40.7128", "-74.0060", "10");
    expect(mockReply.send).toHaveBeenCalledWith(mockPatients);
  });

  it("should recommend patients without details", async () => {
    const mockPatients = [{ id: 1, name: "John Doe", age: 10 }];
    const mockNonDetailedPatients = [{ id: 1, name: "John Doe" }];
    (patientsRecommender.recommend as jest.Mock).mockReturnValue(mockPatients);
    (removeDetailUsecase as jest.Mock).mockReturnValue(mockNonDetailedPatients);

    mockRequest.query = { ...(mockRequest.query as any), include_details: false };

    await RecommendPatientsController(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(patientsRecommender.recommend).toHaveBeenCalledWith("40.7128", "-74.0060", "10");
    expect(removeDetailUsecase).toHaveBeenCalledWith(mockPatients);
    expect(mockReply.send).toHaveBeenCalledWith(mockNonDetailedPatients);
  });

  it("should handle AppError", async () => {
    const mockError = new AppError("Test error", 400);
    (patientsRecommender.recommend as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await RecommendPatientsController(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(app.logger.fatal).toHaveBeenCalledWith(mockError.details, mockError.message);
    expect(mockReply.code).toHaveBeenCalledWith(400);
    expect(mockReply.send).toHaveBeenCalledWith({
      error_message: "Test error",
    });
  });

  it("should handle generic error", async () => {
    const mockError = new Error("Generic error");
    (patientsRecommender.recommend as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await RecommendPatientsController(mockRequest as FastifyRequest, mockReply as FastifyReply);

    expect(app.logger.fatal).toHaveBeenCalledWith(mockError);
    expect(mockReply.code).toHaveBeenCalledWith(500);
    expect(mockReply.send).toHaveBeenCalled();
  });
});
