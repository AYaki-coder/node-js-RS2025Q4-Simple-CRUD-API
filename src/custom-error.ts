export class CustomError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly msg: string,
  ) {
    super(msg);
  }
}
