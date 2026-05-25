import { TrendingUp, Wallet, Landmark, Coins, Banknote, Building2 } from 'lucide-react';
import { TrustBadge } from '../components/TrustBadge';
import { AreaChart } from '../components/AreaChart';
import {
  wallets,
  offchainAccounts,
  totalNetWorth,
  totalOnchain,
  totalOffchain,
  monthlyChangePct,
  monthlyChangeRp,
  chartData30d,
} from '../data';

function formatRpFull(n: number): string {
  return `Rp ${n.toLocaleString('id-ID')}`;
}

function formatRpShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(2).replace('.', ',')} M`;
  if (n >= 1_000_000) return `Rp ${Math.round(n / 1_000_000)}jt`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

const chainIcons: Record<string, typeof Wallet> = {
  Ethereum: Coins,
  CEX: Building2,
  Solana: Wallet,
};

const offchainIcons: Record<string, typeof Landmark> = {
  bank: Building2,
  ewallet: Wallet,
  cash: Banknote,
};

export function Overview() {
  const onchainWallets = wallets;
  const onchainTotal = onchainWallets.reduce((s, w) => s + w.assets.reduce((a, b) => a + b.valueRp, 0), 0);

  return (
    <div className="animate-fade-in space-y-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="space-y-1.5">
        <p className="text-sm font-medium text-ink-500 dark:text-ink-400">
          Your money, all in one place
        </p>
        <h1 className="font-tabular text-[2.75rem] md:text-hero font-semibold tracking-tight text-ink-900 dark:text-cream leading-none">
          {formatRpFull(totalNetWorth)}
        </h1>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 text-sign text-sm font-semibold">
            <TrendingUp size={14} strokeWidth={2.5} />
            up Rp {(monthlyChangeRp / 1_000_000).toFixed(1).replace('.', ',')}jt this month
          </span>
          <span className="text-sm text-ink-400 dark:text-ink-500 font-tabular">
            (+{monthlyChangePct}%)
          </span>
        </div>
      </section>

      {/* ── 30-day chart ────────────────────────────────────────────────── */}
      <section>
        <AreaChart data={chartData30d} height={140} />
      </section>

      {/* ── Where it lives ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-ink-700 dark:text-cream mb-3">Where it lives</h2>
        <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden">
          {/* Onchain group */}
          <div className="px-5 pt-5 pb-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sign/10 flex items-center justify-center">
                  <Coins size={12} className="text-sign" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide">
                  Onchain
                </span>
              </div>
              <span className="text-xs font-semibold font-tabular text-ink-800 dark:text-cream">
                {formatRpShort(totalOnchain)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-ink-50 dark:divide-ink-700/60">
            {onchainWallets.map((wallet) => {
              const total = wallet.assets.reduce((s, a) => s + a.valueRp, 0);
              const ChainIcon = chainIcons[wallet.chain] || Wallet;
              return (
                <div
                  key={wallet.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40 dark:hover:bg-ink-700/20 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-ink-50 dark:bg-ink-700 flex items-center justify-center shrink-0">
                    <ChainIcon size={15} className="text-ink-500 dark:text-ink-300" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                        {wallet.name}
                      </span>
                      <TrustBadge trust={wallet.trust} />
                    </div>
                    {wallet.address ? (
                      <p className="font-mono text-[10px] text-ink-300 dark:text-ink-600 mt-0.5">
                        {wallet.address}
                      </p>
                    ) : (
                      <p className="text-[10px] text-ink-300 dark:text-ink-600 mt-0.5">
                        read-only API
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold font-tabular text-ink-800 dark:text-cream">
                      {formatRpShort(total)}
                    </p>
                    <p className="text-[10px] text-ink-400 dark:text-ink-500 font-tabular mt-0.5">
                      {wallet.assets.map((a) =>
                        `${a.amount.toLocaleString('id-ID', { maximumFractionDigits: 4 })} ${a.symbol}`
                      ).join(' + ')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Offchain group */}
          <div className="px-5 pt-5 pb-1 mt-1 border-t-2 border-ink-100/60 dark:border-ink-700/40">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber/10 flex items-center justify-center">
                  <Landmark size={12} className="text-amber" strokeWidth={2.5} />
                </div>
                <span className="text-xs font-semibold text-ink-600 dark:text-ink-300 uppercase tracking-wide">
                  Offchain
                </span>
              </div>
              <span className="text-xs font-semibold font-tabular text-ink-800 dark:text-cream">
                {formatRpShort(totalOffchain)}
              </span>
            </div>
          </div>

          <div className="divide-y divide-ink-50 dark:divide-ink-700/60">
            {offchainAccounts.map((acc) => {
              const AccIcon = offchainIcons[acc.type] || Landmark;
              return (
                <div
                  key={acc.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40 dark:hover:bg-ink-700/20 transition-colors cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-ink-50 dark:bg-ink-700 flex items-center justify-center shrink-0">
                    <AccIcon size={15} className="text-ink-500 dark:text-ink-300" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-ink-800 dark:text-ink-100">
                      {acc.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold font-tabular text-ink-800 dark:text-cream">
                      {formatRpShort(acc.valueRp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-3" />
        </div>
      </section>

      {/* ── Amber nudge ─────────────────────────────────────────────────── */}
      <section className="bg-amber/[0.06] dark:bg-amber/[0.08] rounded-3xl p-5 border border-amber/15">
        <div className="flex items-start gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-lg bg-amber/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-amber text-xs font-bold">!</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">
              A couple of balances have been sitting still
            </p>
          </div>
        </div>

        <div className="space-y-3 ml-8">
          {/* Indodax */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm text-ink-700 dark:text-ink-200">
                <span className="font-medium">847 USDT</span> on Indodax
              </p>
              <p className="text-[11px] text-ink-400 dark:text-ink-500 mt-0.5">67 days</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-amber hover:text-amber/80 transition-colors">
                Bring forward
              </button>
              <button className="text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors">
                Ignore
              </button>
            </div>
          </div>

          <div className="h-px bg-amber/10" />

          {/* GoPay */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm text-ink-700 dark:text-ink-200">
                <span className="font-medium">Rp 312.000</span> in GoPay
              </p>
              <p className="text-[11px] text-ink-400 dark:text-ink-500 mt-0.5">21 days</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-semibold text-amber hover:text-amber/80 transition-colors">
                Bring forward
              </button>
              <button className="text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors">
                Ignore
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
