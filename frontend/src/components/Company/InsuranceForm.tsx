// src/components/Company/InsuranceForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useContract } from "../../../context/index";
import { ethers } from "ethers";

export type InsuranceType =
  | "Health"
  | "Life"
  | "Property"
  | "Vehicle"
  | "Travel"
  | "Other";

export interface InsuranceFormData {
  name: string;
  description: string;
  insuranceType: InsuranceType;
  coverageAmount: number;
  waitingPeriodDays: number;
  durationDays: number;
  coverageScope: string;
}

interface InsuranceFormProps {
  initialData?: Partial<InsuranceFormData> | null;
  onSuccess?: (policyId: number | null, data: InsuranceFormData) => void;
  isEditMode?: boolean;
  policyId?: number; // Added for edit mode
}

export const InsuranceForm: React.FC<InsuranceFormProps> = ({
  initialData = null,
  onSuccess,
  isEditMode = false,
  policyId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsuranceFormData>();

  const [isLoading, setIsLoading] = useState(false);

  // Get contract functions and state from context
  const {
    createPolicy,
    updatePolicy, // Added for edit functionality
    isConnected,
    isSepoliaNetwork,
    address,
  } = useContract();

  // Set default values or use initialData
  useEffect(() => {
    const defaultValues: InsuranceFormData = {
      name: "",
      description: "",
      insuranceType: "Health",
      coverageAmount: 0,
      waitingPeriodDays: 0,
      durationDays: 365,
      coverageScope: "",
    };
    reset(initialData || defaultValues);
  }, [initialData, reset]);

  // Mapping for insurance types (enum conversion)
  const insuranceTypeMapping: Record<InsuranceType, number> = {
    Health: 0,
    Life: 1,
    Property: 2,
    Vehicle: 3,
    Travel: 4,
    Other: 5,
  };

  // Submit handler
  const submitHandler = async (data: InsuranceFormData) => {
    setIsLoading(true);

    // Check wallet connection and network
    if (!isConnected || !isSepoliaNetwork) {
      toast.error(
        "Please ensure your wallet is connected to the Sepolia network."
      );
      setIsLoading(false);
      return;
    }

    if (!address) {
      toast.error("Cannot detect connected wallet address. Please reconnect.");
      setIsLoading(false);
      return;
    }

    try {
      const numericInsuranceType = insuranceTypeMapping[data.insuranceType];

      // Convert coverageAmount to appropriate format for contract
      // The contract expects this value in wei, so use ethers.utils.parseEther
      const coverageAmountWei = ethers.utils.parseEther(
        data.coverageAmount.toString()
      );

      let result;

      if (isEditMode && policyId !== undefined) {
        // Update existing policy
        result = await updatePolicy(
          policyId,
          data.name,
          data.description,
          coverageAmountWei,
          data.waitingPeriodDays,
          data.durationDays,
          data.coverageScope
        );
      } else {
        // Create new policy
        result = await createPolicy(
          data.name,
          data.description,
          numericInsuranceType,
          coverageAmountWei,
          data.waitingPeriodDays,
          data.durationDays,
          data.coverageScope
        );
      }

      if (result && result.receipt) {
        reset();
        if (onSuccess) {
          // Pass either the new policyId or the existing one
          const resultPolicyId = isEditMode
            ? policyId
            : result.policyId || null;
          onSuccess(resultPolicyId, data);
        }
      } else {
        console.error("Policy operation failed or was cancelled.");
      }
    } catch (error) {
      console.error("Error during policy operation:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const types: InsuranceType[] = [
    "Health",
    "Life",
    "Property",
    "Vehicle",
    "Travel",
    "Other",
  ];

  // Determine if the button should be disabled
  const canSubmit = isConnected && isSepoliaNetwork && !!address;
  const isButtonDisabled = isLoading || !canSubmit;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">
        {isEditMode ? "Update Complaint" : "Create New Complaint"}
      </h3>

      {!isConnected && (
        <p className="text-sm text-orange-600 mb-4">
          ⚠️ Please connect your company wallet.
        </p>
      )}

      {isConnected && !isSepoliaNetwork && (
        <p className="text-sm text-red-600 mb-4">
          ⚠️ Please switch to the Sepolia Test Network.
        </p>
      )}

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        {/* Policy Name */}
        <div>
          <label
            htmlFor="policy-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Complaint Name
          </label>
          <input
            id="policy-name"
            type="text"
            placeholder="e.g., Comprehensive Health Plan"
            {...register("name", { required: "Policy name is required" })}
            className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="policy-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="policy-description"
            rows={3}
            placeholder="Detailed description..."
            {...register("description", {
              required: "Description is required",
            })}
            className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.description ? "true" : "false"}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Insurance Type */}
          <div>
            <label
              htmlFor="policy-insuranceType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Complaint Type
            </label>
            <select
              id="policy-insuranceType"
              {...register("insuranceType", { required: "Type is required" })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.insuranceType ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.insuranceType ? "true" : "false"}
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.insuranceType && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.insuranceType.message}
              </p>
            )}
          </div>

          {/* Coverage Amount */}
          <div>
            <label
              htmlFor="policy-coverageAmount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Coverage Amount (ETH)
            </label>
            <input
              id="policy-coverageAmount"
              type="number"
              step="0.001"
              placeholder="e.g., 0.1"
              {...register("coverageAmount", {
                required: "Coverage amount is required",
                valueAsNumber: true,
                min: { value: 0, message: "Coverage must be non-negative" },
              })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.coverageAmount ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.coverageAmount ? "true" : "false"}
            />
            {errors.coverageAmount && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.coverageAmount.message}
              </p>
            )}
          </div>

          {/* Waiting Period */}
          <div>
            <label
              htmlFor="policy-waitingPeriodDays"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Average Waiting time (Days)
            </label>
            <input
              id="policy-waitingPeriodDays"
              type="number"
              placeholder="e.g., 30"
              {...register("waitingPeriodDays", {
                required: "Waiting period is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Waiting period must be non-negative",
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.waitingPeriodDays ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.waitingPeriodDays ? "true" : "false"}
            />
            {errors.waitingPeriodDays && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.waitingPeriodDays.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label
              htmlFor="policy-durationDays"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duration (Days)
            </label>
            <input
              id="policy-durationDays"
              type="number"
              placeholder="e.g., 365"
              {...register("durationDays", {
                required: "Duration is required",
                valueAsNumber: true,
                min: { value: 1, message: "Duration must be at least 1 day" },
              })}
              className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.durationDays ? "border-red-400" : "border-gray-300"
              }`}
              aria-invalid={errors.durationDays ? "true" : "false"}
            />
            {errors.durationDays && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {errors.durationDays.message}
              </p>
            )}
          </div>
        </div>

        {/* Coverage Scope */}
        <div>
          <label
            htmlFor="policy-coverageScope"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Laws
          </label>
          <input
            id="policy-coverageScope"
            type="text"
            placeholder="e.g., Hospitalization, Critical Illness"
            {...register("coverageScope", {
              required: "Coverage scope is required",
            })}
            className={`w-full px-4 py-2 border rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.coverageScope ? "border-red-400" : "border-gray-300"
            }`}
            aria-invalid={errors.coverageScope ? "true" : "false"}
          />
          {errors.coverageScope && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {errors.coverageScope.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full text-white py-3 rounded-lg transition duration-200 ease-in-out text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center ${
            isButtonDisabled
              ? "bg-gray-400 cursor-not-allowed opacity-70"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
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
              <span>Processing...</span>
            </>
          ) : isEditMode ? (
            "Update Complint"
          ) : (
            "Create Complint"
          )}
        </button>

        {isButtonDisabled && !isLoading && (
          <p className="text-center text-xs text-red-600 mt-2">
            Cannot {isEditMode ? "update" : "create"} Complint. Please ensure your
            wallet is connected to Sepolia.
          </p>
        )}
      </form>
    </div>
  );
};
