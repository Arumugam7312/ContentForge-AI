import React, { useState } from 'react';
import { 
  Sparkles, Check, Zap, CreditCard, Award, ArrowUpRight, 
  HelpCircle, ShieldCheck, RefreshCw
} from 'lucide-react';
import { UserProfile } from '../types';

interface BillingManagerProps {
  user: UserProfile;
  onUpgradePlan: (plan: string, credits: number) => Promise<void>;
}

export default function BillingManager({ user, onUpgradePlan }: BillingManagerProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Starter',
      price: '$19',
      credits: 20000,
      period: 'month',
      desc: 'Ideal for freelance writers and solo social media creators.',
      features: [
        '20,000 words allocation',
        'Access to 25+ standard templates',
        '1 Brand Voice blueprint file',
        'Gemini 3.5 Flash Model access',
        'Standard customer support'
      ]
    },
    {
      name: 'Professional',
      price: '$49',
      credits: 100000,
      period: 'month',
      desc: 'Perfect for content marketers, growth designers, and agencies.',
      features: [
        '100,000 words allocation',
        'Access to all 100+ templates',
        '5 Brand Voice blueprint files',
        'Gemini 3.5 Pro + Llama-3 (automatic fallback)',
        'SEO Keyword density reports',
        'Interactive Chat Assistant with file storage',
        'Priority customer support'
      ],
      popular: true
    },
    {
      name: 'Corporate Enterprise',
      price: '$149',
      credits: 500000,
      period: 'month',
      desc: 'Designed for high-growth startups and creative departments.',
      features: [
        '500,000 words allocation',
        'Access to all templates & tools',
        'Unlimited Brand Voice files',
        'Dedicated server-side API proxy routing',
        'Custom schema generation structures',
        'SLA 24/7 priority developer support'
      ]
    }
  ];

  const handleUpgrade = async (planName: string, creditsTotal: number) => {
    setLoadingPlan(planName);
    try {
      await onUpgradePlan(planName, creditsTotal);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(null);
    }
  };

  const creditPercent = Math.min(100, Math.round((user.creditsRemaining / user.creditsTotal) * 100));

  return (
    <div id="billing-view" className="max-w-7xl mx-auto space-y-10 text-left">
      
      {/* Page header */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">Billing & Quota Management</h2>
        <p className="text-xs text-slate-500 mt-1">Upgrade your subscription plan, purchase extra word credits, and audit workspace API usages.</p>
      </div>

      {/* Credit allocation summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        <div className="space-y-1 md:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Workspace Plan</span>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-extrabold text-slate-800">{user.plan}</h3>
            <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded">ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400">Your credit allocations refresh automatically on the 1st of every month.</p>
        </div>

        {/* Meter progress bar */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Monthly Word Credit Quota</span>
            <span>{user.creditsRemaining.toLocaleString()} / {user.creditsTotal.toLocaleString()} words</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${creditPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
            <span>{creditPercent}% remaining</span>
            <span>Monthly Consumption: {user.wordsGenerated.toLocaleString()} words</span>
          </div>
        </div>

      </div>

      {/* Subscription plan comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => {
          const isCurrentPlan = user.plan.toLowerCase() === p.name.toLowerCase();
          const isLoading = loadingPlan === p.name;

          return (
            <div 
              key={p.name}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between text-left relative transition-all ${
                p.popular 
                  ? 'border-violet-600 ring-2 ring-violet-500/25 shadow-lg shadow-violet-100/40' 
                  : 'border-slate-200/80 shadow-sm'
              }`}
            >
              {p.popular && (
                <span className="bg-violet-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider absolute right-6 top-0 -translate-y-1/2">
                  Most Popular Choice
                </span>
              )}

              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">{p.name}</span>
                <div className="flex items-baseline space-x-1.5 mt-2">
                  <span className="text-3xl font-extrabold text-slate-900">{p.price}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {p.period}</span>
                </div>
                
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  {p.desc}
                </p>

                {/* Quota description */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-left mt-4 text-xs font-bold text-slate-700 flex items-center space-x-2">
                  <Zap className="w-4.5 h-4.5 text-violet-600" />
                  <span>{p.credits.toLocaleString()} words / month</span>
                </div>

                <div className="mt-6 space-y-3">
                  {p.features.map((feat) => (
                    <div key={feat} className="flex items-start space-x-2.5 text-xs text-slate-600 font-medium">
                      <Check className="w-4.5 h-4.5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(p.name, p.credits)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mt-8 flex items-center justify-center space-x-2 ${
                  isCurrentPlan
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : p.popular
                      ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-100 hover:shadow-violet-200 cursor-pointer'
                      : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700 cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isCurrentPlan ? 'Your Current active Plan' : `Simulate Upgrade to ${p.name}`}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
