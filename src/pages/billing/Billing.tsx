import { useState } from 'react';
import { CheckCircle2, XCircle, CreditCard, Zap, Star } from 'lucide-react';
import { billingPlans } from '../../constants';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export default function Billing() {
  const { practice } = useApp();
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing &amp; Plans</h1>
          <p className="page-subtitle">
            Current plan: <strong>{practice?.plan?.charAt(0).toUpperCase()}{practice?.plan?.slice(1)}</strong> · All prices in GBP (£) ex. VAT
          </p>
        </div>
      </div>

      {/* Current plan usage */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink text-sm">This Month's Usage</h3>
          <span className="badge badge-brand">Growth Plan</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'AI Conversations', used: 312, limit: 800 },
            { label: 'Knowledge Base Chunks', used: 78, limit: 500 },
            { label: 'Team Members', used: 4, limit: 10 },
          ].map(item => {
            const pct = Math.round((item.used / item.limit) * 100);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-ink">{item.label}</span>
                  <span className="text-xs text-muted">{item.used.toLocaleString()} / {item.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                  <div
                    className={cn('h-full rounded-full transition-all', pct > 80 ? 'bg-rose-400' : pct > 60 ? 'bg-amber-400' : 'bg-brand-500')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn('text-sm font-semibold', !annual ? 'text-ink' : 'text-muted')}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={cn('w-12 h-6 rounded-full transition-all relative', annual ? 'bg-brand-600' : 'bg-border')}
        >
          <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm', annual ? 'left-[26px]' : 'left-0.5')} />
        </button>
        <span className={cn('text-sm font-semibold', annual ? 'text-ink' : 'text-muted')}>
          Annual <span className="text-emerald-600 text-xs font-bold ml-1">Save ~15%</span>
        </span>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {billingPlans.map(plan => {
          const isCurrent = plan.id === practice?.plan;
          const price = annual ? plan.annualPrice : plan.price;

          return (
            <div
              key={plan.id}
              className={cn(
                'card p-6 flex flex-col gap-5 relative',
                plan.highlighted && 'border-brand-400 shadow-lg shadow-brand-100',
                isCurrent && 'ring-2 ring-brand-600'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge badge-brand px-3 py-1 shadow-sm">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="badge badge-green px-3 py-1 shadow-sm">Current Plan</span>
                </div>
              )}

              <div>
                <h3 className="font-display font-bold text-ink text-lg">{plan.name}</h3>
                <p className="text-xs text-muted mt-1">{plan.description}</p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-ink">£{price}</span>
                  <span className="text-sm text-muted">/mo</span>
                </div>
                {annual && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Billed annually · save £{(plan.price - plan.annualPrice) * 12}/yr</p>
                )}
              </div>

              <ul className="space-y-2.5 flex-1">
                {plan.features.map(f => (
                  <li key={f.name} className="flex items-start gap-2.5 text-xs">
                    {f.included
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-3.5 h-3.5 text-border shrink-0 mt-0.5" />
                    }
                    <span className={cn(f.included ? 'text-ink' : 'text-muted/50')}>{f.name}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-all',
                  isCurrent
                    ? 'bg-surface text-muted cursor-default border border-border'
                    : plan.highlighted
                      ? 'btn-primary'
                      : 'btn-secondary'
                )}
                disabled={isCurrent}
              >
                {isCurrent ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment method */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
          <CreditCard className="w-5 h-5 text-muted" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-ink">Payment Method</p>
          <p className="text-xs text-muted mt-0.5">Visa ending in 4242 · Expires 09/27</p>
        </div>
        <button className="btn-secondary text-xs py-2">Update</button>
      </div>

      <p className="text-xs text-center text-muted">
        Prices exclude VAT at 20%. Billed via Stripe. Cancel anytime — no long-term contracts.
        Questions? Email <a href="mailto:support@visionflow.ai" className="text-brand-600 hover:underline">support@visionflow.ai</a>
      </p>
    </div>
  );
}
