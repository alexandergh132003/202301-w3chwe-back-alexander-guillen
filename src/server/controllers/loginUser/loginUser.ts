import jwt from "jsonwebtoken";
import { type NextFunction, type Response, type Request } from "express";
import { type JwtPayload, type UserCredentials } from "../../../types.js";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";

export const loginUser = async (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  response: Response,
  next: NextFunction
) => {
  const { password, username } = request.body;

  const user = await User.findOne({ password, username });

  if (!user) {
    const customError = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );

    next(customError);
    return;
  }

  const jwtPayload: JwtPayload = {
    id: user._id.toString(),
    username: user.username,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_KEY!, {
    expiresIn: "10h",
  });

  response.status(201).json({ token });
};
