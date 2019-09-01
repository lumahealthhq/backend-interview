/* eslint-disable no-undef */
const score = require('../src/score');

const {
  calculateScoreByCategory
} = score;

test('calculate score by reply time', () => {
  const replyTime = {
    maxPoints: 30,
    weighingList: [
      { from: 0, to: 120, percent: 100 },
      { from: 121, to: 240, percent: 95 },
      { from: 241, to: 420, percent: 90 },
      { from: 421, to: 840, percent: 80 },
      { from: 841, to: 1800, percent: 40 },
      { from: 1801, to: 2400, percent: 20 },
      { from: 2401, to: 3000, percent: 5 },
      { from: 3001, to: 3600, percent: 1 },
      { from: 3601, to: 999999, percent: 0 }
    ]
  };

  expect(calculateScoreByCategory(60, replyTime)).toBe(30);
  expect(calculateScoreByCategory(120, replyTime)).toBe(30);
  expect(calculateScoreByCategory(121, replyTime)).toBe((30 / 100) * 95);
  expect(calculateScoreByCategory(300, replyTime)).toBe((30 / 100) * 90);
  expect(calculateScoreByCategory(840, replyTime)).toBe((30 / 100) * 80);
  expect(calculateScoreByCategory(1000, replyTime)).toBe((30 / 100) * 40);
  expect(calculateScoreByCategory(1801, replyTime)).toBe((30 / 100) * 20);
  expect(calculateScoreByCategory(2800, replyTime)).toBe((30 / 100) * 5);
  expect(calculateScoreByCategory(3600, replyTime)).toBe((30 / 100) * 1);
  expect(calculateScoreByCategory(3601, replyTime)).toBe(0);
  expect(calculateScoreByCategory(40000, replyTime)).toBe(0);
});

test('calculate score by age', () => {
  const age = {
    maxPoints: 10,
    weighingList: [
      { from: 0, to: 15, percent: 20 },
      { from: 16, to: 20, percent: 50 },
      { from: 21, to: 60, percent: 80 },
      { from: 61, to: 70, percent: 100 },
      { from: 71, to: 80, percent: 50 },
      { from: 81, to: 999, percent: 20 }
    ]
  };

  expect(calculateScoreByCategory(10, age)).toBe(2);
  expect(calculateScoreByCategory(15, age)).toBe(2);
  expect(calculateScoreByCategory(16, age)).toBe(5);
  expect(calculateScoreByCategory(19, age)).toBe(5);
  expect(calculateScoreByCategory(22, age)).toBe(8);
  expect(calculateScoreByCategory(60, age)).toBe(8);
  expect(calculateScoreByCategory(61, age)).toBe(10);
  expect(calculateScoreByCategory(65, age)).toBe(10);
  expect(calculateScoreByCategory(70, age)).toBe(10);
  expect(calculateScoreByCategory(73, age)).toBe(5);
  expect(calculateScoreByCategory(88, age)).toBe(2);
  expect(calculateScoreByCategory(1000, age)).toBe(0);
  expect(calculateScoreByCategory(-1, age)).toBe(0);
  expect(calculateScoreByCategory(null, age)).toBe(0);
  expect(calculateScoreByCategory(undefined, age)).toBe(0);
  expect(calculateScoreByCategory(undefined, null)).toBe(0);
  expect(calculateScoreByCategory(undefined, {})).toBe(0);
});

test('calculate score by distance', () => {
  const distance = {
    maxPoints: 10,
    weighingList: [
      { from: 0, to: 5.99, percent: 100 },
      { from: 6, to: 10.99, percent: 90 },
      { from: 11, to: 15.99, percent: 70 },
      { from: 16, to: 30.99, percent: 50 },
      { from: 31, to: 40.99, percent: 20 },
      { from: 41, to: 55.99, percent: 5 }
    ]
  };

  expect(calculateScoreByCategory(0, distance)).toBe(10);
  expect(calculateScoreByCategory(5, distance)).toBe(10);
  expect(calculateScoreByCategory(6, distance)).toBe(9);
  expect(calculateScoreByCategory(8, distance)).toBe(9);
  expect(calculateScoreByCategory(10.8, distance)).toBe(9);
  expect(calculateScoreByCategory(14, distance)).toBe(7);
  expect(calculateScoreByCategory(16, distance)).toBe(5);
  expect(calculateScoreByCategory(29, distance)).toBe(5);
  expect(calculateScoreByCategory(30, distance)).toBe(5);
  expect(calculateScoreByCategory(31, distance)).toBe(2);
  expect(calculateScoreByCategory(39, distance)).toBe(2);
  expect(calculateScoreByCategory(41, distance)).toBe(0.5);
  expect(calculateScoreByCategory(56, distance)).toBe(0);
  expect(calculateScoreByCategory(1000, distance)).toBe(0);
  expect(calculateScoreByCategory(-1, distance)).toBe(0);
  expect(calculateScoreByCategory(null, distance)).toBe(0);
  expect(calculateScoreByCategory(undefined, distance)).toBe(0);
  expect(calculateScoreByCategory(undefined, null)).toBe(0);
  expect(calculateScoreByCategory(undefined, {})).toBe(0);
});
