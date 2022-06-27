import { Request, Response, NextFunction } from "express";
import { crypto, config } from "../utils";
import { HTTP_RESPONSES } from "../utils/constants";

export default function (req: Request, res: Response, next: NextFunction): void {
  if (config.get("ENABLE_ENCRYPTION") === "TRUE" && req.body) {
    if (req.body.data) {
      req.body = crypto.symmetricDecrypt(req.body.data);
    } else {
      res.sendStatus(HTTP_RESPONSES.BAD_REQUEST);
      return;
    }
  } else {
    if (req.body) req.body = req.body.data;
  }
  next();
}
