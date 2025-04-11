import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon, ArrowsUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { shortenAddress, formatNumber, formatDate } from '../../utils/formatters';
import { Token, getExplorerUrl, getNetworkBadgeClass } from '../../lib/tokenManagement';

// Props interface for the TokensTable component
interface TokensTableProps {
  tokens: Token[];
  isLoading?: boolean;
}

export default function TokensTable({ tokens, isLoading = false }: TokensTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Token>('deploymentDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle sort toggle
  const toggleSort = (field: keyof Token) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted tokens
  const filteredTokens = useMemo(() => {
    if (!tokens) return [];
    
    return tokens
      .filter(token => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          token.name.toLowerCase().includes(query) ||
          token.symbol.toLowerCase().includes(query) ||
          token.contractAddress.toLowerCase().includes(query) ||
          token.network.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
        if (bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
        
        // Handle different types of fields
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle date objects or date strings
        if (
          (typeof aValue === 'string' && typeof bValue === 'string') &&
          !isNaN(Date.parse(aValue)) && !isNaN(Date.parse(bValue))
        ) {
          return sortDirection === 'asc'
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }
        
        // Handle numbers
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
  }, [tokens, searchQuery, sortField, sortDirection]);

  // Pagination
  const paginatedTokens = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTokens.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTokens, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);

  // Skeleton loader
  const renderSkeleton = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={`skeleton-${index}`} className="animate-pulse">
          <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-right">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Search */}
        <div className="relative flex items-center max-w-xs">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Filter options can be added here */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredTokens.length} tokens
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow admin-dashboard-card">
        <table className="min-w-full token-table">
          <thead>
            <tr>
              <th 
                scope="col" 
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6 cursor-pointer"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center group">
                  Token Name
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer"
                onClick={() => toggleSort('symbol')}
              >
                <div className="flex items-center group">
                  Symbol
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer"
                onClick={() => toggleSort('network')}
              >
                <div className="flex items-center group">
                  Network
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer"
                onClick={() => toggleSort('contractAddress')}
              >
                <div className="flex items-center group">
                  Contract Address
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer"
              >
                <div className="flex items-center group">
                  Project
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-3 py-3.5 text-left text-sm font-semibold cursor-pointer"
                onClick={() => toggleSort('deploymentDate')}
              >
                <div className="flex items-center group">
                  Deployed
                  <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                </div>
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              renderSkeleton()
            ) : paginatedTokens.length > 0 ? (
              paginatedTokens.map((token) => (
                <tr key={token.id} className="token-table-row">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                    {token.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {token.symbol}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="network-badge">
                      {token.network}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-mono">
                    <a 
                      href={getExplorerUrl(token.network, token.contractAddress)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="address-display"
                    >
                      {shortenAddress(token.contractAddress)}
                      <ArrowTopRightOnSquareIcon className="address-link-icon" />
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {token.projectId ? 'Project' : 'N/A'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {formatDate(token.deploymentDate, 'relative')}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                      href={`/admin/tokens/${token.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  No tokens found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{Math.min(filteredTokens.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
                <span className="font-medium">
                  {Math.min(filteredTokens.length, currentPage * itemsPerPage)}
                </span>{' '}
                of <span className="font-medium">{filteredTokens.length}</span> tokens
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + idx;
                  } else {
                    pageNumber = currentPage - 2 + idx;
                  }
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === pageNumber 
                          ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-200' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`
                      }
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 