import React from 'react';
import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import AdminLayout from './AdminLayout';

interface ComingSoonProps {
  title: string;
  description?: string;
  iconComponent?: React.ReactNode;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description = "This feature is under development and will be available soon.",
  iconComponent
}) => {
  const router = useRouter();
  
  return (
    <AdminLayout>
      <div className="h-full flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            {iconComponent || (
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ClockIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            {title}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {description}
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComingSoon; 