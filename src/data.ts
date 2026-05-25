export type TrustLevel = 'watched' | 'sign' | 'agent';

export interface Wallet {
  id: string;
  name: string;
  address?: string;
  trust: TrustLevel;
  chain: string;
  assets: Asset[];
}

export interface Asset {
  symbol: string;
  amount: number;
  valueRp: number;
}

export interface OffchainAccount {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cash';
  valueRp: number;
}

export interface Activity {
  id: string;
  date: string;
  type: 'receive' | 'send' | 'swap' | 'auto-save' | 'yield' | 'p2p-sell' | 'top-up' | 'client-payment';
  description: string;
  amount: string;
  valueRp: number;
  wallet: string;
  trust: TrustLevel;
  hash?: string;
  positive: boolean;
  tag?: string;
}

export interface LinkedTradeSide {
  direction: 'out' | 'in';
  amount: string;
  valueRp?: number;
  wallet: string;
  walletSublabel: string;
  trust: TrustLevel;
  hash?: string;
  chain?: string;
  isOffchain?: boolean;
}

export interface LinkedTrade {
  id: string;
  title: string;
  date: string;
  sides: [LinkedTradeSide, LinkedTradeSide];
}

export interface AgentAction {
  id: string;
  title: string;
  timeAgo: string;
  reasoning: string;
  trust: TrustLevel;
  chain?: string;
  hash?: string;
}

export interface ReconcilePair {
  id: string;
  prompt: string;
  left: string;
  right: string;
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused';
  trust: TrustLevel;
  lastFired?: string;
  nextFire?: string;
  savedTotal?: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  action: string;
  detail: string;
  trust: TrustLevel;
  amount?: string;
  status: 'done' | 'pending' | 'waiting';
}

export interface AgentProfile {
  name: string;
  nftId: string;
  controller: string;
  created: string;
  totalActions: number;
  totalSaved: string;
  successRate: number;
  verifiedChain: string;
}

export interface AgentLogEntry {
  id: string;
  description: string;
  timeAgo: string;
  hash: string;
  confirmed: boolean;
}

// ── Wallets ────────────────────────────────────────────────────────────────
export const wallets: Wallet[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    address: '0xABC…9F2',
    trust: 'watched',
    chain: 'Ethereum',
    assets: [
      { symbol: 'USDT', amount: 3500, valueRp: 56_560_000 },
      { symbol: 'mETH', amount: 0.8, valueRp: 46_200_000 },
    ],
  },
  {
    id: 'indodax',
    name: 'Indodax',
    address: undefined,
    trust: 'watched',
    chain: 'CEX',
    assets: [
      { symbol: 'USDT', amount: 847, valueRp: 13_689_500 },
    ],
  },
  {
    id: 'phantom',
    name: 'Phantom',
    address: undefined,
    trust: 'watched',
    chain: 'Solana',
    assets: [
      { symbol: 'SOL', amount: 0.42, valueRp: 2_940_000 },
    ],
  },
  {
    id: 'tali',
    name: 'Tali Wallet',
    address: '0xDEF…71C',
    trust: 'sign',
    chain: 'Ethereum',
    assets: [
      { symbol: 'USDT', amount: 1240, valueRp: 20_048_000 },
      { symbol: 'USDY', amount: 450, valueRp: 7_276_500 },
    ],
  },
  {
    id: 'autonomous',
    name: 'AutonomousRule.sol',
    address: '0xGHI…04A',
    trust: 'agent',
    chain: 'Ethereum',
    assets: [
      { symbol: 'USDT', amount: 680, valueRp: 10_992_000 },
    ],
  },
];

export const offchainAccounts: OffchainAccount[] = [
  { id: 'bca', name: 'BCA', type: 'bank', valueRp: 35_380_000 },
  { id: 'gopay', name: 'GoPay', type: 'ewallet', valueRp: 312_000 },
  { id: 'cash', name: 'Cash', type: 'cash', valueRp: 500_000 },
];

export const totalNetWorth = 1_284_730_000;
export const totalOnchain = 1_210_000_000;
export const totalOffchain = 79_700_000;
export const monthlyChangeRp = 41_200_000;
export const monthlyChangePct = 3.3;

// ── Chart data (30 days of net worth) ──────────────────────────────────────
export const chartData30d = (() => {
  const base = 1_243_530_000;
  const points: number[] = [];
  let val = base;
  for (let i = 0; i < 30; i++) {
    const drift = (Math.sin(i * 0.4) * 8_000_000) + (Math.cos(i * 0.7) * 4_000_000) + (i * 1_300_000);
    val = base + drift;
    points.push(val);
  }
  points[29] = totalNetWorth;
  return points;
})();

// ── Activity (today's feed) ────────────────────────────────────────────────
export const todayActivities: Activity[] = [
  {
    id: 'a-client',
    date: 'today',
    type: 'client-payment',
    description: 'Client payment',
    amount: '+500 USDT',
    valueRp: 8_085_000,
    wallet: 'Tali Wallet',
    trust: 'sign',
    hash: '0xa1b2…c3d4',
    positive: true,
    tag: 'client payment',
  },
  {
    id: 'a-gopay',
    date: 'today',
    type: 'top-up',
    description: 'GoPay top-up',
    amount: '−Rp 200.000',
    valueRp: -200_000,
    wallet: 'GoPay',
    trust: 'watched',
    positive: false,
  },
];

export const linkedTrade: LinkedTrade = {
  id: 'lt1',
  title: 'You sold USDT for rupiah',
  date: 'today',
  sides: [
    {
      direction: 'out',
      amount: '−2.000 USDT',
      valueRp: 32_340_000,
      wallet: 'MetaMask',
      walletSublabel: 'auto-detected',
      trust: 'watched',
      hash: '0x7f3a…b291',
      chain: 'Mantle',
    },
    {
      direction: 'in',
      amount: '+Rp 35.380.000',
      wallet: 'BCA',
      walletSublabel: 'you logged',
      trust: 'watched',
      isOffchain: true,
    },
  ],
};

export const agentAction: AgentAction = {
  id: 'ag1',
  title: 'Your agent saved 50 USDT for you',
  timeAgo: '2 min ago',
  reasoning: 'Your rule matched: 500 USDT arrived, saved 10%',
  trust: 'agent',
  chain: 'Mantle',
  hash: '0x6b1e…a027',
};

export const reconcilePair: ReconcilePair = {
  id: 'rc1',
  prompt: 'These two might be the same trade — link them?',
  left: '−2.000 USDT from MetaMask',
  right: '+Rp 35.380.000 to BCA',
};

// Previous days
export const pastActivities: Activity[] = [
  {
    id: 'a2',
    date: '23 Mei 2026',
    type: 'yield',
    description: 'Yield USDY masuk',
    amount: '+4,50 USDY',
    valueRp: 72_765,
    wallet: 'Tali Wallet',
    trust: 'sign',
    hash: '0x4d1c…7e08',
    positive: true,
  },
  {
    id: 'a3',
    date: '22 Mei 2026',
    type: 'send',
    description: 'Kirim ke teman',
    amount: '−100 USDT',
    valueRp: -1_617_000,
    wallet: 'Tali Wallet',
    trust: 'sign',
    hash: '0x9b2f…1a44',
    positive: false,
  },
  {
    id: 'a4',
    date: '21 Mei 2026',
    type: 'receive',
    description: 'Terima dari Indodax',
    amount: '+200 USDT',
    valueRp: 3_234_000,
    wallet: 'MetaMask',
    trust: 'watched',
    hash: '0x3c8e…f712',
    positive: true,
  },
];

// ── Rules ──────────────────────────────────────────────────────────────────
export const rules: Rule[] = [
  {
    id: 'r1',
    title: 'Tabung 50 USDT setiap minggu',
    description: 'Setiap Senin, kirim 50 USDT dari Tali Wallet ke kontrak tabungan.',
    status: 'active',
    trust: 'agent',
    lastFired: 'Senin, 24 Mei 2026',
    nextFire: 'Senin, 31 Mei 2026',
    savedTotal: '650 USDT',
  },
  {
    id: 'r2',
    title: 'Beri tahu jika saldo BCA < Rp 5jt',
    description: 'Kirim notifikasi saat saldo BCA turun di bawah Rp 5.000.000.',
    status: 'active',
    trust: 'sign',
    lastFired: '—',
  },
  {
    id: 'r3',
    title: 'Yield USDY otomatis di-reinvest',
    description: 'Setiap yield USDY masuk, langsung reinvest ke protokol yang sama.',
    status: 'paused',
    trust: 'agent',
    lastFired: '23 Mei 2026',
  },
];

// ── Agent Logs ─────────────────────────────────────────────────────────────
export const agentLogs: AgentLog[] = [
  {
    id: 'l1',
    timestamp: '24 Mei 2026 · 08:00',
    action: 'Auto-save dijalankan',
    detail: 'Mengirim 50 USDT ke kontrak tabungan sesuai aturan mingguan.',
    trust: 'agent',
    amount: '50 USDT',
    status: 'done',
  },
  {
    id: 'l2',
    timestamp: '23 Mei 2026 · 14:32',
    action: 'Yield reinvest dijeda',
    detail: 'Aturan reinvest-yield sedang dijeda. Tidak ada tindakan.',
    trust: 'agent',
    status: 'pending',
  },
  {
    id: 'l3',
    timestamp: '22 Mei 2026 · 19:15',
    action: 'Menunggu persetujuanmu',
    detail: 'Pengiriman 100 USDT menunggu tanda tanganmu sebelum dikirim.',
    trust: 'sign',
    amount: '100 USDT',
    status: 'waiting',
  },
  {
    id: 'l4',
    timestamp: '17 Mei 2026 · 08:00',
    action: 'Auto-save dijalankan',
    detail: 'Mengirim 50 USDT ke kontrak tabungan sesuai aturan mingguan.',
    trust: 'agent',
    amount: '50 USDT',
    status: 'done',
  },
];

// ── Agent Profile ─────────────────────────────────────────────────────────
export const agentProfile: AgentProfile = {
  name: "Mufidah's Tali",
  nftId: '8.472',
  controller: '0xDEF…71C',
  created: 'March 2026',
  totalActions: 11,
  totalSaved: '1.150 USDT',
  successRate: 92,
  verifiedChain: 'Mantle',
};

export const agentLogEntries: AgentLogEntry[] = [
  {
    id: 'le1',
    description: 'Saved 50 USDT as USDY',
    timeAgo: '2 min ago',
    hash: '0xdef…a027',
    confirmed: true,
  },
  {
    id: 'le2',
    description: 'Linked a P2P trade',
    timeAgo: '1 hour ago',
    hash: '0xabc…b291',
    confirmed: true,
  },
  {
    id: 'le3',
    description: 'Flagged a forgotten balance',
    timeAgo: '2 hours ago',
    hash: '0x123…c339',
    confirmed: true,
  },
  {
    id: 'le4',
    description: 'Auto-saved 50 USDT weekly',
    timeAgo: '3 days ago',
    hash: '0x6b1e…a027',
    confirmed: true,
  },
  {
    id: 'le5',
    description: 'Reinvested USDY yield',
    timeAgo: '5 days ago',
    hash: '0x4d1c…7e08',
    confirmed: true,
  },
];
