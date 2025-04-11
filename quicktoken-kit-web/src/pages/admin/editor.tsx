import React from 'react';
import Head from 'next/head';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import ComingSoon from '../../components/admin/ComingSoon';

export default function EditorPage() {
  return (
    <>
      <Head>
        <title>Code Editor | QuickToken Admin</title>
        <meta name="description" content="Solidity smart contract editor" />
      </Head>
      
      <ComingSoon 
        title="Code Editor Coming Soon" 
        description="Edit and deploy smart contracts with our integrated Solidity editor. Includes syntax highlighting, error checking, and security analysis."
        iconComponent={
          <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
            <CodeBracketIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
          </div>
        }
      />
    </>
  );
} 