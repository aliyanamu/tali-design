import { useState, useRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, Bot, Link2, Coins, Landmark, Plus, Upload, X, Pencil, Check, FileUp } from 'lucide-react';
import { TrustBadge, TrustLeftEdge } from '../components/TrustBadge';
import {
  todayActivities,
  pastActivities,
  linkedTrade,
  agentAction,
  reconcilePair,
  loggedAccounts,
} from '../data';
import type { Activity as ActivityType, LinkedTradeSide, LoggedAccount } from '../data';

function formatRp(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `Rp ${(abs / 1_000_000).toFixed(2).replace('.', ',')}jt`;
  return `Rp ${abs.toLocaleString('id-ID')}`;
}

// ── Bottom Sheet ─────────────────────────────────────────────────────────────
interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/30 dark:bg-ink-900/50 animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-surface dark:bg-ink-800 rounded-t-3xl shadow-2xl animate-slide-up pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink-100 dark:border-ink-700">
          <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">Add or import</span>
          <button onClick={onClose} className="text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors p-1">
            <X size={16} strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Log Transaction Modal ────────────────────────────────────────────────────
interface LogTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onLog: (tx: {
    amount: string;
    account: string;
    direction: 'in' | 'out';
    note?: string;
  }) => void;
}

function LogTransactionModal({ open, onClose, onLog }: LogTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState<LoggedAccount | null>(loggedAccounts[0] ?? null);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [note, setNote] = useState('');

  if (!open) return null;

  const handleSubmit = () => {
    if (!amount || !account) return;
    onLog({ amount, account: account.name, direction, note: note || undefined });
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/30 dark:bg-ink-900/50 animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-surface dark:bg-ink-800 rounded-t-3xl shadow-2xl animate-slide-up pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink-100 dark:border-ink-700">
          <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">Log a transaction</span>
          <button onClick={onClose} className="text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors p-1">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 pt-4 space-y-4">
          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-ink-300 mb-1 block">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Rp 500.000"
              className="w-full bg-ink-50 dark:bg-ink-700 text-ink-800 dark:text-cream rounded-xl px-4 py-3 text-sm border border-ink-100 dark:border-ink-600 focus:outline-none focus:border-sign transition-colors"
            />
          </div>

          {/* Account */}
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-ink-300 mb-1 block">Account</label>
            <div className="flex flex-wrap gap-2">
              {loggedAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setAccount(acc)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    account?.id === acc.id
                      ? 'bg-sign/10 text-sign border border-sign/30'
                      : 'bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 border border-transparent hover:border-ink-200 dark:hover:border-ink-500'
                  }`}
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-ink-300 mb-1 block">Direction</label>
            <div className="flex gap-2">
              {(['in', 'out'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDirection(dir)}
                  className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    direction === dir
                      ? dir === 'in'
                        ? 'bg-sign/10 text-sign border border-sign/30'
                        : 'bg-ink-100 dark:bg-ink-700 text-ink-600 dark:text-ink-300 border border-ink-200 dark:border-ink-500'
                      : 'bg-ink-50 dark:bg-ink-800 text-ink-400 dark:text-ink-500 border border-transparent hover:border-ink-200 dark:hover:border-ink-600'
                  }`}
                >
                  {dir === 'in' ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                  {dir === 'in' ? 'Money in' : 'Money out'}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-medium text-ink-600 dark:text-ink-300 mb-1 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. dinner with friends"
              className="w-full bg-ink-50 dark:bg-ink-700 text-ink-800 dark:text-cream rounded-xl px-4 py-3 text-sm border border-ink-100 dark:border-ink-600 focus:outline-none focus:border-sign transition-colors"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!amount || !account}
            className="w-full bg-sign text-white text-sm font-semibold py-3 rounded-xl hover:bg-sign/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Log transaction
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Import Statement Modal ───────────────────────────────────────────────────
interface DetectedTx {
  id: string;
  date: string;
  description: string;
  amount: string;
  direction: 'in' | 'out';
}

interface ImportStatementModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (txs: DetectedTx[]) => void;
}

function ImportStatementModal({ open, onClose, onImport }: ImportStatementModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [detected, setDetected] = useState<DetectedTx[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setUploadedFile(file);
    // Simulated detection after short delay
    setTimeout(() => {
      const sampleDetected: DetectedTx[] = [
        { id: 'd1', date: '2024-01-15', description: 'Transfer from BCA', amount: 'Rp 2.500.000', direction: 'in' },
        { id: 'd2', date: '2024-01-14', description: 'Groceries', amount: 'Rp 450.000', direction: 'out' },
        { id: 'd3', date: '2024-01-12', description: 'Coffee', amount: 'Rp 85.000', direction: 'out' },
      ];
      setDetected(sampleDetected);
      setSelectedIds(new Set(sampleDetected.map((t) => t.id)));
    }, 800);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleConfirm = () => {
    if (!detected) return;
    const selected = detected.filter((t) => selectedIds.has(t.id));
    onImport(selected);
    setUploadedFile(null);
    setDetected(null);
    setSelectedIds(new Set());
    onClose();
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setDetected(null);
    setSelectedIds(new Set());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/30 dark:bg-ink-900/50 animate-fade-in" />
      <div
        className="relative w-full max-w-md bg-surface dark:bg-ink-800 rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-ink-100 dark:border-ink-700 shrink-0">
          <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">Import a statement</span>
          <button onClick={onClose} className="text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors p-1">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pt-4 space-y-4">
          {!detected ? (
            <>
              <p className="text-xs text-ink-500 dark:text-ink-400">
                Drop a PDF or image of your bank or e-wallet statement. We'll detect the transactions.
              </p>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-sign bg-sign/5'
                    : 'border-ink-200 dark:border-ink-600 bg-ink-50/30 dark:bg-ink-700/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {!uploadedFile ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-700 flex items-center justify-center mx-auto mb-3">
                      <FileUp size={24} className="text-ink-400 dark:text-ink-500" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium text-ink-700 dark:text-ink-200 mb-1">
                      Drop file here, or click to browse
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500">
                      Supports PDF, PNG, JPG
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 justify-center">
                    <FileUp size={20} className="text-sign" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{uploadedFile.name}</span>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {uploadedFile && !detected && (
                <div className="flex items-center justify-center gap-2 text-xs text-ink-400 dark:text-ink-500">
                  <div className="w-4 h-4 border-2 border-sign border-t-transparent rounded-full animate-spin" />
                  Detecting transactions…
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  Detected {detected.length} transactions.
                </p>
                <button
                  onClick={resetUpload}
                  className="text-xs text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-300 transition-colors"
                >
                  Upload different file
                </button>
              </div>
              <div className="space-y-2">
                {detected.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => toggleSelect(tx.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      selectedIds.has(tx.id)
                        ? 'bg-sign/5 border border-sign/20'
                        : 'bg-ink-50 dark:bg-ink-700 border border-transparent opacity-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      selectedIds.has(tx.id) ? 'bg-sign text-white' : 'bg-ink-100 dark:bg-ink-600 text-ink-400'
                    }`}>
                      {selectedIds.has(tx.id) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink-800 dark:text-ink-100">{tx.description}</p>
                      <p className="text-[10px] text-ink-400 dark:text-ink-500">{tx.date}</p>
                    </div>
                    <span className={`text-sm font-semibold font-tabular ${tx.direction === 'in' ? 'text-sign' : 'text-ink-600 dark:text-ink-300'}`}>
                      {tx.direction === 'in' ? '+' : '−'}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="w-full bg-sign text-white text-sm font-semibold py-3 rounded-xl hover:bg-sign/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Looks right — add {selectedIds.size} transaction{selectedIds.size !== 1 ? 's' : ''}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Linked Trade Hero ──────────────────────────────────────────────────────────
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

// ── Agent Action Row ───────────────────────────────────────────────────────────
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

// ── Simple Activity Row ─────────────────────────────────────────────────────────
function ActivityRow({ item, showBadge }: { item: ActivityType; showBadge?: boolean }) {
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
          {showBadge && <TrustBadge trust="logged" />}
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

// ── Reconcile Card ─────────────────────────────────────────────────────────────
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

// ── Main Screen ────────────────────────────────────────────────────────────────
export function ActivityScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [loggedTxs, setLoggedTxs] = useState<ActivityType[]>([]);

  const pastByDate = pastActivities.reduce<Record<string, ActivityType[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const handleLogTx = (tx: { amount: string; account: string; direction: 'in' | 'out'; note?: string }) => {
    const newTx: ActivityType = {
      id: `logged-${Date.now()}`,
      description: tx.note || `${tx.direction === 'in' ? 'Received' : 'Sent'} on ${tx.account}`,
      wallet: tx.account,
      amount: tx.amount,
      positive: tx.direction === 'in',
      valueRp: 0,
      date: 'today',
    };
    setLoggedTxs((prev) => [newTx, ...prev]);
    setLogModalOpen(false);
    setSheetOpen(false);
  };

  const handleImport = (_txs: DetectedTx[]) => {
    // For demo, just close — in real app would add to feed
    setImportModalOpen(false);
    setSheetOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-7">
      {/* Warm intro with action button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream tracking-tight">
            Activity
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
            Everything that moved, threaded together.
          </p>
        </div>
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 bg-ink-50 dark:bg-ink-700 px-3 py-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add or import
        </button>
      </div>

      {/* Today — day container */}
      <section className="space-y-3">
        <p className="text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wide px-1">
          Today
        </p>

        <LinkedTradeHero />
        <AgentActionRow />

        {/* Logged transactions (newly added) */}
        {loggedTxs.length > 0 && (
          <div className="bg-surface dark:bg-ink-800 rounded-3xl shadow-card dark:shadow-card-dark overflow-hidden divide-y divide-ink-50 dark:divide-ink-700">
            {loggedTxs.map((item) => (
              <ActivityRow key={item.id} item={item} showBadge />
            ))}
          </div>
        )}

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

      {/* Bottom sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="px-2 pt-2 pb-1">
          <button
            onClick={() => { setSheetOpen(false); setLogModalOpen(true); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-ink-50 dark:hover:bg-ink-700/30 transition-colors rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-logged/10 flex items-center justify-center shrink-0">
              <Pencil size={16} className="text-logged" strokeWidth={2} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-ink-800 dark:text-ink-100">Log a transaction</p>
              <p className="text-xs text-ink-400 dark:text-ink-500">Quick entry for cash or bank moves</p>
            </div>
          </button>
          <button
            onClick={() => { setSheetOpen(false); setImportModalOpen(true); }}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-ink-50 dark:hover:bg-ink-700/30 transition-colors rounded-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-ink-100 dark:bg-ink-700 flex items-center justify-center shrink-0">
              <Upload size={16} className="text-ink-500 dark:text-ink-300" strokeWidth={2} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-ink-800 dark:text-ink-100">Import a statement</p>
              <p className="text-xs text-ink-400 dark:text-ink-500">Upload PDF or image of bank / e-wallet</p>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Log Transaction Modal */}
      <LogTransactionModal
        open={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        onLog={handleLogTx}
      />

      {/* Import Statement Modal */}
      <ImportStatementModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
