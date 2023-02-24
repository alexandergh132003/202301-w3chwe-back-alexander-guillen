import createDebug from "debug";
import chalk from "chalk";
import { type Request, type Response } from "express";
import type CustomError from "../../CustomError/CustomError.js";

const debug = createDebug("network:errors");

export const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response
) => {
  debug(chalk.redBright(error.message));

  response
    .status(error.statusCode || 500)
    .json({ error: error.publicMessage || "Oh oh, something went wrong" });
};
