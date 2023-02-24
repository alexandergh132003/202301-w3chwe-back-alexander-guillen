import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import type CustomError from "../../CustomError/CustomError.js";

const debug = createDebug("network:errors");

const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  debug(error.message);

  response
    .status(error.statusCode || 500)
    .json({ error: error.publicMessage || "General Pete" });
};

export default errorHandler;
