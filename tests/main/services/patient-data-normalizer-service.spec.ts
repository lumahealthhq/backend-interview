import type { Patient } from "../../../src/domain/models";
import { PatientDataNormalizerService } from "../../../src/data/services";

const makeSut = () => {
  return new PatientDataNormalizerService();
};

describe("PatientDataNormalizerService", () => {
  describe("normalizeField - scale a value between 0 and 1 based on min and max", () => {
    it("Should return 0.5 when min is equal to max", () => {
      const sut = makeSut();

      const cases = [
        [0, 0],
        [1, 1],
        [5, 5],
        [100, 100],
        [500, 500],
      ];

      const value = 100;
      cases.forEach(([min, max]) => {
        const result = sut.normalizeField(value, min, max);

        expect(result).toBe(0.5);
      });
    });

    it("Should return value lower than 0 if value is lower than min", () => {
      const sut = makeSut();

      const value = 5;
      const min = 20;
      const max = 250;

      expect(sut.normalizeField(value, min, max)).toBe(-0.06521739130434782);
    });

    it("Should return value greater than 1 if value is greater than max", () => {
      const sut = makeSut();

      const value = 8;
      const min = 0;
      const max = 4;

      expect(sut.normalizeField(value, min, max)).toBe(2);
    });

    it("Should return 0 when value is equal min", () => {
      const sut = makeSut();

      const value = -100;
      const min = -100;
      const max = 100;

      expect(sut.normalizeField(value, min, max)).toBe(0);
    });

    it("Should return 1 when value is equal max", () => {
      const sut = makeSut();

      const value = 99;
      const min = 0;
      const max = 99;

      expect(sut.normalizeField(value, min, max)).toBe(1);
    });

    it("Should return closer to 1 when value is closer to max", () => {
      const sut = makeSut();

      const value = 666;
      const min = 0;
      const max = 1000;

      expect(sut.normalizeField(value, min, max)).toBe(0.666);
    });

    it("Should return closer to 0 when value is closer to min", () => {
      const sut = makeSut();

      const value = 3;
      const min = 0;
      const max = 1000;

      expect(sut.normalizeField(value, min, 1000)).toBe(0.003);
    });
  });

  describe("normalize", () => {
    it("Should call normalizeField five times, one for each field", () => {
      const sut = makeSut();

      const normalizeFieldSpy = jest.spyOn(sut, "normalizeField");

      const patient = {
        name: "Tobey Maguire",
        age: 20,
        distance: 50,
        acceptedOffers: 10,
        canceledOffers: 10,
        averageReplyTime: 500,
      };

      const minMax = {
        age: { max: 50, min: 10 },
        averageReplyTime: { max: 3000, min: 100 },
        acceptedOffers: { max: 40, min: 5 },
        canceledOffers: { max: 250, min: 20 },
      };

      sut.normalize(patient as Required<Patient>, minMax);

      expect(normalizeFieldSpy).toHaveBeenCalledTimes(5);
    });

    const defaultMinMax = {
      age: { max: 50, min: 10 },
      acceptedOffers: { max: 95, min: 5 },
      canceledOffers: { max: 250, min: 20 },
      averageReplyTime: { max: 3000, min: 100 },
    };

    describe("age", () => {
      it("Should return closer to 1 when age is closer to min value", () => {
        const sut = makeSut();

        const patient_1 = {
          name: "Michael Scott",
          age: defaultMinMax.age.max - 1,
          distance: 1,
          acceptedOffers: 5,
          canceledOffers: 250,
          averageReplyTime: 3000,
        } as Required<Patient>;

        const patient_2 = {
          ...patient_1,
          age: defaultMinMax.age.min + 1,
        } as Required<Patient>;

        const normalized_1 = sut.normalize(patient_1, defaultMinMax);
        const normalized_2 = sut.normalize(patient_2, defaultMinMax);

        expect(normalized_1.age).toBeCloseTo(0, 0);
        expect(normalized_2.age).toBeCloseTo(1, 0);
      });
    });

    describe("distance", () => {
      it("Should return value closer to 1 when distance or shorter (closer to 0)", () => {
        const sut = makeSut();

        const patient_1 = {
          name: "Ted Mosby, Architect",
          distance: 99,
          age: 30,
          acceptedOffers: 5,
          canceledOffers: 250,
          averageReplyTime: 3000,
        } as Required<Patient>;

        const patient_2 = {
          ...patient_1,
          distance: 1,
        } as Required<Patient>;

        const normalized_1 = sut.normalize(patient_1, defaultMinMax);
        const normalized_2 = sut.normalize(patient_2, defaultMinMax);

        expect(normalized_1.distance).toBeCloseTo(0, 0);
        expect(normalized_2.distance).toBeCloseTo(1, 0);
      });
    });

    describe("acceptedOffers", () => {
      it("Should return value closer to 1 the more offers one accepted", () => {
        const sut = makeSut();

        const patient_1 = {
          name: "Ted Mosby, Architect",
          age: 30,
          acceptedOffers: defaultMinMax.acceptedOffers.min + 1,
          distance: 10,
          canceledOffers: 250,
          averageReplyTime: 3000,
        } as Required<Patient>;

        const patient_2 = {
          ...patient_1,
          acceptedOffers: defaultMinMax.acceptedOffers.max - 1,
        } as Required<Patient>;

        const normalized_1 = sut.normalize(patient_1, defaultMinMax);
        const normalized_2 = sut.normalize(patient_2, defaultMinMax);

        expect(normalized_1.acceptedOffers).toBeCloseTo(0, 0);
        expect(normalized_2.acceptedOffers).toBeCloseTo(1, 0);
      });
    });

    describe("canceledOffers", () => {
      it("Should return value closer to 0 the more offers one canceled", () => {
        const sut = makeSut();

        const patient_1 = {
          name: "Ted Mosby, Architect",
          canceledOffers: defaultMinMax.canceledOffers.max - 1,
          age: 30,
          distance: 10,
          acceptedOffers: 20,
          averageReplyTime: 3000,
        } as Required<Patient>;

        const patient_2 = {
          ...patient_1,
          canceledOffers: defaultMinMax.canceledOffers.min + 1,
        } as Required<Patient>;

        const normalized_1 = sut.normalize(patient_1, defaultMinMax);
        const normalized_2 = sut.normalize(patient_2, defaultMinMax);

        expect(normalized_1.canceledOffers).toBeCloseTo(0, 0);
        expect(normalized_2.canceledOffers).toBeCloseTo(1, 0);
      });
    });

    describe("averageReplyTime", () => {
      it("Should return value closer to 1 the faster one replies", () => {
        const sut = makeSut();

        const patient_1 = {
          name: "Ted Mosby, Architect",
          age: 30,
          distance: 10,
          acceptedOffers: 20,
          canceledOffers: 10,
          averageReplyTime: defaultMinMax.averageReplyTime.max - 1,
        } as Required<Patient>;

        const patient_2 = {
          ...patient_1,
          averageReplyTime: defaultMinMax.averageReplyTime.min + 1,
        } as Required<Patient>;

        const normalized_1 = sut.normalize(patient_1, defaultMinMax);
        const normalized_2 = sut.normalize(patient_2, defaultMinMax);

        expect(normalized_1.averageReplyTime).toBeCloseTo(0, 0);
        expect(normalized_2.averageReplyTime).toBeCloseTo(1, 0);
      });
    });
  });
});
