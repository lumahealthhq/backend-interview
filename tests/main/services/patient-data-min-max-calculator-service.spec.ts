import type { Patient } from "@/domain/models";
import { PatientDataMinMaxCalculatorService } from "@/data/services";

const makeSut = () => {
  return new PatientDataMinMaxCalculatorService();
};

describe("PatientDataMinMaxCalculatorService", () => {
  it("Should calculate min and max values for patient fields", () => {
    const sut = makeSut();

    const maxAge = 50;
    const minAge = 10;
    const maxAcceptedOffers = 40;
    const minAcceptedOffers = 5;
    const maxCanceledOffers = 250;
    const minCanceledOffers = 20;
    const maxAvgReplyTime = 3000;
    const minAvgReplyTime = 100;

    const patients = [
      {
        name: "Samir Pacocha",
        age: maxAge,
        acceptedOffers: maxAcceptedOffers,
        canceledOffers: minCanceledOffers,
        averageReplyTime: 2000,
      },
      {
        name: "Bernard Mosciski",
        age: 20,
        acceptedOffers: 10,
        canceledOffers: maxCanceledOffers,
        averageReplyTime: maxAvgReplyTime,
      },
      {
        name: "Theo Effertz",
        age: minAge,
        canceledOffers: 90,
        acceptedOffers: minAcceptedOffers,
        averageReplyTime: minAvgReplyTime,
      },
    ];

    const { acceptedOffers, age, averageReplyTime, canceledOffers } =
      sut.calculate(patients as Patient[]);

    expect(age).toEqual({ max: maxAge, min: minAge });
    expect(averageReplyTime).toEqual({
      max: maxAvgReplyTime,
      min: minAvgReplyTime,
    });
    expect(canceledOffers).toEqual({
      max: maxCanceledOffers,
      min: minCanceledOffers,
    });
    expect(acceptedOffers).toEqual({
      max: maxAcceptedOffers,
      min: minAcceptedOffers,
    });
  });

  it("Should return default values as min and max when default values are both lower and higher than values from provided patients", () => {
    const sut = makeSut();

    const defaultValuesMock = {
      age: {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
      },
      acceptedOffers: {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
      },
      canceledOffers: {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
      },
      averageReplyTime: {
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
      },
    };

    sut.defaultValues = defaultValuesMock;

    const patients = [
      {
        name: "Kevin Malone",
        age: 20,
        acceptedOffers: 10,
        canceledOffers: 10,
        averageReplyTime: 500,
      },
    ];

    const minMaxValues = sut.calculate(patients as Patient[]);

    expect(minMaxValues).toEqual(defaultValuesMock);
  });
});
