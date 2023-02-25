import { Router } from "express";
import createRelationship from "../controllers/createRelationship/createRelationship.js";
import { loginUser } from "../controllers/loginUser/loginUser.js";
import registerUser from "../controllers/registerUser/registerUser.js";

const usersRouter = Router();
const loginEndpoint = "/login";
const registerEndpoint = "/register";
const createRelationEndpoint = "/relationship";

usersRouter.post(loginEndpoint, loginUser);
usersRouter.post(registerEndpoint, registerUser);
usersRouter.post(createRelationEndpoint, createRelationship);

export default usersRouter;
