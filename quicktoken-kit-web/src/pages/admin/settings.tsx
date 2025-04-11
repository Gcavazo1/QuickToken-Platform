import React from 'react';
import Head from 'next/head';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings | QuickToken Admin</title>
        <meta name="description" content="Configure your QuickToken dashboard" />
      </Head>
      
      <ComingSoon 
        title="Settings & Configuration Coming Soon" 
        description="Customize your dashboard, manage API keys, configure notifications, and set default deployment options."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Cog6ToothIcon className="h-8 w-8 text-gray-600 dark:text-gray-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 