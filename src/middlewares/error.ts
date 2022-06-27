import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSES } from "../utils/constants";
import { error } from "../utils";

export default function (err: Error, req: Request, res: Response, next: NextFunction): void {
  error.report(err);
  const returnPhrase = "[RETURN]";
  const errorExtraWordings = "Error:  ";
  const defaultMessage = "Something failed!";
  let errorMessage = err.toString();
  if (errorMessage.includes(returnPhrase))
    errorMessage = errorMessage.replace(returnPhrase, "").replace(errorExtraWordings, "");
  else errorMessage = defaultMessage;
  res.status(HTTP_RESPONSES.ERROR).send({ error: errorMessage });
}
