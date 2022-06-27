import { Request, Response, NextFunction } from "express";
import { crypto, config } from "../utils";

export default function (req: Request, res: Response, next: NextFunction): void {
  const oldSend = res.json;
  res.json = function (data) {
    const encryptionEnabled = config.get("ENABLE_ENCRYPTION") === "TRUE";
    const ecryptedData = encryptionEnabled ? crypto.symmetricEncrypt(data) : data;
    res.json = oldSend;
    return res.json({ data: ecryptedData });
  };
  next();
}
