import { type Request, type NextFunction, type Response } from "express";
import CustomError from "../../CustomError/CustomError.js";
import errorHandler from "./errorMiddlewares.js";

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const request = {} as Partial<Request>;
const next = jest.fn() as NextFunction;

describe("Given a errorHandler function", () => {
  describe("When it receives a response and error with status 404 and publicMessage 'Resource not found'", () => {
    test("Then it should respond with status code 404 and error 'Resource not found'", () => {
      const notFoundError = new CustomError(
        "Resource not found",
        404,
        "Resource not found"
      );
      const status = 404;
      const publicMessage = "Resource not found";

      errorHandler(
        notFoundError,
        request as Request,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(status);
      expect(response.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });

  describe("When it receives a response and error with status 0 and public message ''", () => {
    test("Then it should respond with status code 500 and public message 'General Pete'", () => {
      const fakeErrorToProvoqueGeneralPete = new CustomError(
        "General Pete",
        0,
        ""
      );
      const status = 500;
      const publicMessage = "General Pete";

      errorHandler(
        fakeErrorToProvoqueGeneralPete,
        request as Request,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(status);
      expect(response.json).toHaveBeenCalledWith({ error: publicMessage });
    });
  });
});
