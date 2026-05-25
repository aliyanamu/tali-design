import { ArrowUpRight, ArrowDownLeft, Bot, Link2, Coins, Landmark } from 'lucide-react';
import { TrustBadge, TrustLeftEdge } from '../components/TrustBadge';
import {
  todayActivities,
  pastActivities,
  linkedTrade,
  agentAction,
  reconcilePair,
} from '../data';
import type { Activity as ActivityType, LinkedTradeSide } from '../data';

function formatRp(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `Rp ${(abs / 1_000_000).toFixed(2).replace('.', ',')}jt`;
  return `Rp ${abs.toLocaleString('id-ID')}`;
}

// ── Linked Trade Hero ──────────────────────────────────────────────────────
function LinkedTradeHero() {
  const [outSide, inSide] = linkedTrade.sides;

  return (
    <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
        <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">
          {linkedTrade.title}
        </span>
        <span className="text-[11px] font-medium text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
          <Link2 size={9} strokeWidth={2.5} />
          linked
        </span>
        <span className="text-xs text-ink-400 dark:text-ink-500 ml-auto">today</span>
      </div>

      {/* Two sides with subtle shared background */}
      <div className="mx-4 mb-4 bg-ink-50/60 dark:bg-ink-700/20 rounded-2xl overflow-hidden relative">
        {/* Vertical thread connecting both sides */}
        <div className="absolute left-[27px] top-[44px] bottom-[44px] w-[2px] bg-ink-200 dark:bg-ink-600 rounded-full" />

        <TradeSide side={outSide} />
        <div className="h-px bg-ink-100 dark:bg-ink-700/40 mx-4" />
        <TradeSide side={inSide} />
      </div>
    </div>
  );
}

function TradeSide({ side }: { side: LinkedTradeSide }) {
  const isOut = side.direction === 'out';
  const Icon = isOut ? ArrowUpRight : ArrowDownLeft;
  const WalletIcon = side.isOffchain ? Landmark : Coins;

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 relative">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative z-10 ${
        isOut
          ? 'bg-ink-100 dark:bg-ink-700 text-ink-500'
          : 'bg-sign/10 text-sign'
      }`}>
        <WalletIcon size={14} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold font-tabular ${isOut ? 'text-ink-700 dark:text-ink-200' : 'text-sign'}`}>
            {side.amount}
          </span>
          <span className="text-sm text-ink-700 dark:text-ink-200 font-medium">
            {side.wallet}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[11px] text-ink-400 dark:text-ink-500">
            {side.walletSublabel}
          </span>
          <TrustBadge trust={side.trust} />
          {side.chain && (
            <a className="font-mono text-[10px] text-agent hover:text-agent/80 transition-colors cursor-pointer">
              verify on {side.chain}
            </a>
          )}
          {side.isOffchain && (
            <span className="text-[10px] text-ink-300 dark:text-ink-600 uppercase tracking-wide">
              offchain
            </span>
          )}
        </div>
      </div>
      {side.valueRp != null && (
        <div className="text-right shrink-0">
          <p className="text-[11px] text-ink-400 dark:text-ink-500 font-tabular">
            {isOut ? '−' : '+'}{formatRp(side.valueRp)}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Agent Action Row ───────────────────────────────────────────────────────
function AgentActionRow() {
  return (
    <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden relative">
      <TrustLeftEdge trust="agent" />
      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">
            {agentAction.title}
          </span>
          <TrustBadge trust="agent" />
          <span className="text-xs text-ink-400 dark:text-ink-500 ml-auto shrink-0">
            {agentAction.timeAgo}
          </span>
        </div>
        <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed">
          {agentAction.reasoning}
        </p>
        {agentAction.chain && (
          <a className="font-mono text-[10px] text-agent hover:text-agent/80 transition-colors cursor-pointer mt-1 inline-block">
            verify on {agentAction.chain}
          </a>
        )}
      </div>
    </div>
  );
}

// ── Simple Activity Row ─────────────────────────────────────────────────────
function ActivityRow({ item }: { item: ActivityType }) {
  const isPositive = item.positive;
  const Icon = isPositive ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40 dark:hover:bg-ink-700/20 transition-colors cursor-pointer">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
        isPositive ? 'bg-sign/10 text-sign' : 'bg-ink-100 dark:bg-ink-700 text-ink-500'
      }`}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
            {item.description}
          </span>
          {item.tag && (
            <span className="text-[10px] font-medium text-ink-500 dark:text-ink-400 bg-ink-100 dark:bg-ink-700 px-1.5 py-0.5 rounded-full">
              {item.tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-ink-400 dark:text-ink-500">{item.wallet}</span>
          {item.hash && (
            <span className="font-mono text-[10px] text-ink-300 dark:text-ink-600">{item.hash}</span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold font-tabular ${isPositive ? 'text-sign' : 'text-ink-700 dark:text-ink-200'}`}>
          {item.amount}
        </p>
        {item.valueRp !== 0 && (
          <p className="text-[11px] text-ink-400 dark:text-ink-500 font-tabular mt-0.5">
            {isPositive ? '+' : '−'}{formatRp(item.valueRp)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Reconcile Card ───────────────────────────────────────────────────────────
function ReconcileCard() {
  return (
    <div className="bg-amber/[0.06] dark:bg-amber/[0.08] rounded-3xl p-5 border border-amber/15">
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="w-6 h-6 rounded-lg bg-amber/15 flex items-center justify-center shrink-0 mt-0.5">
          <Link2 size={12} className="text-amber" strokeWidth={2.5} />
        </div>
        <p className="text-sm font-medium text-ink-800 dark:text-ink-100">
          {reconcilePair.prompt}
        </p>
      </div>
      <div className="ml-8 space-y-1.5">
        <p className="text-xs text-ink-600 dark:text-ink-300">{reconcilePair.left}</p>
        <p className="text-xs text-ink-600 dark:text-ink-300">{reconcilePair.right}</p>
      </div>
      <div className="ml-8 mt-4 flex items-center gap-4">
        <button className="text-xs font-semibold text-amber hover:text-amber/80 transition-colors">
          Yes, link them
        </button>
        <button className="text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors">
          Not the same
        </button>
      </div>
    </div>
  );
}

// ── Main Screen ─────────────────────────────────────────────────────────────
export function ActivityScreen() {
  const pastByDate = pastActivities.reduce<Record<string, ActivityType[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in space-y-7">
      {/* Warm intro */}
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream tracking-tight">
          Activity
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
          Everything that moved, threaded together.
        </p>
      </div>

      {/* Today — day container */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide px-1">
          Today
        </p>

        <LinkedTradeHero />
        <AgentActionRow />

        {/* Simple items inside a soft container */}
        <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden divide-y divide-ink-50 dark:divide-ink-700">
          {todayActivities.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Reconcile nudge */}
      <ReconcileCard />

      {/* Past days */}
      {Object.entries(pastByDate).map(([date, items]) => (
        <section key={date} className="space-y-2">
          <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide px-1">
            {date}
          </p>
          <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden divide-y divide-ink-50 dark:divide-ink-700">
            {items.map((item) => (
              <ActivityRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
