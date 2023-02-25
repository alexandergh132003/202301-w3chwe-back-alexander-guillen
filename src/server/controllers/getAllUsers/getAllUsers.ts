import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";

const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});

    if (!users) {
      const userNotFoundError = new CustomError(
        "User not found",
        404,
        "User not found"
      );

      next(userNotFoundError);
      return;
    }

    response.status(200).json({ users });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't get the users"
    );

    next(customError);
  }
};

export default getAllUsers;
