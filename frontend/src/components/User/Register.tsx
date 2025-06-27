import React from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router-dom";
import ConnectWallet from "../WalletConnection/ConnectWallet";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useContract } from "../../../context/index";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const navigate = useNavigate();

  // Extract functions and flags from context
  const {
    registerUser,
    isConnected,
    isSepoliaNetwork,
    setIsUserRegistered,
    handleTxError,
  } = useContract();

  // onSubmit uses the registerUser function from the smart contract
  const onSubmit = async (data: RegisterFormData) => {
    const receipt = await registerUser(
      data.username,
      data.email,
      data.password
    );
    if (receipt) {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f6f8] p-4">
      <div className="absolute top-4 right-4 mt-24">
        <Link
          to="/company/login"
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          Company Login
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <Label.Root htmlFor="username" className="text-sm font-medium">
              Username
            </Label.Root>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label.Root htmlFor="email" className="text-sm font-medium">
              Email
            </Label.Root>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label.Root htmlFor="password" className="text-sm font-medium">
              Password
            </Label.Root>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <ConnectWallet />

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
          >
            Register
          </Button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};
