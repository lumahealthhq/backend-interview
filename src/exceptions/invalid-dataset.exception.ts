export class InvalidDatasetException extends Error {
  constructor() {
    super('Invalid Dataset. Check if the dataset has values');
  }
}
