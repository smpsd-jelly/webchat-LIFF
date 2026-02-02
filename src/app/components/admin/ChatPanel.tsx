"use client";

import { useEffect, useRef } from "react";
import { Conversation, Message } from "./types";
import { fmtDateTime, fmtTime } from "./utils";

function initials(name?: string | null) {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export default function ChatPanel({
  selectedConv,
  messages,
  onBackMobile,
}: {
  selectedConv: Conversation | null;
  messages: Message[];
  onBackMobile?: () => void;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const displayName =
    selectedConv?.user?.display_name || selectedConv?.line_user_id || "Unknown";
  const avatar = selectedConv?.user?.picture_url;

  return (
    <main className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBackMobile}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 md:hidden"
          >
            ← Back
          </button>

          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-700">
                {initials(selectedConv?.user?.display_name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{displayName}</div>
            <div className="text-xs text-slate-500">
              {selectedConv?.user?.last_seen_at
                ? `last seen: ${fmtDateTime(selectedConv.user.last_seen_at)}`
                : selectedConv
                  ? "last seen: -"
                  : "เลือกผู้ใช้ทางซ้ายเพื่อเริ่มแชท"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          {selectedConv ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">
              {selectedConv.status}
            </span>
          ) : null}

       
          <button className="rounded-full p-2 hover:bg-slate-100" title="More">
            <span className="text-sm">⋯</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white px-4 py-4 sm:px-5">
        {!selectedConv ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            เลือก user ทางซ้ายเพื่อดูข้อความ
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m) => {
              const isAdmin = m.sender_type === "admin";

              const bubbleCls = isAdmin
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-900 border border-slate-200";

              const metaCls = isAdmin ? "text-slate-300" : "text-slate-400";

              return (
                <div
                  key={String(m.id)}
                  className={["flex", isAdmin ? "justify-end" : "justify-start"].join(" ")}
                >
                  <div
                    className={[
                      "max-w-[86%] sm:max-w-[72%]",
                      "rounded-2xl px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap",
                      bubbleCls,
                    ].join(" ")}
                  >
                    {m.text}
                    <div className={["mt-1 text-[11px]", metaCls].join(" ")}>
                      {fmtTime(m.created_at)}
                      {m.status ? ` • ${m.status}` : ""}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </main>
  );
}
