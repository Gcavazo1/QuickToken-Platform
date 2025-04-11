import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Dashboard' }) => {
  const router = useRouter();
  const { active, account } = useWeb3React();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      if (!mounted) return; // Skip check during SSR
      
      const token = localStorage.getItem('auth_token');
      console.log('Auth check:', { 
        hasToken: !!token, 
        isActive: active, 
        account: account 
      });
      
      // If no token and not connected with wallet, redirect to login
      if (!token && !active) {
        console.log('Redirecting to login: No token and not connected');
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router, active, mounted, account]);

  // Show a loading state during hydration
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-24 w-96 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 admin-area">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="md:pl-64">
        <AdminHeader title={title} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 