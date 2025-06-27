import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Removed Input import as it's not directly used for shown fields
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Wallet, Loader2, AlertCircle } from "lucide-react";
import { useContract } from "../../../context"; // Ensure path is correct
import { Skeleton } from "@/components/ui/skeleton";

interface PolicyDetails {
  policyId: number;
  name: string;
  description: string;
  insuranceType: number;
  companyAddress: string;
  isActive: boolean;
  coverageAmount: string;
  waitingPeriodDays: number;
  durationDays: number;
  creationDate: Date;
  coverageScope: string;
}

interface PurchaseDetails {
  purchaseId: number;
  policyId: number;
  userAddress: string;
  purchaseDate: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  policy: PolicyDetails;
}

interface SelectablePolicyOld {
  id: string;
  name: string;
  coverageAmount: number; // Expects number for old calculation
}

export function PurchaseInsurance() {
  const navigate = useNavigate();

  const {
    address,
    getAllPolicies,
    getUserPurchases,
    purchasePolicy,
    isConnected,
    isSepoliaNetwork,
  } = useContract();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [policies, setPolicies] = useState<SelectablePolicyOld[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    coverageType: "",
    coverageAmount: "0.5", // Stored as string, parsed in calc
    coveragePeriod: "1",
  });

  const loadAndFilterPolicies = useCallback(async () => {
    if (!isConnected || !isSepoliaNetwork || !address) {
      setLoadingPolicies(false);
      setPolicies([]);
      return;
    }
    setLoadingPolicies(true);
    setError(null);
    try {
      const [allPoliciesResult, userPurchasesResult] = await Promise.all([
        getAllPolicies(),
        getUserPurchases(address),
      ]);
      const purchasedPolicyIds = new Set(
        userPurchasesResult.map((purchase) => purchase.policyId)
      );
      const filteredPolicies = allPoliciesResult.filter(
        (policy: PolicyDetails) =>
          policy.isActive === true && !purchasedPolicyIds.has(policy.policyId)
      );
      const transformed: SelectablePolicyOld[] = filteredPolicies.map(
        (policy: PolicyDetails) => {
          const coverageString = policy.coverageAmount || "0";
          const numericMatch = coverageString.match(/^[+-]?(\d*\.)?\d+/);
          const coverageNum = numericMatch ? parseFloat(numericMatch[0]) : 0;
          return {
            id: policy.policyId.toString(),
            name: policy.name,
            coverageAmount: isNaN(coverageNum) ? 0 : coverageNum,
          };
        }
      );
      setPolicies(transformed);
      if (transformed.length > 0) {
        setFormData({
          coverageType: transformed[0].id,
          coverageAmount: transformed[0].coverageAmount.toString(),
          coveragePeriod: "1",
        });
      } else {
        setFormData({
          coverageType: "",
          coverageAmount: "0",
          coveragePeriod: "1",
        });
      }
    } catch (err) {
      console.error("Failed to load or filter policies:", err);
      toast.error("Error loading available policies.");
      setError("Could not load policies. Please refresh.");
      setPolicies([]);
    } finally {
      setLoadingPolicies(false);
    }
  }, [
    address,
    isConnected,
    isSepoliaNetwork,
    getAllPolicies,
    getUserPurchases,
  ]);

  useEffect(() => {
    loadAndFilterPolicies();
  }, [loadAndFilterPolicies]);

  const calculatePremium = useCallback((): string => {
    if (!formData.coverageType || policies.length === 0) return "0.0000";
    const amount = parseFloat(formData.coverageAmount);
    const years = parseInt(formData.coveragePeriod) || 1;
    const selected = policies.find((p) => p.id === formData.coverageType);

    if (isNaN(amount) || !selected) {
      return "0.0000";
    }

    let multiplier = 0.1;
    if (selected.name.toLowerCase().includes("premium")) multiplier = 0.15;
    if (selected.name.toLowerCase().includes("comprehensive")) multiplier = 0.2;

    const calculatedPremium = amount * multiplier * years;
    const finalPremium = Math.max(0, calculatedPremium);
    return finalPremium.toFixed(4);
  }, [
    formData.coverageAmount,
    formData.coveragePeriod,
    formData.coverageType,
    policies,
  ]);

  const handleSelectChange = (name: string) => (value: string) => {
    if (name === "coverageType") {
      const selected = policies.find((policy) => policy.id === value);
      setFormData((prev) => ({
        ...prev,
        coverageType: value,
        coverageAmount: selected?.coverageAmount.toString() || "0",
      }));
    } else if (name === "coveragePeriod") {
      setFormData((prev) => ({ ...prev, coveragePeriod: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !isSepoliaNetwork || !address) {
      toast.error("Please connect your wallet on Sepolia network first.");
      return;
    }
    if (!formData.coverageType) {
      toast.warning("Please select an insurance policy.");
      return;
    }
    setIsSubmitting(true);
    try {
      const premium = calculatePremium();
      const result = await purchasePolicy(
        parseInt(formData.coverageType, 10),
        premium
      );
      if (result && result.receipt) {
        toast.success("Purchase successful! Redirecting...");
        navigate("/dashboard");
      } else {
        console.error("Purchase failed or was cancelled.");
      }
    } catch (error) {
      console.error("Purchase submission error:", error);
      toast.error("Failed to submit purchase request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-start py-12 px-4 min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-lg mx-auto shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Confirm Complaint
          </CardTitle>
          <CardDescription>
            Select an available complaint and secure your coverage on the
            blockchain.
          </CardDescription>
        </CardHeader>

        {loadingPolicies && (
          <CardContent>
            {" "}
            <div className="space-y-4 p-4">
              {" "}
              <Skeleton className="h-8 w-1/3" />{" "}
              <Skeleton className="h-10 w-full" />{" "}
              <Skeleton className="h-8 w-1/3 mt-4" />{" "}
              <Skeleton className="h-10 w-full" />{" "}
              <Skeleton className="h-8 w-1/3 mt-4" />{" "}
              <Skeleton className="h-10 w-full" />{" "}
            </div>{" "}
          </CardContent>
        )}
        {!loadingPolicies && error && (
          <CardContent>
            {" "}
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
              role="alert"
            >
              {" "}
              <strong className="font-bold">Error!</strong>{" "}
              <span className="block sm:inline"> {error}</span>{" "}
            </div>{" "}
          </CardContent>
        )}
        {!loadingPolicies && !error && policies.length === 0 && (
          <CardContent>
            {" "}
            <div
              className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative text-center"
              role="alert"
            >
              {" "}
              <strong className="font-bold">No complaints Available!</strong>{" "}
              <span className="block sm:inline">
                {" "}
                There are currently no active complaints available for you to
                view.
              </span>{" "}
            </div>{" "}
          </CardContent>
        )}

        {!loadingPolicies && !error && policies.length > 0 && (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coverageType" className="font-semibold">
                  Select Insurance Policy
                </Label>
                <Select
                  value={formData.coverageType}
                  onValueChange={handleSelectChange("coverageType")}
                  disabled={loadingPolicies || isSubmitting}
                  required
                >
                  <SelectTrigger id="coverageType">
                    <SelectValue placeholder="Choose a policy..." />
                  </SelectTrigger>
                  <SelectContent>
                    {policies.map((policy) => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverageAmountDisplay">
                  Coverage Amount (ETH)
                </Label>
                <div
                  id="coverageAmountDisplay"
                  className="w-full px-4 py-2.5 border rounded-lg text-sm bg-gray-100 text-gray-700"
                >
                  {formData.coverageAmount} ETH
                </div>
                <p className="text-sm text-muted-foreground">
                  This is the maximum payout amount for the selected complaint.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coveragePeriod" className="font-semibold">
                  Select gender
                </Label>
                <Select
                  value={formData.coveragePeriod}
                  onValueChange={handleSelectChange("coveragePeriod")}
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger id="coveragePeriod">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                    <SelectItem value="3">Trancegender</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mt-6 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">
                    Premium to Pay:
                  </span>
                  <span className="font-bold text-blue-600 text-xl">
                    {calculatePremium()} ETH
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting ||
                  loadingPolicies ||
                  !formData.coverageType ||
                  !isConnected ||
                  !isSepoliaNetwork
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Purchase...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" /> List complaint
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
