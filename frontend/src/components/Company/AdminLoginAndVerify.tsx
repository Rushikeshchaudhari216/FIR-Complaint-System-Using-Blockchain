import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useContract } from "../../../context";
import VerifyCompany from "./VerifyCompany"; // Adjust path if necessary

type AdminLoginData = {
  email: string;
  password: string;
};

const AdminLoginAndVerify = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isOwner } = useContract();

  const ADMIN_EMAIL = "admin@renunciant.in";
  const ADMIN_PASSWORD = "admin123";

  const onSubmit = async (data: AdminLoginData) => {
    setIsLoading(true);
    try {
      if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
        if (!isOwner) {
          toast.error("You are not authorized as the contract owner.");
          return;
        }
        toast.success("Admin login successful!");
        setIsAuthenticated(true);
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <VerifyCompany />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 ring-red-200"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg font-semibold flex justify-center items-center ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginAndVerify;
