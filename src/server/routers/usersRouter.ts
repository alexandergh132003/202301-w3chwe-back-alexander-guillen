import { Router } from "express";
import { loginUser } from "../controllers/loginUser/loginUser.js";

const usersRouter = Router();
const loginEndpoint = "/login";

usersRouter.post(loginEndpoint, loginUser);

export default usersRouter;
