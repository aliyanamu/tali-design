import { useState } from 'react';
import {
  LogOut, Plus, Trash2, Shield, Save,
  Sun, Moon, Globe, Banknote, Clock,
} from 'lucide-react';
import { TrustBadge } from '../components/TrustBadge';
import {
  userProfile, watchedWallets, loggedAccounts, ownedWallets,
} from '../data';
import type { OwnedWallet } from '../data';

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide px-1">
        {title}
      </p>
      <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden divide-y divide-ink-50 dark:divide-ink-700">
        {children}
      </div>
    </section>
  );
}

// ── Quiet row ──────────────────────────────────────────────────────────────
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/40 dark:hover:bg-ink-700/20 transition-colors">
      {children}
    </div>
  );
}

// ── Wallet icon per name ───────────────────────────────────────────────────
function WalletIcon({ name }: { name: string }) {
  const colors: Record<string, string> = {
    MetaMask: 'bg-amber/15 text-amber',
    Indodax: 'bg-sign/10 text-sign',
    Phantom: 'bg-violet-500/10 text-violet-500',
    BCA: 'bg-sign/10 text-sign',
    GoPay: 'bg-sign/10 text-sign',
    Cash: 'bg-ink-100 dark:bg-ink-700 text-ink-500',
  };
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${colors[name] ?? 'bg-ink-100 dark:bg-ink-700 text-ink-500'}`}>
      {name.slice(0, 2)}
    </div>
  );
}

// ── Owned wallet row ───────────────────────────────────────────────────────
function OwnedWalletRow({ wallet }: { wallet: OwnedWallet }) {
  return (
    <Row>
      <WalletIcon name={wallet.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-ink-800 dark:text-ink-100">{wallet.name}</span>
          <TrustBadge trust={wallet.trust} />
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="font-mono text-[11px] text-ink-400 dark:text-ink-500">{wallet.address}</span>
          {wallet.nftId && (
            <span className="font-mono text-[10px] text-ink-300 dark:text-ink-600">{wallet.nftId}</span>
          )}
        </div>
      </div>
    </Row>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────
export function ProfileScreen({ darkMode, onToggleDark }: { darkMode: boolean; onToggleDark: () => void }) {
  const [language, setLanguage] = useState<'en' | 'id'>('en');
  const [staleDays, setStaleDays] = useState(60);
  const [savedLanguage, setSavedLanguage] = useState<'en' | 'id'>('en');
  const [savedStaleDays, setSavedStaleDays] = useState(60);
  const [saving, setSaving] = useState(false);

  const isDirty = language !== savedLanguage || staleDays !== savedStaleDays;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSavedLanguage(language);
      setSavedStaleDays(staleDays);
      setSaving(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* You */}
      <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sign/20 to-amber/15 flex items-center justify-center shrink-0">
            <span className="text-lg font-semibold text-ink-800 dark:text-cream">{userProfile.avatarInitial}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-ink-900 dark:text-cream tracking-tight">
              {userProfile.name}
            </h1>
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">
              Signed in with email · {userProfile.email}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-ink-50 dark:border-ink-700">
          <button className="flex items-center gap-2 text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors">
            <LogOut size={12} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>

      {/* Accounts — Watched */}
      <Section title="Watched · read-only">
        {watchedWallets.map((w) => (
          <Row key={w.id}>
            <WalletIcon name={w.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-ink-800 dark:text-ink-100">{w.name}</span>
                <TrustBadge trust="watched" />
              </div>
              <span className="font-mono text-[11px] text-ink-400 dark:text-ink-500">
                {w.address ?? w.sublabel}
              </span>
            </div>
            <button className="text-ink-300 dark:text-ink-600 hover:text-ink-500 dark:hover:text-ink-400 transition-colors p-1">
              <Trash2 size={12} strokeWidth={2} />
            </button>
          </Row>
        ))}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            <Plus size={14} strokeWidth={2.5} />
          </div>
          <span className="text-sm text-ink-500 dark:text-ink-400">Watch a wallet</span>
          <span className="text-[10px] text-ink-300 dark:text-ink-600 ml-1">paste a read-only address</span>
        </Row>
      </Section>

      {/* Accounts — Logged */}
      <Section title="Logged · manual">
        {loggedAccounts.map((a) => (
          <Row key={a.id}>
            <WalletIcon name={a.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-ink-800 dark:text-ink-100">{a.name}</span>
                <TrustBadge trust="logged" />
              </div>
              <span className="text-[11px] text-ink-400 dark:text-ink-500 font-tabular">{a.balanceLabel}</span>
            </div>
            <button className="text-ink-300 dark:text-ink-600 hover:text-ink-500 dark:hover:text-ink-400 transition-colors p-1">
              <Trash2 size={12} strokeWidth={2} />
            </button>
          </Row>
        ))}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            <Plus size={14} strokeWidth={2.5} />
          </div>
          <span className="text-sm text-ink-500 dark:text-ink-400">Add account</span>
        </Row>
      </Section>

      {/* Accounts — Your wallets (read-only disclosure) */}
      <Section title="Your wallets">
        {ownedWallets.map((w) => (
          <OwnedWalletRow key={w.id} wallet={w} />
        ))}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-sign/10 text-sign">
            <Shield size={14} strokeWidth={2.5} />
          </div>
          <span className="text-sm text-ink-500 dark:text-ink-400">Add MPC wallet</span>
          <span className="text-[10px] text-ink-300 dark:text-ink-600 ml-1">secure shared-custody</span>
        </Row>
      </Section>

      {/* Preferences */}
      <Section title="Preferences">
        {/* Theme */}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            {darkMode ? <Moon size={14} strokeWidth={2} /> : <Sun size={14} strokeWidth={2} />}
          </div>
          <span className="text-sm text-ink-800 dark:text-ink-100 flex-1">Theme</span>
          <button
            onClick={onToggleDark}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors"
          >
            {darkMode ? 'Dark' : 'Light'}
          </button>
        </Row>

        {/* Language */}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            <Globe size={14} strokeWidth={2} />
          </div>
          <span className="text-sm text-ink-800 dark:text-ink-100 flex-1">Language</span>
          <div className="flex items-center gap-1 bg-ink-50 dark:bg-ink-700 rounded-lg p-0.5">
            {(['en', 'id'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors ${
                  language === lang
                    ? 'bg-surface dark:bg-ink-800 text-ink-800 dark:text-cream shadow-sm'
                    : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300'
                }`}
              >
                {lang === 'en' ? 'English' : 'Bahasa'}
              </button>
            ))}
          </div>
        </Row>

        {/* Base currency */}
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            <Banknote size={14} strokeWidth={2} />
          </div>
          <span className="text-sm text-ink-800 dark:text-ink-100 flex-1">Base currency</span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-lg bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300">
            IDR
          </span>
        </Row>
      </Section>

      {/* Nudges */}
      <Section title="Nudges">
        <Row>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-ink-50 dark:bg-ink-700 text-ink-400 dark:text-ink-500">
            <Clock size={14} strokeWidth={2} />
          </div>
          <span className="text-sm text-ink-800 dark:text-ink-100 flex-1">
            Tell me when a balance sits still for
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={staleDays}
              onChange={(e) => setStaleDays(Number(e.target.value))}
              className="w-12 text-center text-sm font-tabular bg-ink-50 dark:bg-ink-700 text-ink-800 dark:text-cream rounded-lg px-1.5 py-1 border border-ink-100 dark:border-ink-600 focus:outline-none focus:border-sign transition-colors"
            />
            <span className="text-xs text-ink-400 dark:text-ink-500">days</span>
          </div>
        </Row>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className={`inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${
            isDirty
              ? 'bg-sign text-white hover:bg-sign/90'
              : 'bg-ink-100 dark:bg-ink-700 text-ink-400 dark:text-ink-500 cursor-default'
          }`}
        >
          <Save size={14} strokeWidth={2} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
