import React, { useState } from "react";
import * as Label from "@radix-ui/react-label"; // Using Radix UI Label
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // Using sonner for UI feedback
import { useContract } from "../../../context/index"; // Ensure path is correct
import ConnectWallet from "../WalletConnection/ConnectWallet"; // ** Import ConnectWallet **
import { Button } from "../ui/button"; // Assuming ShadCN Button

type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  // Get necessary context functions and state
  const {
    verifyUserCredentials, // Function to verify email/password via contract
    address, // Currently connected wallet address
    isConnected, // Wallet connection status
    isSepoliaNetwork, // Network status (important for contract interaction)
  } = useContract();

  // onSubmit calls the context function and checks wallet connection
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // 1. Pre-checks: Wallet connection and network
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      setIsLoading(false);
      return;
    }
    // While verifyUserCredentials might be a read, contract initialization often depends on network
    if (!isSepoliaNetwork) {
      toast.warning("Please switch to the Sepolia network in your wallet.");
      setIsLoading(false);
      return;
    }

    // 2. Call the contract function (via context) to verify credentials
    // This function returns the user's ETH address if credentials match, otherwise null.
    // Context function handles contract call errors (reverts, network issues etc).
    const userAddressFromContract = await verifyUserCredentials(
      data.email,
      data.password
    );

    // 3. Check if credentials were valid (contract returned an address)
    if (
      !userAddressFromContract ||
      userAddressFromContract === "0x0000000000000000000000000000000000000000"
    ) {
      // Check if context function already showed an error toast. If not, show one here.
      // Assuming context's verifyUserCredentials returns null without a toast for invalid creds:
      toast.error("Login failed: Invalid email or password.");
      setIsLoading(false);
      return;
    }

    // 4. CRITICAL: Check if the connected wallet address matches the user's registered address
    if (!address) {
      toast.error(
        "Could not detect connected wallet address. Please reconnect."
      );
      setIsLoading(false);
      return;
    }

    if (userAddressFromContract.toLowerCase() !== address.toLowerCase()) {
      toast.warning(
        `Credentials valid, but your connected wallet (${address.substring(
          0,
          6
        )}...) does not match the registered user address (${userAddressFromContract.substring(
          0,
          6
        )}...). Please connect with the correct wallet.`
      );
      setIsLoading(false);
      return;
    }

    // 5. Success: Credentials valid AND correct wallet connected
    toast.success("Login successful!");
    // Store minimal session info (avoid storing password)
    localStorage.setItem("isUserLoggedIn", "true");
    localStorage.setItem("userEmail", data.email); // Store email for display maybe
    localStorage.setItem("userAddress", userAddressFromContract); // Store the verified address

    navigate("/dashboard"); // Navigate to the user dashboard

    setIsLoading(false);
  };

  // Determine button disabled state
  const isSubmitDisabled = isLoading || !isConnected || !isSepoliaNetwork;

  return (
    // Use consistent background and layout
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 relative">
      {/* Top right buttons */}
      <div className="absolute top-4 right-4 flex gap-3 z-10">
        <Link
          to="/company/login" // Link to Company login
          className="px-4 py-2 text-sm bg-white rounded-lg shadow hover:bg-gray-100 transition border border-gray-200 font-medium text-gray-700"
        >
          Police Portal
        </Link>
        <Link
          to="/register" // Link to User registration
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium"
        >
          Register
        </Link>
        {/* Add Admin Login link if needed */}
        {/* <Link to="/admin/login" className="...">Admin Login</Link> */}
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-200 mt-16 md:mt-0">
        {" "}
        {/* Added margin-top for spacing */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          User Login
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Access your dashboard.
        </p>
        {/* Wallet Connection Section - ESSENTIAL FOR LOGIN */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          <ConnectWallet />
          {/* Provide clear feedback on connection and network status */}
          {isConnected ? (
            <>
              <p className="text-center text-xs text-green-600 mt-2 font-medium">
                Wallet Connected
              </p>
              <p
                className="text-center text-xs text-gray-500 mt-1 truncate"
                title={address}
              >
                Address: {address}
              </p>
              {!isSepoliaNetwork && (
                <p className="text-center text-xs text-red-600 mt-2 font-semibold animate-pulse">
                  ⚠️ Please switch to the Sepolia Test Network.
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-xs text-orange-600 mt-2 font-medium">
              Wallet disconnected. Please connect to login.
            </p>
          )}
        </div>
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label.Root
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </Label.Root>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label.Root
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </Label.Root>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full text-white py-3 rounded-lg transition duration-200 ease-in-out text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center ${
              isSubmitDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            }`}
          >
            {/* Show Loading Spinner or Appropriate Text */}
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : !isConnected ? (
              "Connect Wallet to Login"
            ) : !isSepoliaNetwork ? (
              "Switch to Sepolia Network"
            ) : (
              "Login"
            )}
          </Button>
          {isSubmitDisabled && !isLoading && !isConnected && (
            <p className="text-center text-xs text-orange-600 mt-2">
              Please connect your wallet to login.
            </p>
          )}
          {isSubmitDisabled &&
            !isLoading &&
            isConnected &&
            !isSepoliaNetwork && (
              <p className="text-center text-xs text-red-600 mt-2">
                Login requires connection to the Sepolia network.
              </p>
            )}
        </form>
        {/* Link to Registration */}
        <p className="text-sm text-center mt-8 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
