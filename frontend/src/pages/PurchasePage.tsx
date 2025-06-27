import { PurchaseInsurance } from "@/components/Insurance/PurchaseInsurance";
import { Shield } from "lucide-react";

const PurchasePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-health-light text-health-blue">
              <Shield className="mr-2 h-4 w-4" />
              <span>Get Protected</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2">Confirm Your FIR</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your coverage options and purchase your blockchain-secured
            FIR complaint system.
          </p>
        </div>

        <PurchaseInsurance />

        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-health-blue text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-medium text-lg">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your MetaMask wallet to enable secure blockchain
                  transactions.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-health-blue text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-medium text-lg">Select Coverage</h3>
                <p className="text-muted-foreground">
                  Choose the coverage amount that best meets your
                  needs.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-health-blue text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-medium text-lg">Make Payment</h3>
                <p className="text-muted-foreground">
                  Confirm your transaction in MetaMask to purchase your policy
                  securely on the blockchain.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-health-blue text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-medium text-lg">Get Coverage</h3>
                <p className="text-muted-foreground">
                  Your Complaint is instantly activated and verifiable on the
                  blockchain.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} FIR complaint system All rights
              reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PurchasePage;
