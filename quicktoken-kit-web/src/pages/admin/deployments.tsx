import React from 'react';
import Head from 'next/head';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function DeploymentsPage() {
  return (
    <>
      <Head>
        <title>Deployments | QuickToken Admin</title>
        <meta name="description" content="Track your QuickToken deployments" />
      </Head>
      
      <ComingSoon 
        title="Deployments Coming Soon" 
        description="Track all your smart contract deployments across multiple networks. This feature is under active development."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <RocketLaunchIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 