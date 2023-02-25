import express from "express";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "./middlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/users", usersRouter);
app.use(errorHandler);

export default app;
