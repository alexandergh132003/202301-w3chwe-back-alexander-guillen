import "./loadEnvironment.js";
import connectToDatabase from "./database/connectToDatabase.js";
import startServer from "./server/startServer.js";

const mongoUrl = process.env.MONGODB_URL!;
const port = +process.env.PORT! || 4000;

await connectToDatabase(mongoUrl);
await startServer(port);
