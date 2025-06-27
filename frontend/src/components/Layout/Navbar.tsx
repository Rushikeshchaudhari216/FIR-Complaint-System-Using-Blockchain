import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Menu,
  X,
  Home,
  LayoutDashboard,
  ShieldPlus,
} from "lucide-react";
import ConnectWallet from "@/components/WalletConnection/ConnectWallet";
import { useContract } from "../../../context/index";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();
  const { checkUserRegistration } = useContract();

  // Check blockchain registration status when the component mounts
  useEffect(() => {
    async function fetchRegistrationStatus() {
      const registered = await checkUserRegistration();
      setIsRegistered(registered);
    }
    fetchRegistrationStatus();
  }, [checkUserRegistration]);

  const handleLogout = () => {
    localStorage.removeItem("userCreds");
    setIsRegistered(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Shield className="h-6 w-6 text-health-blue" />
          <span className="hidden sm:inline">FIR complaint system</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium hover:text-health-blue transition-colors"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium hover:text-health-blue transition-colors"
          >
            User Dashboard
          </Link>
          <Link
            to="/purchase"
            className="text-sm font-medium hover:text-health-blue transition-colors"
          >
            confirm complaint
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ConnectWallet />

          {isRegistered ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          )}

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

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="container md:hidden py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="h-4 w-4" />
            Police Dashboard
          </Link>

          <Link
            to="/purchase"
            className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShieldPlus className="h-4 w-4" />
            confirm complaint
          </Link>
        </div>
      )}
    </header>
  );
}
