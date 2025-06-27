import React, { useState } from "react";
import { useContract } from "../../../context"; // Ensure path is correct
import { useNavigate } from "react-router-dom"; // Import for navigation
import { toast } from "sonner"; // For user feedback
import ConnectWallet from "../WalletConnection/ConnectWallet"; // Import ConnectWallet component

// Renaming the component slightly for clarity, or keep VerifyCompany if preferred
const ConfirmCompanyWallet: React.FC = () => {
  // State for the address entered by the user
  const [inputAddress, setInputAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading/checking state

  const navigate = useNavigate(); // Hook for navigation

  // Get necessary state from the context
  const {
    // We DO NOT need verifyCompany for this logic
    address, // The currently connected wallet address
    isConnected, // Wallet connection status
    isSepoliaNetwork, // Network status
    // Optionally, could import getCompanyDetails or isCompanyVerified
    // to double-check registration status after matching addresses
    // getCompanyDetails
  } = useContract();

  // Handle the confirmation check
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);

    const enteredAddress = inputAddress.trim();

    // 1. Pre-checks: Wallet connection and network
    if (!isConnected) {
      toast.error("Please connect your company wallet first.");
      setIsLoading(false);
      return;
    }
    if (!isSepoliaNetwork) {
      toast.warning("Please switch your wallet to the Sepolia network.");
      setIsLoading(false);
      return;
    }
    // Check if address is available from context
    if (!address) {
      toast.error("Could not read connected wallet address. Please reconnect.");
      setIsLoading(false);
      return;
    }
    // Check if address format looks valid (basic check)
    if (!/^0x[a-fA-F0-9]{40}$/.test(enteredAddress)) {
      toast.error("Invalid Ethereum address format entered.");
      setIsLoading(false);
      return;
    }

    // 2. Core Logic: Compare input address with connected address
    if (enteredAddress.toLowerCase() === address.toLowerCase()) {
      // --- Optional Check ---
      // You might want to add a check here to ensure this address
      // is actually registered in your CompanyRegistry contract.
      // Example:
      // const companyDetails = await getCompanyDetails(address);
      // if (!companyDetails || !companyDetails.name) { // Check if details exist
      //    toast.error("This wallet address is not registered as a company.");
      //    setIsLoading(false);
      //    return;
      // }
      // --- End Optional Check ---

      toast.success("Wallet confirmed successfully!");
      // Navigate to the company dashboard upon successful confirmation
      navigate("/company/dashboard");
    } else {
      toast.error(
        "Confirmation failed: The entered address does not match the connected wallet address."
      );
    }

    setIsLoading(false); // Reset loading state
  };

  // Determine button disabled state
  const isButtonDisabled =
    isLoading || !isConnected || !isSepoliaNetwork || !inputAddress.trim();

  return (
    // Use styling appropriate for a confirmation step
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Confirm Company Wallet
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Please ensure you are connected with your registered company wallet
          and enter its address below to proceed.
        </p>

        {/* Wallet Connection Component */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <ConnectWallet />
          {/* Wallet Status Feedback */}
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
                  ⚠️ Please switch to Sepolia Network.
                </p>
              )}
            </>
          ) : (
            <p className="text-center text-xs text-orange-600 mt-2 font-medium">
              Wallet disconnected. Please connect.
            </p>
          )}
        </div>

        {/* Confirmation Form */}
        <form onSubmit={handleConfirm}>
          <div className="mb-6">
            <label
              htmlFor="inputCompanyAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Enter Your Company Wallet Address{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="inputCompanyAddress"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full px-4 py-2.5 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                // Indicate format error visually without strict JS validation block
                !inputAddress.trim() || /^0x[a-fA-F0-9]{40}$/.test(inputAddress)
                  ? "border-gray-300"
                  : "border-red-400 ring-red-200"
              }`}
              required
              aria-describedby="address-format-hint"
            />
            <p id="address-format-hint" className="text-xs text-gray-500 mt-1">
              Enter the 42-character address of the wallet you connected.
            </p>
          </div>

          {/* Confirmation Button */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-sm transition duration-200 ease-in-out shadow-md flex justify-center items-center ${
              isButtonDisabled
                ? "bg-gray-400 cursor-not-allowed opacity-70"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
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
                <span>Confirming...</span>
              </>
            ) : // Dynamic button text
            !isConnected ? (
              "Connect Wallet First"
            ) : !isSepoliaNetwork ? (
              "Switch to Sepolia"
            ) : (
              "Confirm Wallet Address"
            )}
          </button>
          {/* Feedback if disabled */}
          {isButtonDisabled && isConnected && isSepoliaNetwork && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Please enter your connected wallet address above.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

// Export with the original name if needed, or use ConfirmCompanyWallet
export default ConfirmCompanyWallet; // Or export default VerifyCompany;
