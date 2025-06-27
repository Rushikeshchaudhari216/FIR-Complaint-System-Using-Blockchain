import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PurchasePage from "./pages/PurchasePage";
import NotFound from "./pages/NotFound";

import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { InsuranceForm } from "./components/Admin/InsuranceForm";

import { Login } from "./components/User/Login";
import { Navbar } from "./components/Layout/Navbar";
import { Register } from "./components/User/Register";
import { AdminLogin } from "./components/Admin/AdminLogin";
import { AdminRegister } from "./components/Admin/AdminRegister";
import { CompanyRegister } from "./components/Company/CompanyRegister";
import { CompanyLogin } from "./components/Company/CompanyLogin";
import CompanyDashboard from "./components/Company/CompanyDashboard";
import { CompanyNavbar } from "./components/Company/CompanyNavbar";

import "@rainbow-me/rainbowkit/styles.css";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";

// Import ContractProvider
import { ContractProvider } from "../context/index.jsx";
import { AdminNavbar } from "./components/Admin/AdminNavbar.js";
import AdminLoginAndVerify from "./components/Company/AdminLoginAndVerify.js";
import VerifyCompany from "./components/Company/VerifyCompany.js";

// For TypeScript support with window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Initialize RainbowKit wallets
const { wallets } = getDefaultWallets({
  appName: "Insurance Platform",
  projectId: "edf734b841b615e14bcf6be4f388bdac",
  chains: [sepolia],
});

// Set up connectors

// Create Wagmi config
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "#7b3fe4",
          accentColorForeground: "white",
          borderRadius: "medium",
        })}
      >
        {/* Add ContractProvider here, after RainbowKitProvider but before the rest of your app */}
        <ContractProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Routes with navbar */}
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <Index />
                    </>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <>
                      <Navbar />
                      <Dashboard />
                    </>
                  }
                />
                <Route
                  path="/purchase"
                  element={
                    <>
                      <Navbar />
                      <PurchasePage />
                    </>
                  }
                />

                {/* Admin Dashboard (with or without navbar depending on your preference) */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Auth pages (no navbar) */}
                <Route
                  path="/login"
                  element={
                    <>
                      <Navbar />
                      <Login />
                    </>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <>
                      <Navbar />
                      <Register />
                    </>
                  }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/users" element={<AdminNavbar />} />

                {/* Company routes */}

                <Route
                  path="/company/register"
                  element={
                    <>
                      <Navbar />
                      <CompanyRegister />
                    </>
                  }
                />
                <Route
                  path="/company/login"
                  element={
                    <>
                      <Navbar />
                      <CompanyLogin />
                      {/* <AdminLoginAndVerify /> */}
                    </>
                  }
                />
                <Route path="/company/verify" element={<VerifyCompany />} />
                <Route
                  path="/company/insuranceForm"
                  element={
                    <>
                      <CompanyNavbar />
                      <InsuranceForm
                        open={false}
                        onOpenChange={function (open: boolean): void {
                          throw new Error("Function not implemented.");
                        }}
                        onSubmit={function (data: any): void {
                          throw new Error("Function not implemented.");
                        }}
                        initialData={undefined}
                      />
                    </>
                  }
                />
                <Route
                  path="/company/dashboard"
                  element={
                    <>
                      <CompanyNavbar />
                      <CompanyDashboard />
                    </>
                  }
                />
                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ContractProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
