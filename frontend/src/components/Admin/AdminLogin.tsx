// src/pages/AdminLogin.tsx
import React from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { Link, useNavigate } from "react-router-dom";

type AdminLoginFormData = {
  email: string;
  password: string;
};

export const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>();

  const navigate = useNavigate();

  const onSubmit = (data: AdminLoginFormData) => {
    console.log("Admin Login Data:", data);
    // TODO: call your admin-auth API / smart contract here
    // Assuming successful login, redirect to admin dashboard
    navigate("/admin/dashboard");
  };

  return (
    <div className="h-5/6 flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Vendor Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label.Root htmlFor="admin-email" className="text-sm font-medium">
              Email
            </Label.Root>
            <input
              id="admin-email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label.Root
              htmlFor="admin-password"
              className="text-sm font-medium"
            >
              Password
            </Label.Root>
            <input
              id="admin-password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm"
          >
            Login as Admin
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/admin/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
