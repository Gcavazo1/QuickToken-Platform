import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  MoonIcon, 
  SunIcon, 
  BellIcon 
} from '@heroicons/react/24/outline';
import { useWeb3React } from '@web3-react/core';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { shortenAddress } from '../../utils/web3';

interface AdminHeaderProps {
  title?: string;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function AdminHeader({ title = 'Dashboard', sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const { account } = useWeb3React();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After component mounts, we can safely show the UI that depends on client-side data
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const userNavigation = [
    { name: 'Your Profile', href: '/admin/profile' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/admin/login';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Helper function to safely render React nodes
  const safeRender = (item: any) => {
    if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
      return item;
    }
    return null;
  };

  // Don't render certain parts until after hydration to avoid mismatch
  const displayAddress = mounted && account ? account.slice(2, 4).toUpperCase() : '--';
  const shortenedAddress = mounted && account ? shortenAddress(account) : 'Not connected';

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {setSidebarOpen && (
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
          
          <div className="flex-1 flex justify-between items-center">
            <Link 
              href="/admin" 
              className="flex-shrink-0 text-xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </Link>
            
            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              )}
              
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              
              {/* Profile dropdown */}
              <Menu as="div" className="ml-3 relative">
                <div>
                  <Menu.Button className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                      {displayAddress}
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 py-1 focus:outline-none">
                    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      <p className="font-medium">Connected Wallet</p>
                      <p className="truncate">{shortenedAddress}</p>
                    </div>
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            href={item.href}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 