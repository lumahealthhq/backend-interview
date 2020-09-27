const GenerateListOfPatientsService = require('./GenerateListOfPatientsService');

const generateListOfPatients = new GenerateListOfPatientsService();

const TEST_DATA = [
  {
    score: '8.00',
    behaviorScore: '3.00',
  },
  {
    score: '7.00',
    behaviorScore: '3.00',
  },
  {
    score: '6.00',
    behaviorScore: '3.00',
  },
  {
    score: '5.00',
    behaviorScore: '1.00',
  },
];

let toplist;

describe('GenerateListOfPatients', () => {
  const topListLength = 3;
  const littleBehaviorFraction = 1 / 3;
  const littleBehaviorScoreThreshold = 1.5;

  toplist = generateListOfPatients.execute(
    TEST_DATA,
    topListLength,
    littleBehaviorFraction,
    littleBehaviorScoreThreshold,
  );

  it('should contain the number of patients as the given topListLength', () => {
    expect(toplist.length).toBe(topListLength);
  });

  it("should throw an error if the patients list is shorter than 'topListLength'", () => {
    const shouldThrowError = () => {
      generateListOfPatients.execute(TEST_DATA, 5);
    };

    expect(shouldThrowError).toThrow(
      'The number of patients to be sorted should be greater than the desired sorted list.',
    );
  });

  it("should throw an error if the parameter 'littleBehaviorFraction' is greater than 1", () => {
    const shouldThrowError = () => {
      generateListOfPatients.execute(TEST_DATA, topListLength, 2);
    };

    expect(shouldThrowError).toThrow(
      "The parameter 'littleBehaviorFraction' must be lesser than 1.",
    );
  });

  it("should throw an error if the parameter 'topListLength' is lesser than 1", () => {
    const shouldThrowError = () => {
      generateListOfPatients.execute(TEST_DATA, 0);
    };

    expect(shouldThrowError).toThrow(
      "The parameter 'topListLength' must be greater than zero.",
    );
  });

  it("should throw an error if the parameter 'littleBehaviorScoreThreshold' is lesser than 1", () => {
    const shouldThrowError = () => {
      generateListOfPatients.execute(TEST_DATA, 3, littleBehaviorFraction, 0);
    };

    expect(shouldThrowError).toThrow(
      "The parameter 'littleBehaviorScoreThreshold' must be greater than zero.",
    );
  });

  it("should generate list based on the score of the patients", () => {
    const expected = [TEST_DATA[0], TEST_DATA[1], TEST_DATA[3]];
    expect(toplist).toEqual(expected);
  });
});
