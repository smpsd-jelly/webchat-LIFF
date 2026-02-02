"use client";

import { useState } from "react";

export default function ReplyComposer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (text: string) => Promise<void> | void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const msg = text.trim();
    if (!msg) return;

    setSending(true);
    try {
      await onSend(msg);
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-2 focus-within:ring-2 focus-within:ring-slate-200">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={disabled || sending}
          placeholder={disabled ? "เลือกห้องก่อน" : "Type your message…"}
          className="flex-1 bg-transparent px-2 text-sm outline-none disabled:opacity-60"
        />

        <button
          onClick={send}
          disabled={disabled || sending || !text.trim()}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 sm:px-4"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
