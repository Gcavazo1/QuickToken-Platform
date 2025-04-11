import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { isAuthorizedAdmin } from '../../lib/auth';
import AdminLayout from '../../components/admin/AdminLayout';
import { CurrencyDollarIcon, UserGroupIcon, CreditCardIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { shortenAddress, formatDate } from '../../utils/formatters';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import TokensTable from '../../components/admin/TokensTable';

export default function AdminDashboard() {
  const router = useRouter();
  const { account, active } = useWeb3React();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { 
    deployments, 
    clients, 
    projects, 
    stats, 
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

  // Empty state component
  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthorized) {
    return null; // This will redirect to login, so no need to render anything
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="mt-3 sm:mt-0 flex space-x-3">
            <button
              type="button"
              className="admin-btn-secondary admin-btn"
              onClick={refreshData}
            >
              Refresh Data
            </button>
            <button
              type="button"
              className="admin-btn"
              onClick={() => router.push('/admin/tokens')}
            >
              Manage Tokens
            </button>
          </div>
        </div>

        {/* Dashboard metrics */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-dashboard-card dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <CreditCardIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-stat-value">{stats.totalDeployments}</div>
              <div className="dashboard-stat-label">Total Tokens</div>
            </div>
          </div>
          
          <div className="admin-dashboard-card dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <ArrowTrendingUpIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-stat-value">{stats.walletBalance}</div>
              <div className="dashboard-stat-label">Wallet Balance</div>
            </div>
          </div>
          
          <div className="admin-dashboard-card dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-stat-value">{stats.activeProjects}</div>
              <div className="dashboard-stat-label">Projects</div>
            </div>
          </div>
          
          <div className="admin-dashboard-card dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="dashboard-stat-value">{stats.totalClients}</div>
              <div className="dashboard-stat-label">Clients</div>
            </div>
          </div>
        </div>

        {/* Recent deployments */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Token Deployments</h2>
          
          {deployments.length > 0 ? (
            <div className="mt-2">
              <TokensTable 
                tokens={deployments.slice(0, 5).map(d => ({
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
                }))} 
                isLoading={loading}
              />
            </div>
          ) : (
            <EmptyState message="No tokens deployed yet" />
          )}
          
          {deployments.length > 5 && (
            <div className="mt-4 text-right">
              <Link href="/admin/tokens" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                View all tokens →
              </Link>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 