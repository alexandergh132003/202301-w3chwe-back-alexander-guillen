import { model, Schema } from "mongoose";

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
});

const User = model("User", userSchema, "users");

export default User;
