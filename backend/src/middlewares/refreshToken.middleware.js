import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { findUser } from "../utils/FindUser.js";

// Middleware to verify refresh token and issue new tokens
export const refreshTokenMiddleware = async (req, res, next) => {
    try {

        if (!req.isAccessTokenExpired) {
            return next();
        }

        console.log("refresh token middleware");

        
        const incomingRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!incomingRefreshToken) {
            throw new ApiError(401, "No refresh token provided");
        }

        // verify refresh token
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        // find the user by decoded ID
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== incomingRefreshToken) {
            throw new ApiError(403, "Invalid or expired refresh token");
        }

        // generate new tokens using model methods
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // save new refresh token in DB
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const loggedInuser = await findUser(user._id)
        

        // atach tokens
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
        });


        req.user = loggedInuser;
        req.mainId = decoded?._id;

        next();

    } catch (error) {
        next(new ApiError(403, error.message || "Could not refresh token"));
    }
};
