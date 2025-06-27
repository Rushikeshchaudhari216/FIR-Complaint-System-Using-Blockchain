import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Layout/Navbar";
import { Shield, Check, ArrowRight, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <span className="float-end mt-2 mr-3">
          <Link to="/company/dashboard">Police Dashboard</Link>
        </span>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-health-light text-health-blue">
                <Shield className="mr-2 h-4 w-4" />
                <span>Blockchain-secured Fir Complaint system</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-health-blue to-health-teal bg-clip-text text-transparent">
              Decentralized FIR complaint system
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Secure, transparent, and efficient health insurance powered by
              blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-health-blue hover:bg-health-dark"
              >
                <Link to="/purchase">
                  confirm complaint
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-health-blue text-health-blue hover:bg-health-light"
              >
                {/* <Link to="/dashboard"> Dashboard</Link> */}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose FIR complaint system?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="rounded-full bg-health-light w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-health-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Secure & Transparent
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  All policies are stored on the blockchain, providing complete
                  transparency and immutability.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="rounded-full bg-health-light w-12 h-12 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-health-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Instant Verification
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Police providers can instantly verify your coverage
                  without paperwork or administrative delays.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
                <div className="rounded-full bg-health-light w-12 h-12 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-health-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Pay with Crypto</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use cryptocurrency to pay for your insurance premiums,
                  enabling global access and eliminating currency barriers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="health-card">
              <div className="health-card-inner flex flex-col md:flex-row justify-between items-center">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Ready to secure your system?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-0">
                    Get started with FIR complaint system blockchain-based insurance
                    coverage today.
                  </p>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="bg-health-blue hover:bg-health-dark whitespace-nowrap"
                >
                  <Link to="/purchase">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-health-blue mr-2" />
              <span className="font-bold text-xl">FIR complaint system</span>
            </div>

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

export default Index;
