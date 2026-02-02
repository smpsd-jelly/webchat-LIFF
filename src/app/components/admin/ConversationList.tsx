"use client";

import { Conversation } from "./types";
import { fmtTime } from "./utils";

function initials(name?: string | null) {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: {
  conversations: Conversation[];
  selectedId: string | number | null;
  onSelect: (id: string | number) => void;
}) {
  return (
    <div className="flex-1 overflow-auto">
      {conversations.map((c) => {
        const active = String(c.id) === String(selectedId);
        const name = c.user?.display_name || c.line_user_id;
        const avatar = c.user?.picture_url;

        return (
          <button
            key={String(c.id)}
            onClick={() => onSelect(c.id)}
            className={[
              "group relative w-full text-left",
              "border-b border-slate-200/70 px-4 py-3",
              "hover:bg-white/70",
              active ? "bg-white" : "bg-transparent",
            ].join(" ")}
          >
            {/* active indicator */}
            <span
              className={[
                "absolute left-0 top-0 h-full w-1 rounded-r-full",
                active ? "bg-slate-900" : "bg-transparent",
              ].join(" ")}
            />

            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-200 ring-2 ring-white">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-700">
                    {initials(c.user?.display_name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={[
                      "truncate text-sm",
                      active ? "font-semibold text-slate-900" : "font-medium text-slate-800",
                    ].join(" ")}
                  >
                    {name}
                  </div>
                  <div className="shrink-0 text-xs text-slate-500">
                    {fmtTime(c.last_message_at)}
                  </div>
                </div>

                <div className="mt-0.5 truncate text-xs text-slate-500">
                  {c.last_message_text || "—"}
                </div>
              </div>

              {c.unread_admin_count > 0 ? (
                <div className="ml-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {c.unread_admin_count}
                </div>
              ) : (
                <div className="ml-1 h-2 w-2 rounded-full bg-emerald-400 opacity-70" />
              )}
            </div>
          </button>
        );
      })}

      {!conversations.length ? (
        <div className="p-6 text-sm text-slate-500">ยังไม่มีบทสนทนา</div>
      ) : null}
    </div>
  );
}
