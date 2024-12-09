import { useAuth } from 'wasp/client/auth';
import { generateCheckoutSession, getCustomerPortalUrl, useQuery } from 'wasp/client/operations';
import { PaymentPlanId, paymentPlans, prettyPaymentPlanName } from './plans';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../client/cn';

const bestDealPaymentPlanId: PaymentPlanId = PaymentPlanId.Pro;

interface PaymentPlanCard {
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard> = {
  [PaymentPlanId.Hobby]: {
    name: prettyPaymentPlanName(PaymentPlanId.Hobby),
    price: '$9.99',
    description: 'Totally Rad Starter Pack!',
    features: ['Gnarly Monthly Usage Limits', 'Basic Support (No Bogus Stuff)'],
  },
  [PaymentPlanId.Pro]: {
    name: prettyPaymentPlanName(PaymentPlanId.Pro),
    price: '$19.99',
    description: 'Most Excellent Package, Dude!',
    features: ['Unlimited Usage (To The Max!)', 'VIP Support (We Got Your Back!)'],
  },
  [PaymentPlanId.Credits10]: {
    name: prettyPaymentPlanName(PaymentPlanId.Credits10),
    price: '$9.99',
    description: 'Radical One-Time Credit Bundle!',
    features: ['Fresh Credits for API Calls', 'No Expiration (Totally Tubular!)'],
  },
};

const PricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);

  const { data: user } = useAuth();
  const isUserSubscribed = !!user && !!user.subscriptionStatus && user.subscriptionStatus !== 'deleted';

  const {
    data: customerPortalUrl,
    isLoading: isCustomerPortalUrlLoading,
    error: customerPortalUrlError,
  } = useQuery(getCustomerPortalUrl, { enabled: isUserSubscribed });

  const navigate = useNavigate();

  async function handleBuyNowClick(paymentPlanId: PaymentPlanId) {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsPaymentLoading(true);

      const checkoutResults = await generateCheckoutSession(paymentPlanId);

      if (checkoutResults?.sessionUrl) {
        window.open(checkoutResults.sessionUrl, '_self');
      } else {
        throw new Error('Bummer! Checkout session URL failed!');
      }
    } catch (error) {
      console.error(error);
      setIsPaymentLoading(false);
    }
  }

  const handleCustomerPortalClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (customerPortalUrlError) {
      console.error('Bogus error getting portal URL!');
    }

    if (!customerPortalUrl) {
      throw new Error(`Whoa! No portal found for user ${user.id}`)
    }

    window.open(customerPortalUrl, '_blank');
  };

  return (
    <div className='py-10 lg:mt-10 bg-gradient-to-r from-hot-pink via-neon-yellow to-electric-blue'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div id='pricing' className='mx-auto max-w-4xl text-center'>
          <h2 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white' style={{ textShadow: '2px 2px 0 #ff00ff, 4px 4px 0 #00ffff' }}>
            Pick Your <span className='text-neon-green'>RADICAL</span> Plan!
          </h2>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-900 font-bold dark:text-white'>
          Choose Your Payment Style! Totally Tubular Options Below! Test it out with this
          <br />
          <span className='px-2 py-1 bg-neon-pink rounded-md text-white animate-pulse'>4242 4242 4242 4242 4242</span>
        </p>
        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 lg:gap-x-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {Object.values(PaymentPlanId).map((planId) => (
            <div
              key={planId}
              className={cn(
                'relative flex flex-col grow justify-between rounded-3xl bg-white/90 overflow-hidden p-8 xl:p-10 border-4',
                {
                  'border-neon-pink animate-bounce-slow': planId === bestDealPaymentPlanId,
                  'border-electric-blue lg:mt-8': planId !== bestDealPaymentPlanId,
                }
              )}
            >
              {planId === bestDealPaymentPlanId && (
                <div className='absolute top-0 right-0 -z-10 w-full h-full transform-gpu'>
                  <div
                    className='absolute w-full h-full bg-gradient-to-br from-hot-pink to-neon-yellow opacity-70'
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    }}
                  />
                </div>
              )}
              <div className='mb-8'>
                <div className='flex items-center justify-between gap-x-4'>
                  <h3 id={planId} className='text-gray-900 text-lg font-bold leading-8' style={{ textShadow: '1px 1px 0 #ff00ff' }}>
                    {paymentPlanCards[planId].name}
                  </h3>
                </div>
                <p className='mt-4 text-sm leading-6 text-gray-800 font-bold'>
                  {paymentPlanCards[planId].description}
                </p>
                <p className='mt-6 flex items-baseline gap-x-1'>
                  <span className='text-4xl font-bold tracking-tight text-neon-purple'>
                    {paymentPlanCards[planId].price}
                  </span>
                  <span className='text-sm font-bold leading-6 text-gray-800'>
                    {paymentPlans[planId].effect.kind === 'subscription' && '/month'}
                  </span>
                </p>
                <ul role='list' className='mt-8 space-y-3 text-sm leading-6 text-gray-800 font-bold'>
                  {paymentPlanCards[planId].features.map((feature) => (
                    <li key={feature} className='flex gap-x-3'>
                      <AiFillCheckCircle className='h-6 w-5 flex-none text-neon-green animate-spin-slow' aria-hidden='true' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {isUserSubscribed ? (
                <button
                  onClick={handleCustomerPortalClick}
                  disabled={isCustomerPortalUrlLoading}
                  aria-describedby='manage-subscription'
                  className={cn(
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-bold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-green transform hover:scale-105 transition-transform',
                    {
                      'bg-neon-purple text-white hover:bg-hot-pink': planId === bestDealPaymentPlanId,
                      'bg-electric-blue text-white hover:bg-neon-blue': planId !== bestDealPaymentPlanId,
                    }
                  )}
                >
                  Manage Your Rad Subscription!
                </button>
              ) : (
                <button
                  onClick={() => handleBuyNowClick(planId)}
                  aria-describedby={planId}
                  className={cn(
                    {
                      'bg-neon-purple text-white hover:bg-hot-pink': planId === bestDealPaymentPlanId,
                      'bg-electric-blue text-white hover:bg-neon-blue': planId !== bestDealPaymentPlanId,
                    },
                    {
                      'opacity-50 cursor-wait': isPaymentLoading,
                    },
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-bold leading-6 transform hover:scale-105 transition-transform'
                  )}
                  disabled={isPaymentLoading}
                >
                  {!!user ? 'Get This Totally Rad Plan!' : 'Log in to Get Radical!'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
