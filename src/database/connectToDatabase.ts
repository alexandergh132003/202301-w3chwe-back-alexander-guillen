import mongoose from "mongoose";
import createDebug from "debug";

const debug = createDebug("network:connectToDatabase");

const connectToDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(url);
    debug("Connected to the database");
  } catch (error) {
    throw new Error("Error while connecting to the database");
  }
};

export default connectToDatabase;
