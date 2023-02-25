import createDebug from "debug";
import { type NextFunction, type Request, type Response } from "express";
import { type RelationShipRequestStructure } from "../../../types.js";
import User from "../../../database/models/User.js";
import { Relationship } from "../../../database/models/Relationship.js";
import CustomError from "../../../CustomError/CustomError.js";

const debug = createDebug("network:createRelationship");

const createRelationship = async (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RelationShipRequestStructure
  >,
  response: Response,
  next: NextFunction
) => {
  try {
    const { user2Id, userId, relationtype } = request.body;

    const user = await User.findById(userId);
    const desiredEnemyOrFriend = await User.findById(user2Id);

    if (!user || !desiredEnemyOrFriend) {
      const userNotFoundError = new CustomError(
        "User not found",
        404,
        "User not found"
      );

      next(userNotFoundError);

      return;
    }

    const existingRelationshipQuery = await Relationship.findOne({
      $or: [
        { user: user._id, user2: desiredEnemyOrFriend._id },
        { user: desiredEnemyOrFriend._id, user2: user._id },
      ],
    });

    if (existingRelationshipQuery) {
      const alreadyExistError = new CustomError(
        "A relationship between this users already exists",
        409,
        "A relationship between this users already exists"
      );

      next(alreadyExistError);

      return;
    }

    const relationship = new Relationship({
      user: user._id,
      user2: desiredEnemyOrFriend._id,
      relationType: relationtype,
    });

    user.relations.push(relationship);
    desiredEnemyOrFriend.relations.push(relationship);

    await user.save();
    await desiredEnemyOrFriend.save();
    await relationship.save();

    const relationshipLog = `New relationship: ${user.username} & ${desiredEnemyOrFriend.username} (${relationtype})`;

    debug(relationship);
    response.status(201).json({ response: relationshipLog });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Relationship couldn't be created"
    );

    next(customError);
  }
};

export default createRelationship;
