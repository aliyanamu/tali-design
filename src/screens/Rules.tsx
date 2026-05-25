import { useState } from 'react';
import { Bot, Sparkles, ChevronRight } from 'lucide-react';
import { TrustBadge, TrustLeftEdge } from '../components/TrustBadge';

const COMPOSE_PLACEHOLDER = 'Whenever USDT comes into my wallet, save 10% as USDY.';

interface ChipPart {
  label: string;
  highlight?: boolean;
}

const understoodParts: ChipPart[] = [
  { label: 'When USDT arrives', highlight: true },
  { label: 'save 10% as USDY', highlight: true },
  { label: 'on Mantle' },
  { label: 'from your Tali Wallet' },
];

interface ActiveRule {
  id: string;
  title: string;
  statusDot: 'active';
  lastActed: string;
  latestAction: string;
  reasoning: string;
  attestation: string;
}

const activeRule: ActiveRule = {
  id: 'ar1',
  title: 'Idle USDT → USDY savings',
  statusDot: 'active',
  lastActed: 'today',
  latestAction: 'Saved 50 USDT for you',
  reasoning: '500 USDT arrived, kept 10% aside',
  attestation: 'attested on-chain',
};

export function RulesScreen() {
  const [composeText, setComposeText] = useState(COMPOSE_PLACEHOLDER);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Warm heading */}
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream tracking-tight">
          Rules
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          Set a rule. Your agent handles the rest.
        </p>
      </div>

      {/* Compose box */}
      <section className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-ink-50 dark:bg-ink-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={15} className="text-ink-400 dark:text-ink-500" strokeWidth={2} />
          </div>
          <textarea
            value={composeText}
            onChange={(e) => setComposeText(e.target.value)}
            rows={2}
            className="flex-1 bg-transparent text-sm text-ink-800 dark:text-ink-100 placeholder:text-ink-300 dark:placeholder:text-ink-600 resize-none focus:outline-none leading-relaxed"
            placeholder="Describe what your agent should do..."
          />
        </div>
      </section>

      {/* How Tali understood it */}
      <section className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide">
            How Tali understood it
          </span>
          <TrustBadge trust="agent" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {understoodParts.map((part, i) => (
            <span
              key={i}
              className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg ${
                part.highlight
                  ? 'bg-agent/10 text-agent'
                  : 'bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300'
              }`}
            >
              {i > 0 && <ChevronRight size={10} className="mr-1 opacity-40" />}
              {part.label}
            </span>
          ))}
        </div>
        <button className="mt-4 inline-flex items-center gap-2 bg-sign text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-sign/90 transition-colors">
          Activate rule
        </button>
      </section>

      {/* Active rule — feels alive */}
      <section>
        <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide mb-3 px-1">
          Active
        </p>
        <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden relative">
          <TrustLeftEdge trust="agent" />
          <div className="pl-5 pr-4 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">
                {activeRule.title}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-sign bg-sign/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-sign animate-pulse-slow" />
                Active
              </span>
            </div>

            <div className="flex items-center gap-3 mt-2.5">
              <span className="text-xs text-ink-400 dark:text-ink-500">
                last acted {activeRule.lastActed}
              </span>
            </div>

            {/* Most recent action inline */}
            <div className="mt-3 bg-ink-50/60 dark:bg-ink-700/20 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <TrustBadge trust="agent" />
                <span className="text-sm font-medium text-ink-700 dark:text-ink-200">
                  {activeRule.latestAction}
                </span>
              </div>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 leading-relaxed">
                {activeRule.reasoning}
                <span className="text-[10px] text-ink-300 dark:text-ink-600 ml-1.5">
                  {activeRule.attestation}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
