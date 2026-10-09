'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, DollarSign, IndianRupee,  
Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { paymentApi, CreateCheckoutInput } from '../../utils/account/payment'; 

export interface PricingTier {
  id: string;
  name: string;
  type: string; 
  popular?: boolean;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  ctaText: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Student Basic Tier',
    type: 'Basic',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Essential career exploration for students starting their discovery journey.',
    features: [
      'Access to 1 Career Explorer Report',
      'Access to 1 Exams & Assessments',
      'Access to 1 Job Preparation Tools',
      'Basic Access to Career Map Finder AI',
      'Standard Mobile & Desktop View',
    ],
    ctaText: 'Start Student Basic Free',
  },
  {
    id: 'pro-student',
    name: 'Student Plus Tier',
    type: 'Plus',
    popular: true,
    priceMonthly: 5,
    priceAnnual: 45,
    description: 'Complete personalized guidance package for serious applicants and exam takers.',
    features: [
      'Access to 10 Career Explorer Reports',
      'Access to 10 Exams & Assessments',
      'Access to 10 Job Preparation Tools',
      'Basic Access to Career Map Finder AI',
      'Downloadable PDF Career Map Reports',
    ],
    ctaText: 'Unlock Student Plus Pass',
  },
  {
    id: 'parent-mentor',
    name: 'Student Pro Tier',
    type: 'Pro',
    priceMonthly: 10,
    priceAnnual: 90,
    description: 'Unlimited access to advanced personalized financial planning, and college safety metrics.',
    features: [
      'Unlimited access to Career Explorer',
      'Unlimited access to All Assessments',
      'Unlimited access to Job Preparation',
      'Unlimited access to Career Finder AI',
      'Downloadable PDF Career Map Reports',
    ],
    ctaText: 'Get Student Pro Suite',
  },
];

interface PricingSectionProps {
  userEmail?: string;
  userId?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  userEmail = '',
  userId = '',
}) => {
  const { theme } = useTheme();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleCheckout = async (tier: PricingTier) => {
    // Handle Free Tier locally
    if (tier.priceMonthly === 0 && tier.priceAnnual === 0) {
      window.location.href = '/dashboard';
      return;
    }

    setLoadingTierId(tier.id);
    setErrorMessage(null);

    const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;

    const payload: CreateCheckoutInput = {
      email: userEmail,
      userId: userId,
      amount: price,
      type: tier.type,
      billingCycle: billingCycle === 'annual' ? 'yearly' : 'monthly',
    };

    try {
      let response;

      if (tier.type === 'Basic') {
        response =
          billingCycle === 'annual'
            ? await paymentApi.createBasicYearlyCheckout(payload)
            : await paymentApi.createBasicMonthlyCheckout(payload);
      } else if (tier.type === 'Plus') {
        response =
          billingCycle === 'annual'
            ? await paymentApi.createPlusYearlyCheckout(payload)
            : await paymentApi.createPlusMonthlyCheckout(payload);
      } else if (tier.type === 'Pro') {
        response =
          billingCycle === 'annual'
            ? await paymentApi.createProYearlyCheckout(payload)
            : await paymentApi.createProMonthlyCheckout(payload);
      } else {
        throw new Error('Invalid tier selection.');
      }

      if (response && response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      } else {
        throw new Error('Checkout session URL was not returned.');
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'An error occurred initializing checkout.';
      setErrorMessage(msg);
      console.error('Checkout error:', err);
    } finally {
      setLoadingTierId(null);
    }
  };

  return (
    <section
      id="pricing"
      className={`py-6 relative transition-colors duration-200 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span
            className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isDark
                ? 'text-indigo-400 bg-indigo-950/80 border-indigo-700'
                : 'text-indigo-700 bg-indigo-100 border-indigo-300'
            }`}
          >
            Simple And Transparent Pricing
          </span>
          <h2
            className={`text-xl sm:text-3xl font-extrabold tracking-tight mt-3 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Invest in Your Future with Full Clarity
          </h2>
          <p
            className={`text-sm sm:text-base mt-3 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Start completely free or unlock advanced AI career roadmaps and financial planning tools.
          </p>

          {/* Billing Cycle Toggle */}
          <div
            className={`mt-6 inline-flex items-center gap-3 p-1 rounded-xl border ${
              isDark
                ? 'bg-slate-900 border-slate-700'
                : 'bg-slate-200/80 border-slate-300'
            }`}
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annually</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  isDark
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-xl mx-auto mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {PRICING_TIERS.map((tier) => {
            const displayPrice =
              billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
            const isLoading = loadingTierId === tier.id;

            return (
              <motion.div
                key={tier.id}
                whileHover={{ y: -4 }}
                className={`border rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-200 ${
                  tier.popular
                    ? isDark
                      ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-white border-indigo-500 shadow-xl shadow-indigo-500/15'
                    : isDark
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-xs mt-2 min-h-[36px] ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {tier.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span
                      className={`text-3xl sm:text-4xl font-black flex items-center ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <DollarSign
                        className={`w-6 h-6 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      />
                      {displayPrice}
                    </span>
                    <span
                      className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {tier.priceMonthly === 0
                        ? ''
                        : billingCycle === 'annual'
                        ? '/year'
                        : '/month'}
                    </span>
                  </div>

                  <ul
                    className={`mt-8 space-y-3 pt-6 border-t ${
                      isDark ? 'border-slate-700' : 'border-slate-300'
                    }`}
                  >
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className={`text-xs flex items-start gap-2.5 ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        <Check
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-600'
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => handleCheckout(tier)}
                    disabled={isLoading || loadingTierId !== null}
                    className={`w-full py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                        : isDark
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{tier.ctaText}</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


