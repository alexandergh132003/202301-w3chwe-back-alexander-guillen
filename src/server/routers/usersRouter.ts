import { Router } from "express";
import { loginUser } from "../controllers/loginUser/loginUser.js";
import registerUser from "../controllers/registerUser/registerUser.js";

const usersRouter = Router();
const loginEndpoint = "/login";
const registerEndpoint = "/register";

usersRouter.post(loginEndpoint, loginUser);
usersRouter.post(registerEndpoint, registerUser);

export default usersRouter;
