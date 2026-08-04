import { clerkClient } from "@clerk/express";

import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const attachUser = asyncHandler(async (req, res, next) => {
  const clerkId = req?.clerkId;

  if (!clerkId) {
    throw new ApiError(401, "Authentication required");
  }

  let user = await User.findOne({
    clerkId,
  });

  if (!user) {
    const clerkUser =
      await clerkClient.users.getUser(clerkId);

    const primaryEmail =
      clerkUser?.emailAddresses?.find(
        (email) =>
          email?.id ===
          clerkUser?.primaryEmailAddressId,
      )?.emailAddress ??
      clerkUser?.emailAddresses?.[0]
        ?.emailAddress;

    if (!primaryEmail) {
      throw new ApiError(
        400,
        "User email was not found",
      );
    }

    const name =
      [
        clerkUser?.firstName,
        clerkUser?.lastName,
      ]
        .filter(Boolean)
        .join(" ") || "User";

    user = await User.findOneAndUpdate(
      {
        clerkId,
      },
      {
        $setOnInsert: {
          clerkId,
          name,
          email: primaryEmail,
          imageUrl:
            clerkUser?.imageUrl || "",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  if (!user) {
    throw new ApiError(
      500,
      "User could not be attached",
    );
  }

  if (!user?.isActive) {
    throw new ApiError(
      403,
      "Your account is inactive",
    );
  }

  req.user = user;

  next();
});

export default attachUser;