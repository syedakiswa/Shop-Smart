import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { auth } from '../lib/firebase';
import { ShoppingCart, LogOut, LayoutDashboard, Package } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <ShoppingCart className="h-6 w-6 text-emerald-500" />
            <span>ShopSmart</span>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/products" className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white">
                  <Package className="h-4 w-4" />
                  Products
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
