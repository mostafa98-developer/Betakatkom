import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSES } from "../utils/constants";

export default function (req: Request, res: Response, next: NextFunction): void {
  res.sendStatus(HTTP_RESPONSES.NOT_FOUND);
}
