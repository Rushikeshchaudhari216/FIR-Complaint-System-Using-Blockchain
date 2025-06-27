import { AdminNavbar } from "@/components/Admin/AdminNavbar";
import { Shield, User, Building, Check, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useContract } from "../../../context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboard() {
  const {
    getAllCompanies,
    getCompanyCount,
    getUserCount,
    isOwner,
    verifyCompany,
    getCompanyDetails,
  } = useContract();

  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    verifiedCompanies: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load companies
        const allCompanies = await getAllCompanies();
        const verifiedCompanies = allCompanies.filter((c) => c.isVerified);
        const unverifiedCompanies = allCompanies.filter((c) => !c.isVerified);

        // Load stats
        const totalCompanies = await getCompanyCount();
        const totalUsers = await getUserCount();

        setCompanies(unverifiedCompanies);
        setStats({
          totalCompanies: parseInt(totalCompanies, 10),
          verifiedCompanies: verifiedCompanies.length,
          totalUsers: parseInt(totalUsers, 10),
        });
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOwner) loadData();
  }, [isOwner, getAllCompanies, getCompanyCount, getUserCount]);

  const handleVerifyCompany = async (companyAddress) => {
    try {
      setVerifying(true);
      const receipt = await verifyCompany(companyAddress);

      if (receipt) {
        toast.success("Company verified successfully!");
        // Refresh companies list
        const allCompanies = await getAllCompanies();
        setCompanies(allCompanies.filter((c) => !c.isVerified));
      }
    } catch (error) {
      toast.error("Verification failed");
      console.error("Verification error:", error);
    } finally {
      setVerifying(false);
      setDetailsOpen(false);
    }
  };

  const handleViewCompanyDetails = async (companyAddress) => {
    try {
      const details = await getCompanyDetails(companyAddress);
      setSelectedCompany({
        address: companyAddress,
        ...details,
        registrationDate: new Date(details.registrationDate),
      });
      setDetailsOpen(true);
    } catch (error) {
      toast.error("Failed to load company details");
      console.error("Details error:", error);
    }
  };
  const fetchDetails = async () => {
    const result = await getCompanyDetails(
      "0x553B4b878C8134b1f0FF84874f421667558fae19"
    ); // or pass specific address like getCompanyDetails("0x123...")
    console.log("Fetched Company Details:", result);
  };

  fetchDetails();

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-4 text-gray-600">
            You must be the platform owner to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="container py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Building className="h-6 w-6 text-blue-600" />}
            title="Pending Companies"
            value={companies.length}
            loading={loading}
          />
          <StatCard
            icon={<User className="h-6 w-6 text-green-600" />}
            title="Active Users"
            value={stats.totalUsers}
            loading={loading}
          />
          <StatCard
            icon={<Shield className="h-6 w-6 text-purple-600" />}
            title="Verified Companies"
            value={stats.verifiedCompanies}
            loading={loading}
          />
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Pending Companies</h3>
          </div>

          {loading ? (
            <TableSkeleton />
          ) : companies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pending companies to verify
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table body remains same as before */}
              </table>
            </div>
          )}
        </div>

        {/* Company Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            {/* Dialog content remains same but with better date handling */}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

// Additional components
const StatCard = ({ icon, title, value, loading }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-opacity-20 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        {loading ? (
          <Skeleton className="h-8 w-16 mt-1" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="p-6 space-y-4">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </div>
);
