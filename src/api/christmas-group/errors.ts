export class AssignError extends Error {
  public code: AssignErrorCodes;

  constructor(msg: string, code?: AssignErrorCodes) {
    super(msg);
    this.code = code ?? AssignErrorCodes.UNKNOWN;
  }

  public static unknown(msg: string) {
    return new AssignError(msg, AssignErrorCodes.UNKNOWN);
  }

  public static noAvailableReceivers(msg: string) {
    return new AssignError(msg, AssignErrorCodes.NO_AVAILABLE_RECEIVERS);
  }
}

export enum AssignErrorCodes {
  NO_AVAILABLE_RECEIVERS = "NO_AVAILABLE_RECEIVERS",
  UNKNOWN = "UNKNOWN",
}
