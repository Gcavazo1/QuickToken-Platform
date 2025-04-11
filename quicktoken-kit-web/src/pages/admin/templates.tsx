import React from 'react';
import Head from 'next/head';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function TemplatesPage() {
  return (
    <>
      <Head>
        <title>Templates | QuickToken Admin</title>
        <meta name="description" content="Token contract templates for quick deployment" />
      </Head>
      
      <ComingSoon 
        title="Contract Templates Coming Soon" 
        description="Choose from a library of audited, secure contract templates for various use cases. Customize and deploy with confidence."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
            <DocumentDuplicateIcon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 