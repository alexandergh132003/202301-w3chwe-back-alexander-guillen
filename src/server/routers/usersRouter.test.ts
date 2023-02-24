import request from "supertest";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectToDatabase from "../../database/connectToDatabase.js";
import User from "../../database/models/User.js";
import app from "../index.js";
import {
  type ErrorResponseStructure,
  type TokenStructure,
  type UserCredentials,
} from "../../types.js";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectToDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
  jest.clearAllMocks();
});

describe("Given POST /users/login endpoint", () => {
  const user: UserCredentials = {
    username: "Alexander",
    email: "coso@gmail.com",
    password: "elGrande",
  };

  beforeAll(async () => {
    await User.create(user);
  });

  describe("When a request is sent to it with username 'Alexander', password 'elGrande', and email 'coso@gmail.com'", () => {
    test("Then it should repond with a token '123123JA1231JASALUDOS'", async () => {
      jwt.sign = jest.fn().mockReturnValue("123123JA1231JASALUDOS");
      const token: TokenStructure = {
        token: "123123JA1231JASALUDOS",
      };

      const response = await request(app)
        .post("/users/login")
        .send(user)
        .expect(201);

      expect(response.body).toStrictEqual(token);
    });
  });

  describe("When a request is sent to it with username 'Guillermo', password 'queCalorHaceEnBarcelona' and email 'bobBigTula@gmail.com'", () => {
    test("Then it should reponse with status code 401 and error 'Wrong credentials'", async () => {
      const ilegalInmigrantUser: UserCredentials = {
        username: "Guillermo",
        password: "queCalorHaceEnBarcelona",
        email: "bobBigTula@gmail.com",
      };
      const credentialsError: ErrorResponseStructure = {
        error: "Wrong credentials",
      };

      const response = await request(app)
        .post("/users/login")
        .send(ilegalInmigrantUser)
        .expect(401);

      expect(response.body).toStrictEqual(credentialsError);
    });
  });
});
