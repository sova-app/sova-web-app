export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly code: string,
    public readonly data: any = {}
  ) {
    super(message);
  }
}
