import createDebug from "debug";
import chalk from "chalk";
import app from "./index.js";
import type CustomError from "../CustomError/CustomError.js";

const debug = createDebug("network:startServer");

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server listening on http://localhost:${port}`));
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      const errorMessage = "Error on starting the server";

      if (error.code === "EADDRINUSE") {
        debug(
          chalk.red(errorMessage),
          chalk.red(`The port ${port} is already in use`)
        );
      }

      reject(new Error(errorMessage));
    });
  });

export default startServer;
