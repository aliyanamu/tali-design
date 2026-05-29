import { LayoutDashboard, Activity, GitBranch, Bot, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { userProfile } from '../data';
import taliLogo from '../../tali-transparent.png';

type Screen = 'overview' | 'activity' | 'rules' | 'agent' | 'profile';

interface LayoutProps {
  children: ReactNode;
  activeScreen: Screen;
  onNavigate: (screen: Screen) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const navItems: { id: Screen; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'rules', label: 'Rules', icon: GitBranch },
  { id: 'agent', label: 'Agent', icon: Bot },
];

export function Layout({ children, activeScreen, onNavigate, darkMode, onToggleDark }: LayoutProps) {
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-paper dark:bg-charcoal transition-colors duration-300 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r border-ink-100 dark:border-ink-800 bg-surface dark:bg-ink-900">
          {/* Logo */}
          <div className="px-6 pt-7 pb-6">
            <div className="flex items-center gap-2.5">
              <img src={taliLogo} alt="Tali" className="w-7 h-7 rounded-xl object-cover" />
              <span className="text-[17px] font-semibold text-ink-900 dark:text-cream tracking-tight">
                Tali
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-sign/10 text-sign'
                      : 'text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-cream'
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Profile row at bottom */}
          <div className="px-3 pb-5">
            <button
              onClick={() => onNavigate('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeScreen === 'profile'
                  ? 'bg-sign/10 text-sign'
                  : 'text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800 hover:text-ink-800 dark:hover:text-cream'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sign/25 to-amber/15 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-ink-800 dark:text-cream">
                  {userProfile.avatarInitial}
                </span>
              </div>
              {userProfile.name}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-24 md:pb-0">
          <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-10">
            {children}
          </div>
        </main>

        {/* Mobile bottom tab bar */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800 z-50">
          <div className="flex">
            {navItems.map(({ id, label, icon: Icon }) => {
              const active = activeScreen === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                    active ? 'text-sign' : 'text-ink-400 dark:text-ink-500'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate('profile')}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                activeScreen === 'profile' ? 'text-sign' : 'text-ink-400 dark:text-ink-500'
              }`}
            >
              <div className={`w-[18px] h-[18px] rounded-md flex items-center justify-center ${
                activeScreen === 'profile' ? 'bg-sign/15' : 'bg-ink-100 dark:bg-ink-700'
              }`}>
                <span className={`text-[8px] font-bold leading-none ${activeScreen === 'profile' ? 'text-sign' : 'text-ink-400 dark:text-ink-500'}`}>
                  {userProfile.avatarInitial}
                </span>
              </div>
              Profile
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
