'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            onClick={() => router.push('/dashboard')}
            className="cursor-pointer flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold shadow-sm">
              B
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">Baraka</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/dashboard" label="Dashboard" router={router} pathname={pathname} />
            <NavLink href="/academic" label="Academic" router={router} pathname={pathname} />
            <NavLink href="/goals" label="Goals" router={router} pathname={pathname} />
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-gray-800 font-semibold truncate max-w-[140px]">
                {user?.username || 'User'}
              </span>
            </motion.button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-4">
            <NavLink href="/dashboard" label="Dashboard" router={router} pathname={pathname} mobile />
            <NavLink href="/academic" label="Academic" router={router} pathname={pathname} mobile />
            <NavLink href="/goals" label="Goals" router={router} pathname={pathname} mobile />
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}

function NavLink({ href, label, router, pathname, mobile = false }) {
  const isActive = pathname === href;

  return (
    <motion.button
      onClick={() => router.push(href)}
      className={`${
        mobile ? 'text-sm px-3 py-2' : ''
      } font-medium transition-colors ${
        isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-700 hover:text-blue-600'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}

