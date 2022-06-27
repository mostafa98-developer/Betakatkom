import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import sha512 from "crypto-js/sha512";
import { config } from "../utils";

export default class crypto {
  private constructor() {}

  public static symmetricEncrypt(message: string | Object): string {
    if (typeof message !== typeof {}) message = { data: message };
    return AES.encrypt(JSON.stringify(message), this.symmetricKey).toString();
  }

  public static symmetricDecrypt(message: string) {
    return JSON.parse(AES.decrypt(message, this.symmetricKey).toString(enc.Utf8));
  }

  private static get symmetricKey(): string {
    return config.get("AES_SECRET");
  }

  private static get hashKey(): string {
    return config.get("HASH_SECRET");
  }

  private static get hashEnabled(): boolean {
    return config.get("ENABLE_PASSWORD_HASH") == "TRUE";
  }

  public static hash(message: string): string {
    if (!this.hashEnabled) return message;
    const numberOfHashNumbers = 5;
    return new Array(numberOfHashNumbers).fill(2).reduce((prev: string, current, index: number) => {
      return sha512(`${prev}/${index}/${message}`).toString();
    }, this.hashKey);
  }
}
