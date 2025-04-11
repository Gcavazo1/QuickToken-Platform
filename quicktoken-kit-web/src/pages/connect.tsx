import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useAccount, useDisconnect, useConfig, createConfig } from 'wagmi';
import { useRouter } from 'next/router';
import { LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

const ConnectWallet: NextPage = () => {
  const config = useConfig();
  const { isConnected } = useAccount();
  const { disconnectAsync: disconnect } = useDisconnect();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { returnUrl } = router.query;

  // Redirect to admin or provided return URL if already connected
  useEffect(() => {
    if (isConnected && !isRedirecting) {
      setIsRedirecting(true);
      const redirectPath = typeof returnUrl === 'string' ? returnUrl : '/admin';
      router.push(redirectPath);
    }
  }, [isConnected, router, returnUrl, isRedirecting]);

  const handleConnect = () => {
    // We'll redirect to the dapp page which has the wallet connection UI
    router.push('/dapp');
  };

  return (
    <>
      <Head>
        <title>Connect Wallet | QuickToken</title>
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">QuickToken</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Connect your wallet
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Connect to the QuickToken admin dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isConnected ? (
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 mx-auto">
                  <LockClosedIcon className="h-6 w-6 text-green-600 dark:text-green-300" aria-hidden="true" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Wallet connected</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You're being redirected to the dashboard...
                </p>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => disconnect()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Choose how to connect:
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleConnect}
                      className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                    >
                      <span>Connect Wallet</span>
                      <ArrowRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link 
                    href="/"
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    Return to home page
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectWallet; 