// app/client/subscribe/page.js
"use client";
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

const SubscriptionPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const { user, subscribe, checkSubscription } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.email) {
      checkExistingSubscription();
    }
  }, [user]);

  const checkExistingSubscription = async () => {
    const { success, isSubscribed } = await checkSubscription();
    if (success && isSubscribed) {
      setStep(3); // Skip to success if already subscribed
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Support',
      price: 49,
      features: [
        'Weekly check-in messages',
        'Access to basic resources',
        'Community forum access',
        'Email support (48h response)'
      ],
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard Care',
      price: 65,
      features: [
        'Everything in Basic',
        'Bi-weekly therapist chat sessions',
        'Priority email support (24h response)',
        'Personalized resource recommendations'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Therapy',
      price: 79,
      features: [
        'Everything in Standard',
        'Weekly video therapy sessions',
        '24/7 crisis support line',
        'Personalized wellness plan',
        'Progress tracking dashboard'
      ],
      popular: false
    }
  ];

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { success, message } = await subscribe(selectedPlan, paymentMethod);
      
      if (!success) {
        throw new Error(message || 'Subscription failed');
      }
      
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  if (!user || user.userType !== 'client') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-black flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Subscription plans are only available for clients. If you need professional access, please contact support.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Mental Health Support Plans
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that fits your needs for emotional well-being and personal growth.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} font-medium`}
                >
                  {stepNumber}
                </div>
                <span className={`mt-2 text-sm ${step >= stepNumber ? 'text-blue-600 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {stepNumber === 1 ? 'Choose Plan' : stepNumber === 2 ? 'Payment' : 'Complete'}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-1 bg-blue-600 transition-all duration-300 ${step >= 3 ? 'w-full' : step >= 2 ? 'w-2/3' : 'w-1/3'}`}
              ></div>
            </div>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl p-6 shadow-lg border-2 transition-all duration-200 ${plan.popular ? 'border-blue-500 bg-white dark:bg-gray-800 transform md:-translate-y-2' : 'border-transparent bg-white dark:bg-gray-800'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">R{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white'}`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Payment Form */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {plans.find(p => p.id === selectedPlan)?.name}
              </span>
            </div>
            
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  PayPal
                </button>
              </div>
            </div>
            
            {paymentMethod === 'card' ? (
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      name="number"
                      value={formatCardNumber(cardDetails.number)}
                      onChange={(e) => {
                        e.target.value = formatCardNumber(e.target.value);
                        handleCardChange(e);
                      }}
                      maxLength="19"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="card-expiry"
                        name="expiry"
                        value={formatExpiry(cardDetails.expiry)}
                        onChange={(e) => {
                          e.target.value = formatExpiry(e.target.value);
                          handleCardChange(e);
                        }}
                        maxLength="5"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="card-cvc"
                        name="cvc"
                        value={cardDetails.cvc}
                        onChange={handleCardChange}
                        maxLength="4"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="card-name"
                      name="name"
                      value={cardDetails.name}
                      onChange={handleCardChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      `Subscribe for R${plans.find(p => p.id === selectedPlan)?.price}/mo`
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                  <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You will be redirected to PayPal to complete your subscription for the {plans.find(p => p.id === selectedPlan)?.name} plan.
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 flex items-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redirecting...
                      </>
                    ) : (
                      'Continue to PayPal'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Message */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Subscription Successful!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for subscribing to our {plans.find(p => p.id === selectedPlan)?.name} plan. Your mental health journey starts now.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Order Details</h3>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Plan</span>
                <span>{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Amount</span>
                <span>R{plans.find(p => p.id === selectedPlan)?.price}/month</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>Next Billing Date</span>
                <span>{new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/client/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;