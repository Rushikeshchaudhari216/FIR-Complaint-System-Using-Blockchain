// src/pages/AdminRegister.tsx
import React from "react";
import { useForm } from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { Link } from "react-router-dom";

type AdminRegisterFormData = {
  fullName: string;
  email: string;
  password: string;
};

export const AdminRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegisterFormData>();

  const onSubmit = (data: AdminRegisterFormData) => {
    console.log("Admin Registration Data:", data);
    // TODO: hook up to your admin-registration API / smart contract
  };

  return (
    <div className="h-5/6 flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Vendor Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <Label.Root htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label.Root>
            <input
              id="fullName"
              type="text"
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName.message}</p>
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
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
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
              {...register("password", {
                required: "Password is required",
              })}
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
            Register as Admin
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already an admin?{" "}
          <Link to="/admin/login" className="text-red-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
