import React from 'react';
import Head from 'next/head';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function ContractsPage() {
  return (
    <>
      <Head>
        <title>My Contracts | QuickToken Admin</title>
        <meta name="description" content="Manage your deployed smart contracts" />
      </Head>
      
      <ComingSoon 
        title="Contracts Dashboard Coming Soon" 
        description="Manage all your deployed smart contracts in one place. Monitor contract performance, transactions, and integrations."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 