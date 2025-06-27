import React from "react";
import { useForm } from "react-hook-form";
// Removed redundant toast import from here, context handles notifications
import { useNavigate } from "react-router-dom";
import { useContract } from "../../../context/index"; // Ensure this path is correct
import ConnectWallet from "../WalletConnection/ConnectWallet"; // Ensure this path is correct

type CompanyFormData = {
  name: string;
  email: string;
  companyCode: string; // This field is for a unique identifier, not the wallet address
  password: string;
  website: string;
  contactPhone: string;
};

export const CompanyRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>();

  const navigate = useNavigate();
  // Destructure necessary functions and state from the context
  const { registerCompany, isConnected, isSepoliaNetwork } = useContract();

  const onSubmit = async (data: CompanyFormData) => {
    // Although the context function checks, adding a check here provides quicker UI feedback if needed
    if (!isConnected || !isSepoliaNetwork) {
      // The context likely shows a toast already if not on Sepolia or disconnected.
      // Optionally add more specific UI feedback here if desired.
      console.warn(
        "Attempted to register Police while disconnected or on wrong network."
      );
      return;
    }

    // Call the context function. It handles loading/success/error toasts.
    const receipt = await registerCompany(
      data.name,
      data.email,
      data.companyCode,
      data.password,
      data.website,
      data.contactPhone
    );

    // If the transaction was successful (context function didn't return null), navigate.
    if (receipt) {
      // No need for toast here - context's registerCompany handles it.
      navigate("/company/login"); // Redirect to company login page
    }
    // Error handling (showing toast) is managed by handleTxError within the context function.
  };

  // Determine if the submit button should be disabled based on wallet connection and network
  const isSubmitDisabled = !isConnected || !isSepoliaNetwork;

  return (
    // Added subtle gradient background
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced styling for the card */}
      <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 ">
          Register Police
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Join our platform by registering your profile.
        </p>

        {/* Place Wallet Connection Button prominently */}
        <div className="mb-8">
          <ConnectWallet />
          {/* Optionally show network status clearly */}
          {isConnected && !isSepoliaNetwork && (
            <p className="text-center text-xs text-red-600 mt-2">
              Please switch to the Sepolia Test Network in your wallet.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Input Field Styling consistent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Police Name
            </label>
            <input
              type="text"
              placeholder="Enter official name"
              {...register("name", { required: "name is required" })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              placeholder="Enter contact email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address format",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            {/* Corrected Label based on context function */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Police Code
            </label>
            <input
              placeholder="Enter a unique identifier"
              type="text"
              {...register("companyCode", {
                required: "code is required",
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyCode ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.companyCode && (
              <p className="text-red-600 text-xs mt-1">
                {errors.companyCode.message}
              </p>
            )}
            {/* Helper text */}
            <p className="text-xs text-gray-500 mt-1">
              A unique code for your Police Station (e.g., Station, internal code, PIN code). Not
              your wallet address.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a secure password (min 6 chars)"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            {/* Used type="url" and pattern for better validation */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website (Optional)
            </label>
            <input
              placeholder="https://yourcompany.com"
              type="url"
              {...register("website", {
                pattern: {
                  // Basic URL pattern
                  value:
                    /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*\/?(\?[\w%=&-]*)?(#[\w-]*)?$/i,
                  message: "Please enter a valid URL",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.website ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.website && (
              <p className="text-red-600 text-xs mt-1">
                {errors.website.message}
              </p>
            )}
          </div>

          <div>
            {/* Used type="tel" */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone (Optional)
            </label>
            <input
              placeholder="Enter primary contact number"
              type="tel"
              {...register("contactPhone")}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.contactPhone ? "border-red-400" : "border-gray-300"
              }`}
            />
            {/* You could add pattern validation for phone number if needed */}
          </div>

          {/* Submit Button: Disabled based on connection/network status */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full text-white py-3 rounded-lg transition duration-200 ease-in-out text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {/* Dynamic Button Text */}
            {!isConnected
              ? "Connect Wallet to Register"
              : !isSepoliaNetwork
              ? "Switch to Sepolia Network"
              : "Register"}
          </button>
          {/* Display message if button is disabled */}
          {isSubmitDisabled && isConnected && !isSepoliaNetwork && (
            <p className="text-center text-xs text-red-600 mt-2">
              Registration requires connection to the Sepolia network.
            </p>
          )}
          {isSubmitDisabled && !isConnected && (
            <p className="text-center text-xs text-orange-600 mt-2">
              Please connect your wallet to proceed with registration.
            </p>
          )}
        </form>

        <p className="text-center text-sm mt-8 text-gray-600">
          Already registered?{" "}
          <a
            href="/company/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
};
