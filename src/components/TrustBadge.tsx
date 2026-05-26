import { Eye, PenLine, Bot, Pencil } from 'lucide-react';
import type { TrustLevel } from '../data';

interface TrustBadgeProps {
  trust: TrustLevel;
  size?: 'sm' | 'md';
}

const config: Record<TrustLevel, { label: string; icon: typeof Eye; color: string; bg: string; dot: string }> = {
  watched: {
    label: 'Watched',
    icon: Eye,
    color: 'text-watched',
    bg: 'bg-watched/10',
    dot: 'bg-watched',
  },
  logged: {
    label: 'Logged',
    icon: Pencil,
    color: 'text-logged',
    bg: 'bg-logged/10',
    dot: 'bg-logged',
  },
  sign: {
    label: 'You sign',
    icon: PenLine,
    color: 'text-sign',
    bg: 'bg-sign/10',
    dot: 'bg-sign',
  },
  agent: {
    label: 'Agent',
    icon: Bot,
    color: 'text-agent',
    bg: 'bg-agent/10',
    dot: 'bg-agent',
  },
};

export function TrustBadge({ trust, size = 'sm' }: TrustBadgeProps) {
  const c = config[trust];
  const Icon = c.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${c.bg} ${c.color} ${
        isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <Icon size={isSmall ? 10 : 12} strokeWidth={2.5} />
      {c.label}
    </span>
  );
}

export function TrustDot({ trust }: { trust: TrustLevel }) {
  const c = config[trust];
  return <span className={`inline-block w-2 h-2 rounded-full ${c.dot} shrink-0`} />;
}

export function TrustLeftEdge({ trust }: { trust: TrustLevel }) {
  const colors: Record<TrustLevel, string> = {
    watched: 'bg-watched',
    logged: 'bg-logged',
    sign: 'bg-sign',
    agent: 'bg-agent',
  };
  return (
    <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${colors[trust]}`} />
  );
}
