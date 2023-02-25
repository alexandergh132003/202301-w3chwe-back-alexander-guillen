import createDebug from "debug";
import { type Request, type Response, type NextFunction } from "express";
import { Relationship } from "../../../database/models/Relationship.js";
import { type RelationShipRequestStructure } from "../../../types.js";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";

const debug = createDebug("network:deleteRelationShip");

const deleteRelationShip = async (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    RelationShipRequestStructure
  >,
  response: Response,
  next: NextFunction
) => {
  try {
    const { user2Id, userId } = request.body;

    const user = await User.findById(userId);
    const enemyOrFriend = await User.findById(user2Id);

    if (!user || !enemyOrFriend) {
      const userNotFoundError = new CustomError(
        "User not found",
        404,
        "User not found"
      );

      next(userNotFoundError);

      return;
    }

    const relationship = await Relationship.findOne({
      $or: [
        { user: user._id, user2: enemyOrFriend._id },
        { user: enemyOrFriend._id, user2: user._id },
      ],
    });

    await user.update({ $pull: { relations: { _id: relationship?._id } } });
    await enemyOrFriend.update({
      $pull: { relations: { _id: relationship?._id } },
    });

    await relationship?.delete();

    const removeRelationLog = `Removed relationship: ${user.username} & ${enemyOrFriend.username}`;

    debug(removeRelationLog);
    response.status(200).json({ response: removeRelationLog });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Relationship couldn't be removed"
    );

    next(customError);
  }
};

export default deleteRelationShip;
