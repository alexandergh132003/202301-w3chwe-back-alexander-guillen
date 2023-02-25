import { Router } from "express";
import createRelationship from "../controllers/createRelationship/createRelationship.js";
import deleteRelationShip from "../controllers/deleteRelationship/deleteRelationship.js";
import { loginUser } from "../controllers/loginUser/loginUser.js";
import registerUser from "../controllers/registerUser/registerUser.js";

const usersRouter = Router();
const loginEndpoint = "/login";
const registerEndpoint = "/register";
const relationEndpoint = "/relationship";

usersRouter.post(loginEndpoint, loginUser);
usersRouter.post(registerEndpoint, registerUser);
usersRouter.post(relationEndpoint, createRelationship);
usersRouter.delete(relationEndpoint, deleteRelationShip);

export default usersRouter;
