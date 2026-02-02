"use client";

import { useRef, useState } from "react";

export default function ChatComposer({
  onSend,
}: {
  onSend: (text: string) => Promise<void> | void;
}) {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const sendingRef = useRef(false);
  const lastSendRef = useRef<{ text: string; at: number } | null>(null);

  async function submit() {
    const msg = text.trim();
    if (!msg) return;

    const now = Date.now();

    if (sendingRef.current) return;

    const last = lastSendRef.current;
    if (last && last.text === msg && now - last.at < 800) return;

    sendingRef.current = true;
    lastSendRef.current = { text: msg, at: now };

    setText("");

    try {
      await onSend(msg);
      taRef.current?.blur();
    } finally {
      sendingRef.current = false;
    }
  }

  return (
    <div className="border-t border-slate-200/70 bg-white p-4">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-1 text-[16px] leading-6 outline-none placeholder:text-slate-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.repeat) return;
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || sendingRef.current}
          className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
