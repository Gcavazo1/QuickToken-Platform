import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import { isAuthorizedAdmin } from '../../../lib/auth';
import AdminLayout from '../../../components/admin/AdminLayout';
import TokensTable from '../../../components/admin/TokensTable';
import { PlusIcon } from '@heroicons/react/24/outline';
import { getTokens, Token } from '../../../lib/tokenManagement';
import Link from 'next/link';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';

export default function Tokens() {
  const router = useRouter();
  const { account, active } = useWeb3React();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { 
    deployments, 
    loading, 
    refreshData 
  } = useAdminDashboard();

  useEffect(() => {
    async function checkAuth() {
      if (!active || !account) {
        router.push('/admin/login');
        return;
      }

      try {
        const authorized = await isAuthorizedAdmin(account);
        setIsAuthorized(authorized);
        
        if (!authorized) {
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Failed to check admin authorization:', error);
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [account, active, router]);

  if (loading) {
    return (
      <AdminLayout title="Tokens">
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthorized) {
    return null; // This will redirect to login, so no need to render anything
  }

  const tokens = deployments.map(d => ({
    id: d.id || '',
    contractAddress: d.contractAddress,
    name: d.name,
    symbol: d.symbol,
    supply: parseFloat(d.maxSupply),
    mintFee: parseFloat(d.mintFee),
    lockDuration: typeof d.lockDuration === 'string' ? parseInt(d.lockDuration) : d.lockDuration,
    deployedBy: d.deployerAddress || '',
    network: d.network,
    deploymentTx: d.transactionHash,
    deploymentDate: d.deploymentDate || ''
  }));

  return (
    <>
      <Head>
        <title>Manage Tokens | QuickToken Admin</title>
        <meta name="description" content="Manage deployed tokens in QuickToken Admin" />
      </Head>

      <AdminLayout title="Tokens">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">All Tokens</h1>
            <div className="mt-3 sm:mt-0 flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                onClick={refreshData}
              >
                Refresh Data
              </button>
              <button
                type="button" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => router.push('/admin/deploy')}
              >
                Deploy New Token
              </button>
            </div>
          </div>

          {/* Token data */}
          <div className="mt-6">
            {tokens.length > 0 ? (
              <TokensTable tokens={tokens} isLoading={loading} />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tokens found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by deploying your first token.</p>
                <div className="mt-6">
                  <Link 
                    href="/admin/deploy"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Deploy New Token
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
} 