import error from "./error";

export default class config {
  private constructor() {}
  public static get(configName: string): string {
    if (typeof process.env[configName] === typeof undefined)
      error.throw(`Requested Config Not Found:- ${configName}\n`);
    return process.env[configName] as string;
  }
}
