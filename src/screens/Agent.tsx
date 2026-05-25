import { CheckCircle2, Shield } from 'lucide-react';
import { agentProfile, agentLogEntries } from '../data';
import type { AgentLogEntry } from '../data';

// ── Custom warm avatar (SVG inline, not a robot icon) ──────────────────────
function AgentAvatar() {
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber/20 via-sign/15 to-agent/15 flex items-center justify-center shrink-0 shadow-card">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Warm rounded character — a friendly seedling guardian */}
        <circle cx="18" cy="16" r="11" fill="#2E9E6B" opacity="0.9" />
        <circle cx="14.5" cy="14.5" r="1.8" fill="#FAF8F3" />
        <circle cx="21.5" cy="14.5" r="1.8" fill="#FAF8F3" />
        <circle cx="14.5" cy="14.5" r="0.8" fill="#1A1714" />
        <circle cx="21.5" cy="14.5" r="0.8" fill="#1A1714" />
        <path d="M14 19.5 Q18 22 22 19.5" stroke="#FAF8F3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Little leaf sprout on top */}
        <path d="M18 5 Q16 9 18 11" stroke="#2E9E6B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <ellipse cx="15.5" cy="7" rx="3" ry="4" transform="rotate(-30 15.5 7)" fill="#2E9E6B" opacity="0.7" />
      </svg>
    </div>
  );
}

// ── Log entry ──────────────────────────────────────────────────────────────
function LogEntry({ entry }: { entry: AgentLogEntry }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40 dark:hover:bg-ink-700/20 transition-colors cursor-pointer group">
      <CheckCircle2 size={14} className="text-sign shrink-0" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <span className="text-sm text-ink-800 dark:text-ink-100">{entry.description}</span>
        <span className="text-xs text-ink-400 dark:text-ink-500 ml-2">{entry.timeAgo}</span>
        <span className="font-mono text-[10px] text-ink-300 dark:text-ink-600 ml-2 group-hover:text-agent transition-colors">
          {entry.hash}
        </span>
      </div>
    </div>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────
export function AgentScreen() {
  return (
    <div className="animate-fade-in space-y-7">
      {/* Profile header */}
      <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-5">
        <div className="flex items-start gap-4">
          <AgentAvatar />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-semibold text-ink-900 dark:text-cream tracking-tight">
                {agentProfile.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-sign bg-sign/10 px-2 py-0.5 rounded-full">
                <Shield size={10} strokeWidth={2.5} />
                Verified on {agentProfile.verifiedChain}
              </span>
            </div>
            <p className="font-mono text-[11px] text-ink-400 dark:text-ink-500 mt-1.5 leading-relaxed">
              ERC-8004 Identity NFT #{agentProfile.nftId} · Controller {agentProfile.controller} · Created {agentProfile.created}
            </p>
          </div>
        </div>
      </div>

      {/* Warm plain-language summary */}
      <section className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-5">
        <p className="text-sm text-ink-800 dark:text-ink-100 leading-relaxed">
          Your agent has acted{' '}
          <span className="font-semibold">{agentProfile.totalActions} times</span>{' '}
          and saved{' '}
          <span className="font-semibold text-sign">{agentProfile.totalSaved}</span>{' '}
          for you — getting it right{' '}
          <span className="font-semibold">{agentProfile.successRate}%</span>{' '}
          of the time.
        </p>
        <div className="flex items-center gap-5 mt-4">
          <div>
            <p className="text-xl font-semibold font-tabular text-ink-900 dark:text-cream">
              {agentProfile.totalActions}
            </p>
            <p className="text-[11px] text-ink-400 dark:text-ink-500">actions</p>
          </div>
          <div className="w-px h-8 bg-ink-100 dark:bg-ink-700" />
          <div>
            <p className="text-xl font-semibold font-tabular text-sign">
              {agentProfile.totalSaved}
            </p>
            <p className="text-[11px] text-ink-400 dark:text-ink-500">saved</p>
          </div>
          <div className="w-px h-8 bg-ink-100 dark:bg-ink-700" />
          <div>
            <p className="text-xl font-semibold font-tabular text-ink-900 dark:text-cream">
              {agentProfile.successRate}%
            </p>
            <p className="text-[11px] text-ink-400 dark:text-ink-500">success</p>
          </div>
        </div>
      </section>

      {/* Activity log */}
      <section className="space-y-2">
        <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide px-1">
          Activity log
        </p>
        <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden divide-y divide-ink-50 dark:divide-ink-700">
          {agentLogEntries.map((entry) => (
            <LogEntry key={entry.id} entry={entry} />
          ))}
        </div>
        <p className="text-[11px] text-ink-300 dark:text-ink-600 px-1 mt-1.5">
          Every action is signed on-chain — tap any to verify.
        </p>
      </section>
    </div>
  );
}
