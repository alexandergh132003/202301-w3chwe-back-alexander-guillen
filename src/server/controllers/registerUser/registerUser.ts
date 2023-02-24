import bcryptjs from "bcryptjs";
import { type NextFunction, type Request, type Response } from "express";
import { type UserCredentials } from "../../../types.js";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";

const registerUser = async (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  response: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = request.body;

    const userQueried = await User.findOne({ username, email });

    if (userQueried) {
      const alreadyInUseError = new CustomError(
        "Credentials already in use",
        409,
        "Credentials already in user"
      );

      next(alreadyInUseError);
      return;
    }

    const hashedPassword = bcryptjs.hash(password, 10);

    const user = User.create({
      username,
      password: hashedPassword,
      email,
    });

    response.status(201).json({ user });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "User couldn't be created"
    );

    next(customError);
  }
};

export default registerUser;
