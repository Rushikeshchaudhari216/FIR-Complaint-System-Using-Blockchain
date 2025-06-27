import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  InsuranceForm,
  InsuranceFormData,
} from "@/components/Company/InsuranceForm";
import { useContract } from "../../../context";
import { Skeleton } from "@/components/ui/skeleton";

interface Policy {
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

const insuranceTypeDisplayMapping: Record<number, string> = {
  0: "Health",
  1: "Life",
  2: "Property",
  3: "Vehicle",
  4: "Travel",
  5: "Other",
};

const CompanyDashboard = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);

  const {
    getCompanyPolicies,
    deactivatePolicy,
    address,
    isConnected,
    isSepoliaNetwork,
    isCompanyVerified,
  } = useContract();

  const loadPolicies = useCallback(async () => {
    if (!isConnected || !isSepoliaNetwork || !isCompanyVerified || !address) {
      setIsLoading(false);
      setPolicies([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const companyPolicies = await getCompanyPolicies(address);
      setPolicies(companyPolicies || []);
    } catch (err) {
      console.error("Error fetching company policies:", err);
      toast.error("Failed to fetch insurance policies.");
      setError("Could not load policies. Please try refreshing.");
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    address,
    isConnected,
    isSepoliaNetwork,
    isCompanyVerified,
    getCompanyPolicies,
  ]);

  useEffect(() => {
    loadPolicies();
  }, [loadPolicies]);

  const handlePolicyCreated = (policyId: number | null) => {
    setIsFormOpen(false);
    loadPolicies();
  };

  const handleDeactivatePolicy = async (policyId: number) => {
    if (deactivatingId) return;

    setDeactivatingId(policyId);
    try {
      const receipt = await deactivatePolicy(policyId);
      if (receipt) {
        loadPolicies();
      }
    } catch (err) {
      console.error("Error during deactivation process:", err);
      toast.error("Failed to submit deactivation request.");
    } finally {
      setDeactivatingId(null);
    }
  };

  const handleOpenEditForm = (policy: Policy) => {
    toast.info("Edit functionality not yet implemented.");
  };

  const calculateTotalRevenue = () => {
    return policies
      .reduce((acc, policy) => {
        const amount = parseFloat(policy.coverageAmount || "0");
        return acc + (isNaN(amount) ? 0 : amount);
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Police Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Complaints Created
            </h2>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <p className="text-4xl font-bold text-blue-600">
                {policies.length}
              </p>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Coverage Value*
            </h2>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <p className="text-4xl font-bold text-green-600">
                ₹ {calculateTotalRevenue()}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              *Sum of coverage amounts. May not represent actual revenue.
            </p>
          </div>
        </div>

        <div className="mb-8 flex justify-end">
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 w-5 h-5" /> Add New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Add New FIR complaint
                </DialogTitle>
              </DialogHeader>
              <InsuranceForm
                initialData={null}
                onSuccess={handlePolicyCreated}
                isEditMode={false}
              />
            </DialogContent>
          </Dialog>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Complaints
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : policies.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-md text-center text-gray-500 border border-gray-200">
            You haven't created any Complaints yet. Click "Add New
            Complaints" to start.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <div
                key={policy.policyId}
                className={`bg-white p-5 rounded-xl shadow-md flex flex-col justify-between border border-gray-200 ${
                  !policy.isActive ? "opacity-60 bg-gray-50" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {policy.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        policy.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {policy.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {policy.description}
                  </p>
                  <div className="space-y-1 text-sm mb-4 border-t pt-3 mt-3">
                    <p>
                      <strong className="font-medium text-gray-700">
                        Type:
                      </strong>{" "}
                      {insuranceTypeDisplayMapping[policy.insuranceType] ||
                        "Unknown"}
                    </p>
                    <p>
                      <strong className="font-medium text-gray-700">
                        Coverage:
                      </strong>{" "}
                      ₹ {policy.coverageAmount}
                    </p>
                    <p>
                      <strong className="font-medium text-gray-700">
                        Duration:
                      </strong>{" "}
                      {policy.durationDays} days
                    </p>
                    <p>
                      <strong className="font-medium text-gray-700">
                        Waiting Period:
                      </strong>{" "}
                      {policy.waitingPeriodDays} days
                    </p>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditForm(policy)}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </Button> */}
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={
                      !policy.isActive || deactivatingId === policy.policyId
                    }
                    onClick={() => handleDeactivatePolicy(policy.policyId)}
                  >
                    {deactivatingId === policy.policyId ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Deactivate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
