import { model, Schema } from "mongoose";
import { relationshipSchema } from "./Relationship.js";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  relations: [relationshipSchema],
});

const User = model("User", userSchema, "users");

export default User;
