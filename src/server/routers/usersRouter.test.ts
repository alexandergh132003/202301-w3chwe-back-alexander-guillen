import request from "supertest";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import connectToDatabase from "../../database/connectToDatabase.js";
import User from "../../database/models/User.js";
import app from "../index.js";
import {
  type NewRelationshipResponseStructure,
  type CreateRelationShipStructure,
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

describe("Given POST /users/login endpoint", () => {
  const user: UserCredentials = {
    username: "Alexander",
    email: "coso@gmail.com",
    password: "elGrande",
  };

  beforeAll(async () => {
    await User.create(user);
  });

  afterEach(async () => {
    await User.deleteMany();
    jest.clearAllMocks();
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

describe("Given a POST /users/relationship", () => {
  beforeAll(async () => {
    const Alexander = new User({
      username: "Alexander",
      password: "elGrande",
      email: "aguillenhernandez@gmail.com",
    });

    const Alexandra = new User({
      username: "Alexandra",
      password: "laGrande",
      email: "alexaguillenhernandez@gmail.com",
    });

    Alexander._id = new Types.ObjectId("63fa1109f2df6dd57752a24e");
    Alexandra._id = new Types.ObjectId("63fa1117ee90ea8431f81764");

    await Alexander.save();
    await Alexandra.save();
  });

  const createRelationRequest: CreateRelationShipStructure = {
    userId: "63fa1109f2df6dd57752a24e",
    user2Id: "63fa1117ee90ea8431f81764",
    relationtype: "friend",
  };

  describe("When a request is sent to it with userId '63fa1109f2df6dd57752a24e' user2Id '63fa1117ee90ea8431f81764' and relationType 'friend'", () => {
    test("Then it should respond with status 201 and message 'New relationship: Alexander & Alexandra (friend)'", async () => {
      const newRelationShip: NewRelationshipResponseStructure = {
        response: "New relationship: Alexander & Alexandra (friend)",
      };

      const response = await request(app)
        .post("/users/relationship")
        .send(createRelationRequest)
        .expect(201);

      expect(response.body).toStrictEqual(newRelationShip);
    });
  });

  describe("When a new request is sent to it with userId '63fa1109f2df6dd57752a24e' user2Id '63fa1117ee90ea8431f81764' and relationType 'friend'", () => {
    test("Then it should respond with status 409 and message 'A relationship between this users already exists'", async () => {
      const error: ErrorResponseStructure = {
        error: "A relationship between this users already exists",
      };

      const response = await request(app)
        .post("/users/relationship")
        .send(createRelationRequest)
        .expect(409);

      expect(response.body).toStrictEqual(error);
    });
  });
});
