import { getAuth } from "@clerk/express";
import ApiError from "../utils/ApiError.js";

const protectRoute = (req, res, next) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    return next(new ApiError(401, "Authentication required"));
  }

  req.clerkId = userId;
  next();
};

export default protectRoute;