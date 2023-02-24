import "./loadEnvironment.js";
import connectToDatabase from "./database/connectToDatabase.js";

const mongoUrl = process.env.MONGODB_URL!;

await connectToDatabase(mongoUrl);
