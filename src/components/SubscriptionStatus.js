// components/SubscriptionStatus.js
"use client";
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

const SubscriptionStatus = () => {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);
  
  if (!user || user.userType !== 'client') return null;

  return (
    <>
      <div 
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 cursor-pointer border-l-4 border-blue-500"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {user.subscription?.isSubscribed 
                ? `Active (${user.subscription.plan})` 
                : 'Not Subscribed'}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.subscription?.isSubscribed 
                ? `Renews on ${new Date(user.subscription.renewalDate).toLocaleDateString()}` 
                : 'Subscribe for full access'}
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Subscription Details
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {user.subscription?.isSubscribed ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Plan:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {user.subscription.plan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subscribed On:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(user.subscription.subscriptionDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Next Billing:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(user.subscription.renewalDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You do&apos;t have an active subscription. Subscribe now to access all features.
                </p>
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200">
                  View Plans
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionStatus;