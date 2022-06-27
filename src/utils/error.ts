export default class error {
  private constructor() {}

  public static throw(message: string) {
    throw new Error(message);
  }

  public static report(error: Error) {
    console.error(error.message);
  }
}
