import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, ShieldPlus, Users, LogOut } from 'lucide-react';
import ConnectWallet from '@/components/WalletConnection/ConnectWallet';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export function AdminNavbar() {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users when on /admin/users route
  useEffect(() => {
    if (location.pathname === '/admin/users') {
      fetchUsers();
    }
  }, [location.pathname]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/user');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Existing Navbar UI - unchanged */}
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-white-900 to-white-800 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-black">
            <LayoutDashboard className="h-6 w-6 text-health-blue" />
            <span className="hidden sm:inline">Insurance Hub Admin</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center gap-2 text-sm font-medium text-black hover:text-health-blue transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium text-black hover:text-health-blue transition-colors"
            >
              <ShieldPlus className="h-4 w-4" />
              Policies
            </Link>
            <Link 
              to="/admin/users" 
              className="flex items-center gap-2 text-sm font-medium text-black hover:text-health-blue transition-colors"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ConnectWallet />
            <Button variant="ghost" size="icon" className="text-black hover:bg-blue-300">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-black hover:text-health-blue transition-colors">
                <LogOut className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Users Table - Only shown on /admin/users route */}
      {location.pathname === '/admin/users' && (
        <div className="p-6 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Admin</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {users.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No users found</h3>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}