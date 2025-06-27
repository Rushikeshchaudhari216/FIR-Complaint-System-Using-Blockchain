import React, { useState } from "react"; // Added useState for loading feedback
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Using sonner for UI feedback
import { useNavigate } from "react-router-dom";
import { useContract } from "../../../context/index"; // Ensure path is correct
import ConnectWallet from "../WalletConnection/ConnectWallet"; // Ensure path is correct
import { Link } from "react-router-dom";

type CompanyLoginData = {
  email: string;
  password: string;
};

export const CompanyLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyLoginData>();
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

  const navigate = useNavigate();
  // Get the correct context function and necessary state for LOGIN
  const {
    verifyCompanyCredentialsByEmail, // Function to verify email/password via contract
    address, // Currently connected wallet address from wagmi
    isConnected, // Wallet connection status from wagmi
    isSepoliaNetwork, // Network check status from context
  } = useContract();

  const onSubmit = async (data: CompanyLoginData) => {
    setIsLoading(true); // Indicate loading start

    // 1. Pre-check: Ensure wallet is connected and on the correct network
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      setIsLoading(false);
      return;
    }
    if (!isSepoliaNetwork) {
      // Context provider might already show a warning, but this is explicit
      toast.warning("Please switch to the Sepolia network in your wallet.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Call the contract function to verify credentials
      // This function (from context) should handle its own contract call errors (like network issues, reverts)
      // It returns the company's registered Ethereum address if credentials match, or null/address(0) otherwise.
      const companyAddressFromContract = await verifyCompanyCredentialsByEmail(
        data.email,
        data.password
      );

      // 3. Check if the credentials were valid
      if (
        !companyAddressFromContract ||
        companyAddressFromContract ===
          "0x0000000000000000000000000000000000000000"
      ) {
        toast.error("Login failed: Invalid email or password provided.");
        setIsLoading(false);
        return;
      }

      // 4. CRITICAL STEP: Verify if the connected wallet matches the company's address
      // Ensure `address` from useContract (which comes from useAccount) is available
      if (!address) {
        toast.error(
          "Could not detect connected wallet address. Please reconnect."
        );
        setIsLoading(false);
        return;
      }

      if (companyAddressFromContract.toLowerCase() !== address.toLowerCase()) {
        // Credentials might be right, but the wrong wallet is connected
        toast.warning(
          `Credentials valid, but your connected wallet (${address.substring(
            0,
            6
          )}...) does not match the registered company address (${companyAddressFromContract.substring(
            0,
            6
          )}...). Please connect with the correct wallet.`
        );
        setIsLoading(false);
        return;
      }

      // 5. Success: Credentials valid AND correct wallet connected
      toast.success("Company login successful!");

      // Store minimal session info (avoid storing password)
      localStorage.setItem("isCompanyLoggedIn", "true");
      localStorage.setItem("companyEmail", data.email); // Store email for display maybe
      localStorage.setItem("companyAddress", companyAddressFromContract); // Store the verified address

      navigate("/company/dashboard"); // Navigate to the company dashboard
    } catch (error) {
      // Catch unexpected errors during the process (though context should handle contract errors)
      console.error("Login process error:", error);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false); // Ensure loading state is turned off
    }
  };

  // Disable button logic
  const isSubmitDisabled = isLoading || !isConnected || !isSepoliaNetwork;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Police Login
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Enter your credentials to access your dashboard.
        </p>

        {/* Wallet Connection Section */}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Police Email
            </label>
            <input
              type="email"
              placeholder="your.police@example.com"
              {...register("email", {
                required: "email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-400 ring-red-200" : "border-gray-300"
              }`}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1" role="alert">
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
              placeholder="Enter your secure password"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.password
                  ? "border-red-400 ring-red-200"
                  : "border-gray-300"
              }`}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
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
          </button>
        </form>

        {/* Link to Registration */}
        <p className="text-center text-sm mt-8 text-gray-600">
          Need an account?{" "}
          <a
            href="/company/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};
