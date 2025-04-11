import React from 'react';
import Head from 'next/head';
import { WalletIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function WalletPage() {
  return (
    <>
      <Head>
        <title>Wallet | QuickToken Admin</title>
        <meta name="description" content="Wallet and transaction management" />
      </Head>
      
      <ComingSoon 
        title="Wallet Manager Coming Soon" 
        description="Monitor your wallet balances, transaction history, and gas usage across multiple networks. Includes token transfers and approvals tracking."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <WalletIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 