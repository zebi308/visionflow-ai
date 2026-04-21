import { useState } from 'react';
import { Search, Filter, MessageSquare, Phone, Tag, Bot, User, Clock } from 'lucide-react';
import { mockConversations } from '../../constants';
import { cn } from '../../lib/utils';
import type { ConversationStatus } from '../../types';

const STATUS_STYLES: Record<ConversationStatus, string> = {
  open:         'badge-amber',
  'ai-handled': 'badge-brand',
  escalated:    'badge-rose',
  booked:       'badge-green',
  unread:       'badge-violet',
  closed:       'badge-muted',
};

const STATUS_LABELS: Record<ConversationStatus, string> = {
  open:         'Open',
  'ai-handled': 'AI Handled',
  escalated:    'Escalated',
  booked:       'Booked',
  unread:       'Unread',
  closed:       'Closed',
};

const FILTERS: { label: string; value: ConversationStatus | 'all' }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Open',        value: 'open' },
  { label: 'Escalated',   value: 'escalated' },
  { label: 'Booked',      value: 'booked' },
  { label: 'AI Handled',  value: 'ai-handled' },
];

export default function Conversations() {
  const [filter, setFilter] = useState<ConversationStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(mockConversations[0]);

  const filtered = mockConversations.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.patientName.toLowerCase().includes(search.toLowerCase()) ||
                          c.patientPhone.includes(search) ||
                          c.lastMessage.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4 -m-6 p-0">
      {/* Conversation list */}
      <div className="w-80 shrink-0 flex flex-col bg-white border-r border-border">
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="font-display font-bold text-ink">Conversations</h1>
            <span className="badge badge-brand">{mockConversations.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patients…"
              className="input pl-9 py-2 text-xs"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto thin-scroll pb-0.5">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                  filter === f.value
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface text-muted hover:text-ink'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto thin-scroll divide-y divide-border">
          {filtered.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelected(conv)}
              className={cn(
                'w-full text-left px-4 py-3.5 transition-colors hover:bg-surface',
                selected?.id === conv.id && 'bg-brand-50 border-l-2 border-brand-600'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 text-brand-700 font-bold text-sm">
                  {conv.patientName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold text-ink truncate">{conv.patientName}</span>
                    <span className="text-[11px] text-muted shrink-0 ml-2">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-muted truncate leading-relaxed">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className={cn('badge text-[10px]', STATUS_STYLES[conv.status])}>
                      {STATUS_LABELS[conv.status]}
                    </span>
                    {conv.labels.slice(0, 1).map(l => (
                      <span key={l} className="badge badge-muted text-[10px]">{l}</span>
                    ))}
                    {conv.unreadCount ? (
                      <span className="ml-auto w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation detail */}
      {selected ? (
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                {selected.patientName.charAt(0)}
              </div>
              <div>
                <h2 className="font-display font-bold text-ink text-sm">{selected.patientName}</h2>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Phone className="w-3 h-3" />
                  {selected.patientPhone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selected.labels.map(l => (
                <span key={l} className="badge badge-muted">{l}</span>
              ))}
              <span className={cn('badge', STATUS_STYLES[selected.status])}>
                {STATUS_LABELS[selected.status]}
              </span>
              <div className="flex items-center gap-1 ml-2">
                <Bot className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-xs font-semibold text-brand-700">
                  {Math.round(selected.aiConfidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto thin-scroll p-6 space-y-4 bg-surface/40">
            {/* Demo messages */}
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0 mt-1">
                {selected.patientName.charAt(0)}
              </div>
              <div className="max-w-sm">
                <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-ink">{selected.lastMessage}</p>
                </div>
                <p className="text-[11px] text-muted mt-1 ml-1">
                  <Clock className="w-3 h-3 inline mr-1" />{selected.lastMessageTime}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-row-reverse">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-sm">
                <div className="bg-brand-600 rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-sm text-white">
                    Hi {selected.patientName.split(' ')[0]}! I'd be happy to help with that. Let me check our available slots — could you let me know your preferred day and time?
                  </p>
                </div>
                <p className="text-[11px] text-muted mt-1 mr-1 text-right">
                  AI · just now
                </p>
              </div>
            </div>
          </div>

          {/* Reply box */}
          <div className="px-6 py-4 border-t border-border bg-white">
            <div className="flex gap-3 items-end">
              <div className="flex-1 input py-3 resize-none flex items-center gap-2 cursor-text">
                <User className="w-4 h-4 text-muted shrink-0" />
                <input className="flex-1 outline-none bg-transparent text-sm placeholder:text-muted/60" placeholder="Type a manual reply (overrides AI)…" />
              </div>
              <button className="btn-primary py-3">Send</button>
              <button className="btn-secondary py-3 text-xs">
                <Bot className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-muted mt-2">Manual replies pause AI for this conversation. AI resumes after 2 hours of inactivity.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted">
          <div className="text-center">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-border" />
            <p className="text-sm font-medium">Select a conversation</p>
          </div>
        </div>
      )}
    </div>
  );
}
