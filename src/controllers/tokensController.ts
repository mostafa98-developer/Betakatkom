import jwt, { JwtPayload } from "jsonwebtoken";
import { config, crypto } from "../utils/index";

export default class TokensController {
  private constructor() {}

  public static verify(BaearerToken: string): boolean {
    try {
      const token = this.getTokenFromBearerToken(BaearerToken || "");
      const decryptedToken = crypto.symmetricDecrypt(token);
      jwt.verify(decryptedToken.data, this.jwtSecret);
      return true;
    } catch (e) {
      return false;
    }
  }

  public static generate(payload: any): string {
    const token = jwt.sign(payload, this.jwtSecret);
    const encryptedToken = crypto.symmetricEncrypt(token);
    return `Bearer ${encryptedToken}`;
  }

  private static getTokenFromBearerToken(token: string): string {
    const tokenParts = (token || "").split("Bearer ");
    return (tokenParts && tokenParts[1]) || "";
  }

  private static get jwtSecret(): string {
    return config.get("JWT_SECRET");
  }

  public static decode(BaearerToken: string): JwtPayload {
    const token = this.getTokenFromBearerToken(BaearerToken || "");
    const decryptedToken = crypto.symmetricDecrypt(token);
    return jwt.decode(decryptedToken.data) as JwtPayload;
  }
}
