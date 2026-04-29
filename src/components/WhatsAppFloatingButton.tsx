import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "76349746";

const WhatsAppFloatingButton = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Hello A TECH team, I would like to discuss my project.");

  const waUrl = useMemo(() => {
    const text = encodeURIComponent(message.trim());
    return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${text}` : ""}`;
  }, [message]);

  return (
    <div className="fixed bottom-5 left-5 z-50">
      {open ? (
        <div className="mb-3 w-[320px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-green-400/30 bg-background/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-green-500/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">WhatsApp Chat</p>
              <p className="text-xs text-muted-foreground">Quick contact in a mini panel</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close WhatsApp panel"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 0 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              placeholder="Type your WhatsApp message..."
            />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              Send on WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-14 w-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg transition-colors hover:bg-green-600 ring-1 ring-green-300/40"
        aria-label="Toggle WhatsApp mini chat"
        title="WhatsApp Chat"
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
          <path fill="currentColor" d="M16.004 3C8.832 3 3 8.832 3 16.004c0 2.286.595 4.516 1.728 6.483L3 29l6.73-1.696a12.95 12.95 0 0 0 6.274 1.61H16c7.172 0 13.004-5.832 13.004-13.004C29.004 8.832 23.176 3 16.004 3zm7.566 18.341c-.319.897-1.857 1.717-2.56 1.828-.656.103-1.486.146-2.4-.146-.553-.177-1.263-.412-2.185-.812-3.846-1.661-6.357-5.73-6.552-5.992-.185-.263-1.559-2.078-1.559-3.965 0-1.887.998-2.814 1.351-3.198.353-.383.77-.478 1.024-.478.258 0 .512.003.736.014.237.012.553-.09.863.647.319.752 1.083 2.596 1.177 2.784.098.188.161.408.031.659-.126.251-.188.408-.377.627-.189.219-.398.49-.567.658-.188.188-.384.392-.165.769.22.377.975 1.604 2.09 2.598 1.435 1.28 2.646 1.677 3.023 1.866.377.188.596.165.816-.094.219-.259.94-1.098 1.193-1.474.251-.377.502-.314.847-.188.345.126 2.185 1.03 2.56 1.219.377.188.627.282.722.439.094.158.094.91-.225 1.807z" />
        </svg>
      </button>
    </div>
  );
};

export default WhatsAppFloatingButton;
