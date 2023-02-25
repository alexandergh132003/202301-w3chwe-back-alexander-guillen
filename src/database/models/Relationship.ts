import mongoose, { model, Schema } from "mongoose";

export const relationshipSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  relationType: { type: String, enum: ["friend", "enemy"] },
});

export const Relationship = model(
  "Relationship",
  relationshipSchema,
  "relationships"
);
