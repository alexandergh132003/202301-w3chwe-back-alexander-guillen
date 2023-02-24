import express from "express";
import morgan from "morgan";
import errorHandler from "./middlewares/errorMiddlewares.js";
import usersRouter from "./routers/usersRouter.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use(errorHandler);

export default app;
