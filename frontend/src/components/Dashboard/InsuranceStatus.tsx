import { useEffect, useState } from "react";
import { useContract } from "../../../context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export function InsuranceStatus() {
  const { address, getUserPurchases, isConnected, isSepoliaNetwork } =
    useContract();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!isConnected || !isSepoliaNetwork || !address) {
        toast.error("Please connect your wallet on Sepolia network.");
        return;
      }

      try {
        const data = await getUserPurchases(address);
        setPurchases(data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        toast.error("Failed to fetch purchased policies.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [getUserPurchases, address, isConnected, isSepoliaNetwork]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} className="h-60 rounded-xl" />
        ))}
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center mt-12 space-y-4">
        <div className="text-muted-foreground">
          No complaints yet.
        </div>
        <Button asChild className="w-52 bg-blue-600 hover:bg-blue-700 ">
          <Link to="/purchase">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add new Complaint
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {purchases.map((purchase, idx) => {
        const policy = purchase.policy;
        const purchaseDate = new Date(
          purchase.purchaseDate
        ).toLocaleDateString();

        return (
          <Card
            key={idx}
            className="
    bg-white
    rounded-lg
    border border-blue-200     
    shadow-sm                  
    hover:shadow-md            
    transition-shadow duration-200 
  "
          >
            <CardHeader className="p-4 border-b border-blue-100">
              <CardTitle className="text-base font-semibold text-blue-700 mb-1">
                {" "}
                {/* Slightly smaller title */}
                {policy.name}
              </CardTitle>
              <p className="text-sm text-gray-500">
                {" "}
                {/* Standard muted color for description */}
                {policy.description}
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {" "}
              {/* Basic padding and spacing */}
              {/* Using conceptual InfoRow component */}
              <InfoRow
                label="Coverage Amount"
                value={`${policy.coverageAmount} ETH`}
              />
              <InfoRow label="Period" value={`${policy.durationDays} days`} />
              <InfoRow label="Purchase Date" value={purchaseDate} />
              <InfoRow
                label="Waiting Period"
                value={`${policy.waitingPeriodDays} days`}
              />
              {/* Simplified Status Section */}
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-blue-100">
                {" "}
                {/* Basic separation */}
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
                <span
                  className={`
          text-xs font-semibold
          px-2.5 py-0.5           // Standard badge padding
          rounded-full
          ${
            policy.isActive
              ? "bg-green-100 text-green-800" // Simple active badge
              : "bg-gray-100 text-gray-700" // Simple inactive/expired badge
          }
        `}
                >
                  {policy.isActive ? "Active" : "Expired"}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-blue-600">{value}</span>
  </div>
);
