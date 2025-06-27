// user.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get users with sensitive fields excluded
    const users = await User.find({})
      .select('-password -refreshToken -vaultAddress -walletAddress')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total user count for pagination
    const totalUsers = await User.countDocuments();

    return res.status(200).json(
      new ApiResponse(200, {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers
        }
      }, "Users retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve users");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  if (!email || !password || !name) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await User.create({
    name, // Include the name here
    email,
    password: await bcrypt.hash(password, 10),
    isAdmin: isAdmin || false
  });

  return res.status(201).json(
    new ApiResponse(200, { email: user.email }, "User registered successfully")
  );
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  return res.status(200).json(
    new ApiResponse(200, { email: user.email, isAdmin: user.isAdmin }, "Login successful")
  );
});

const check = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

export { getAllUsers, registerUser, loginUser, check};