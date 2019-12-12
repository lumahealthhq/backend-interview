class ScoreNormalizer {
  static call(value, max, min) {
    return this.normalize(value, max, min);
  }

  static normalize(value, max, min) {
    return 1 + ((value - min) * (10 - 1)) / (max - min);
  }
}

module.exports = ScoreNormalizer;
