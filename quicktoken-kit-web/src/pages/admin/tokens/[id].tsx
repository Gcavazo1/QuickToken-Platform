import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head';
import Link from 'next/link';
import { isAuthorizedAdmin } from '../../../lib/auth';
import AdminLayout from '../../../components/admin/AdminLayout';
import { shortenAddress, formatNumber, formatDate } from '../../../utils/formatters';
import { 
  ArrowLeftIcon, 
  ArrowTopRightOnSquareIcon, 
  DocumentDuplicateIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  GlobeAltIcon,
  HashtagIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { getTokenById, getNetworkBadgeClass, getExplorerUrl, TokenDetail, updateTokenDeployment } from '../../../lib/tokenManagement';

export default function TokenDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { account, active } = useWeb3React();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<TokenDetail | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Copy contract address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  };

  // Fetch the token data
  const fetchTokenData = async (tokenId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const tokenData = await getTokenById(tokenId);
      if (tokenData) {
        setToken(tokenData);
      } else {
        setError('Token not found');
      }
    } catch (err) {
      console.error('Error fetching token details:', err);
      setError('Failed to load token details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token data
  const refreshTokenData = async () => {
    if (!id || typeof id !== 'string') return;
    
    try {
      setIsRefreshing(true);
      await fetchTokenData(id);
    } finally {
      setIsRefreshing(false);
    }
  };

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

  useEffect(() => {
    // Fetch token details when id is available and user is authorized
    if (id && isAuthorized && typeof id === 'string') {
      fetchTokenData(id);
    }
  }, [id, isAuthorized]);

  if (isLoading) {
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

  if (error || !token) {
    return (
      <AdminLayout>
        <div className="h-screen flex flex-col items-center justify-center">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            {error || 'Token not found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            There was a problem loading the token details
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/tokens')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Back to Tokens
            </button>
            <button
              onClick={() => id && typeof id === 'string' && fetchTokenData(id)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Format lock duration in days and hours
  const formatLockDuration = (seconds: number): string => {
    if (seconds === 0) return 'No lock period';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    
    if (days > 0 && hours > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };

  return (
    <>
      <Head>
        <title>{token.name} ({token.symbol}) | QuickToken Admin</title>
        <meta name="description" content={`Token details for ${token.name}`} />
      </Head>

      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button and title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4 sm:mb-0">
              <button 
                onClick={() => router.push('/admin/tokens')}
                className="mr-4 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                  {token.name}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({token.symbol})</span>
                </h1>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNetworkBadgeClass(token.network)}`}>
                    {token.network}
                  </span>
                  {token.verified && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ShieldCheckIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Transfer Ownership
              </button>
              <button
                type="button"
                onClick={refreshTokenData}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Two column layout */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content - token details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                {/* Contract info section */}
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Contract Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Smart contract details and configuration.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contract Address</dt>
                      <dd className="mt-1 flex items-center">
                        <span className="text-sm text-gray-900 dark:text-white font-mono">{token.contractAddress}</span>
                        <button
                          onClick={() => copyToClipboard(token.contractAddress)}
                          className="ml-2 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none" 
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                        <a 
                          href={getExplorerUrl(token.network, token.contractAddress)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-2 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
                        >
                          <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                        </a>
                        {copiedAddress && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                            Address copied!
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Token Name</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Token Symbol</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.symbol}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Supply</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(token.supply, 0)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mint Fee</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.mintFee} ETH</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Lock Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatLockDuration(token.lockDuration)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deployment Date</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(token.deploymentDate, 'long')}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deployed By</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                        {shortenAddress(token.deployedBy)}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Deployment Transaction</dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        {token.deploymentTx ? (
                          <a
                            href={getExplorerUrl(token.network, token.deploymentTx, 'tx')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            {token.deploymentTx}
                            <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Token Statistics</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    On-chain metrics and usage data.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 shadow rounded-md overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Total Holders</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{token.holders || 0}</dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 shadow rounded-md overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Transactions</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{token.transactions || 0}</dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-700 shadow rounded-md overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Last Activity</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{formatDate(token.lastActivityDate || token.deploymentDate, 'relative')}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Sidebar - client info and actions */}
            <div className="space-y-6">
              {/* Client info */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    {token.projectName ? 'Project Information' : 'Client Information'}
                  </h3>
                </div>
                {token.clientName || token.projectName ? (
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="space-y-4">
                      {token.projectName && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Project</dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.projectName}</dd>
                        </div>
                      )}
                      {token.clientName && (
                        <>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Client</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.clientName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">{token.clientCompany || 'N/A'}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {token.clientEmail ? (
                                <a href={`mailto:${token.clientEmail}`} className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                  {token.clientEmail}
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                    {token.clientId && (
                      <div className="mt-6">
                        <Link
                          href={`/admin/clients/${token.clientId}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <UserIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                          View Client Profile
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No client or project associated with this token.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <UserIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                        Associate with Client
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Quick Actions</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <CurrencyDollarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                      Mint New Tokens
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ClockIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                      Update Time Lock
                    </button>
                    <a 
                      href={getExplorerUrl(token.network, token.contractAddress)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <GlobeAltIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                      View on Explorer
                    </a>
                    <button
                      type="button"
                      className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <HashtagIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                      Generate Widget Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
} 