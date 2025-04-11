import React from 'react';
import Head from 'next/head';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../../components/admin/ComingSoon';

export default function DeployTokenPage() {
  return (
    <>
      <Head>
        <title>Deploy Token | QuickToken Admin</title>
        <meta name="description" content="Deploy a new ERC-20 token" />
      </Head>
      
      <ComingSoon 
        title="Token Deployment Tool Coming Soon" 
        description="Deploy custom ERC-20 tokens with advanced features directly from the admin dashboard. Choose parameters, network, and customize your token."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <PlusCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 