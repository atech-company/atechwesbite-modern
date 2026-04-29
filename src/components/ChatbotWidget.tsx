import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, MessageCircle, Pencil, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Link } from 'react-router-dom';

type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; createdAt: string };
type ChatThread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
};

const firstAssistantMessage = (): ChatMessage => ({
  id: crypto.randomUUID(),
  role: 'assistant',
  text: 'Hi! I am your A TECH assistant. Ask about services, process, pricing direction, tech stack, or any general question.',
  createdAt: new Date().toISOString(),
});

const createThread = (title = 'New Chat'): ChatThread => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title,
    createdAt: now,
    updatedAt: now,
    messages: [firstAssistantMessage()],
  };
};

const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const renderMarkdownToHtml = (text: string): string => {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-black/40 rounded p-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-black/30 rounded px-1">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-primary">$1</a>')
    .replace(/\n/g, '<br />');
};

const ChatbotWidget = () => {
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000';
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [typingText, setTypingText] = useState<string | null>(null);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [renamingThreadId, setRenamingThreadId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const storageKey = useMemo(() => (user ? `atech_chat_history_${user.id}` : null), [user]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );
  const messages = activeThread?.messages ?? [];

  useEffect(() => {
    if (!storageKey) {
      setThreads([]);
      setActiveThreadId(null);
      return;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatThread[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
          return;
        }
      }
    } catch {
      // Ignore malformed storage and reset.
    }

    const starter = createThread('Welcome Chat');
    setThreads([starter]);
    setActiveThreadId(starter.id);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || threads.length === 0) return;
    localStorage.setItem(storageKey, JSON.stringify(threads));
  }, [threads, storageKey]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading || !user || !activeThread) return;
    setInput('');
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text,
      createdAt: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [...thread.messages, userMessage],
              updatedAt: new Date().toISOString(),
              title: thread.messages.length <= 1 ? text.slice(0, 30) : thread.title,
            }
          : thread,
      ),
    );
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/chatbot`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as { reply?: string };
      const fullReply = data.reply ?? 'No response available.';
      setTypingText('');
      let i = 0;
      const timer = window.setInterval(() => {
        i += 1;
        setTypingText(fullReply.slice(0, i));
        if (i >= fullReply.length) {
          window.clearInterval(timer);
          const assistantMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: fullReply,
            createdAt: new Date().toISOString(),
          };
          setThreads((prev) =>
            prev.map((thread) =>
              thread.id === activeThread.id
                ? { ...thread, messages: [...thread.messages, assistantMessage], updatedAt: new Date().toISOString() }
                : thread,
            ),
          );
          setTypingText(null);
        }
      }, 14);
    } catch {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'Assistant is unavailable right now. Please try again.',
        createdAt: new Date().toISOString(),
      };
      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThread.id
            ? { ...thread, messages: [...thread.messages, assistantMessage], updatedAt: new Date().toISOString() }
            : thread,
        ),
      );
      setTypingText(null);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (!user || !storageKey || !activeThread) return;
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [
                {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  text: 'Chat history cleared. How can I help you today?',
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : thread,
      ),
    );
  };

  const createNewChat = () => {
    const thread = createThread();
    setThreads((prev) => [thread, ...prev]);
    setActiveThreadId(thread.id);
  };

  const startRename = (thread: ChatThread) => {
    setRenamingThreadId(thread.id);
    setRenameValue(thread.title);
  };

  const saveRename = () => {
    const clean = renameValue.trim();
    if (!clean || !renamingThreadId) {
      setRenamingThreadId(null);
      return;
    }
    setThreads((prev) => prev.map((t) => (t.id === renamingThreadId ? { ...t, title: clean } : t)));
    setRenamingThreadId(null);
  };

  const exportChat = () => {
    if (!activeThread) return;
    const body = [
      `Thread: ${activeThread.title}`,
      `Created: ${activeThread.createdAt}`,
      '',
      ...activeThread.messages.map((m) => `[${m.role.toUpperCase()} ${m.createdAt}] ${m.text}`),
    ].join('\n');

    const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeThread.title.replace(/\s+/g, '-').toLowerCase() || 'chat'}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-background/95 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary/80 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold leading-none tracking-tight">A TECH AI</h4>
                <p className="text-xs text-muted-foreground">Website assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <button
                  onClick={clearHistory}
                  className="p-2 rounded-md hover:bg-muted"
                  title="Clear chat history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>
          </div>
          {!user ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">Sign in to use your personal AI assistant and save chat history.</p>
              <Button asChild className="w-full">
                <Link to="/login" onClick={() => setOpen(false)}>Sign In to Continue</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[138px_1fr] h-[26rem]">
                <div className="border-r border-border/60 p-2 space-y-2 overflow-y-auto bg-muted/20">
                  <Button size="sm" className="w-full h-8" onClick={createNewChat}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> New
                  </Button>
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left rounded-md px-2 py-1.5 text-xs transition-colors ${thread.id === activeThreadId ? 'bg-primary/15 border border-primary/30 text-foreground' : 'hover:bg-muted/80 text-muted-foreground'}`}
                    >
                      <div className="truncate">{thread.title}</div>
                    </button>
                  ))}
                </div>
                <div ref={listRef} className="overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-background to-muted/10">
                  <div className="flex items-center justify-between mb-1">
                    {renamingThreadId === activeThread?.id ? (
                      <div className="flex items-center gap-1 w-full">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename();
                            if (e.key === 'Escape') setRenamingThreadId(null);
                          }}
                          className="h-7 text-xs"
                        />
                        <Button size="sm" className="h-7 px-2" onClick={saveRename}>Save</Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-muted-foreground truncate">{activeThread?.title ?? 'Chat'}</div>
                        <div className="flex items-center gap-1">
                          {activeThread && (
                            <>
                              <button onClick={() => startRename(activeThread)} className="p-1 rounded hover:bg-muted" title="Rename chat">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={exportChat} className="p-1 rounded hover:bg-muted" title="Export chat">
                                <Download className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {messages.map((m) => (
                    <div key={m.id} className={`rounded-xl px-3 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary/15 ml-10 border border-primary/30 text-foreground' : 'bg-card mr-10 border border-border/70 text-foreground'}`}>
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(m.text) }} />
                      <div className="text-[10px] text-muted-foreground mt-1">{formatTime(m.createdAt)}</div>
                    </div>
                  ))}
                  {typingText !== null && (
                    <div className="rounded-xl px-3 py-2.5 text-sm bg-card mr-10 border border-border/70">
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(typingText) }} />
                      <div className="text-[10px] text-muted-foreground mt-1">typing...</div>
                    </div>
                  )}
                  {loading && typingText === null && (
                    <div className="rounded-xl px-3 py-2.5 text-sm bg-card mr-10 border border-border/70">Thinking...</div>
                  )}
                </div>
              </div>
              <div className="p-3 border-t border-border/70 flex gap-2 bg-background/80">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this website or anything..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void send();
                  }}
                />
                <Button onClick={() => void send()} disabled={loading || !input.trim()}>{loading ? '...' : 'Send'}</Button>
              </div>
            </>
          )}
        </div>
      )}

      <Button
        className="fixed bottom-5 right-5 z-50 rounded-full h-14 w-14 p-0 shadow-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 ring-1 ring-primary/30"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
};

export default ChatbotWidget;
