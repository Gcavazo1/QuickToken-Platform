import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ArrowRightIcon, ShieldCheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import { injectedConnector } from '../../utils/web3';
import { isAuthorizedAdmin } from '../../lib/auth';

const AdminLogin: NextPage = () => {
  const router = useRouter();
  const { account, activate, deactivate, active, library } = useWeb3React();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // After component mounts, we can safely use client-side features
  useEffect(() => {
    setMounted(true);
  }, []);

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    const checkAuth = async () => {
      if (active && typeof window !== 'undefined') {
        // Check if token exists in local storage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          router.push('/admin');
        }
      }
    };
    
    if (mounted) {
      checkAuth();
    }
  }, [active, router, mounted]);

  // Check if the connected wallet is authorized as admin
  useEffect(() => {
    async function checkAuthorization() {
      if (!active || !account) {
        setIsAuthorized(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const authorized = await isAuthorizedAdmin(account);
        setIsAuthorized(authorized);
        
        // If authorized, set auth token and redirect to admin dashboard
        if (authorized) {
          // Store the auth token in localStorage - this is crucial to prevent redirect loops
          localStorage.setItem('auth_token', `wallet_${account.toLowerCase()}`);
          router.push('/admin');
        }
      } catch (err) {
        console.error('Error checking admin authorization:', err);
        setError('Failed to verify admin status. Please try again.');
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkAuthorization();
  }, [account, active, router]);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      await activate(injectedConnector);
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (err: any) {
      console.error('Disconnect error:', err);
    }
  };

  // Safely format account for display to prevent hydration errors
  const displayAccount = mounted && account 
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : 'Not connected';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 admin-area">
      <Head>
        <title>Admin Login | QuickToken Kit</title>
        <meta name="description" content="Login to the QuickToken Kit admin dashboard" />
      </Head>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Image 
              src="/quicktoken_logo.png" 
              alt="QuickToken Logo" 
              width={64} 
              height={64} 
              className="mx-auto"
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Admin Dashboard
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Connect your wallet to access the admin area
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="block w-full p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-center text-gray-700 dark:text-gray-300">
                  {mounted && active && account ? (
                    <div className="flex items-center justify-center">
                      <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-mono">
                        {displayAccount}
                      </span>
                    </div>
                  ) : (
                    <span>No wallet connected</span>
                  )}
                </div>
              </div>
            </div>

            {mounted && !active ? (
              <div>
                <button
                  onClick={connectWallet}
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connect Wallet
                </button>
                <div className="text-xs text-center mt-4 text-gray-500 dark:text-gray-400">
                  Please make sure you have MetaMask or another Ethereum wallet installed
                </div>
              </div>
            ) : mounted && active ? (
              <div className="space-y-4">
                {isChecking ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : isAuthorized === false ? (
                  <div className="mt-6">
                    <div className="rounded-md bg-yellow-50 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <ShieldCheckIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Unauthorized Wallet</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>This wallet is not authorized for admin access.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isChecking}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isChecking ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Access Admin Dashboard 
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex justify-center py-4">
                <div className="animate-pulse rounded-full bg-gray-300 dark:bg-gray-700 h-8 w-32"></div>
              </div>
            )}
            
            <div className="text-center">
              <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500">
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 