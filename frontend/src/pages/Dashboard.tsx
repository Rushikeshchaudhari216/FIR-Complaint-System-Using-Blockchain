import { Navbar } from "@/components/Layout/Navbar";
import { InsuranceStatus } from "@/components/Dashboard/InsuranceStatus";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, FileText } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your complaints and account
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-health-light dark:bg-health-dark/20 px-3 py-1 rounded-full">
            <Shield className="h-4 w-4 text-health-blue" />
            <span className="text-sm font-medium text-health-blue">
              Protected by Blockchain
            </span>
          </div>
        </div>

        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger
              value="policies"
              className="data-[state=active]:bg-health-blue data-[state=active]:text-white"
            >
              <Shield className="mr-2 h-4 w-4" />
              complaints
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-health-blue data-[state=active]:text-white"
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies">
            <InsuranceStatus />
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  View and manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Connected Wallet</h3>
                    <p className="text-sm bg-muted p-2 rounded">
                      {window.ethereum?.selectedAddress ||
                        "No wallet connected"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Network</h3>
                    <p className="text-sm bg-muted p-2 rounded">
                      Ethereum Testnet
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-md mt-6">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">
                      Important Note
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-500">
                      This is a demonstration dApp running on a testnet. No real
                      cryptocurrency is used and no real complaints are
                      provided.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} FIR complaint system. All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
