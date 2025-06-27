export const authenticateUser = asyncHandler(async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      throw new ApiError(401, "Session required - Please login");
    }

    const user = await User.findOne({ 
      sessionId,
      sessionExpiry: { $gt: new Date() }
    });

    if (!user) {
      res.clearCookie("sessionId");
      throw new ApiError(401, "Invalid session - Please login again");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Authentication failed");
  }
});