import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectWallet from "../WalletConnection/ConnectWallet";

export function CompanyNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem("isCompanyLoggedIn");
    setIsLoggedIn(isLogged === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isCompanyLoggedIn");
    localStorage.removeItem("companyEmail");
    localStorage.removeItem("companyAddress");
    setIsLoggedIn(false);
    navigate("/company/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6 text-blue-600" />
          <span className="hidden sm:inline">FIR complaint system</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/company/dashboard"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ConnectWallet />
          {isLoggedIn ? (
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link to="/company/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/company/register">
                <Button>Register</Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <div className="container mx-auto md:hidden px-4 py-4 flex flex-col gap-4">
          {/* <Link
            to="/"
            className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link> */}
          <Link
            to="/company/dashboard"
            className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="text-sm font-medium px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/company/login"
                className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/company/register"
                className="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
