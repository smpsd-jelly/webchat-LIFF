"use client";

import { useMemo } from "react";
import LoginBubble from "./LoginBubble";

type MeUser = {
  line_user_id: string;
  display_name?: string | null;
  picture_url?: string | null;
};

type OAInfo = { displayName?: string; pictureUrl?: string; userId?: string };

type ChatMsg = {
  id: string;
  from: "oa" | "me" | "system";
  text: string;
  time: string;
  ts: number;
  clientId?: string;
};

type Props = {
  loading: boolean;
  isAuthed: boolean;
  messages: ChatMsg[];
  me: MeUser | null;
  oa: OAInfo | null;
  onLogin: () => Promise<void> | void;
};

type RenderItem =
  | { type: "separator"; id: string; label: string }
  | { type: "msg"; m: ChatMsg };

function isValidTs(ts: unknown): ts is number {
  return typeof ts === "number" && Number.isFinite(ts) && ts > 0;
}

function dateKey(ts: number) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function lineLikeDateLabel(ts: number) {
  const d = new Date(ts);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  return `${weekday}, ${mm}/${dd}`;
}

export default function ChatMessages({
  loading,
  isAuthed,
  messages,
  me,
  oa,
  onLogin,
}: Props) {
  const items = useMemo<RenderItem[]>(() => {
    const out: RenderItem[] = [];
    let prevKey: string | null = null;

    const sorted = [...messages].sort((a, b) => {
      const ta = Number.isFinite(a.ts) ? a.ts : 0;
      const tb = Number.isFinite(b.ts) ? b.ts : 0;

      if (ta === 0 && tb === 0) return 0;
      if (ta === 0) return 1;
      if (tb === 0) return -1;
      return ta - tb;
    });

    for (const m of sorted) {
      const tsOk = isValidTs(m.ts);

      if (m.from !== "system" && tsOk) {
        const k = dateKey(m.ts);
        if (k !== prevKey) {
          prevKey = k;
          out.push({
            type: "separator",
            id: `sep-${k}`,
            label: lineLikeDateLabel(m.ts),
          });
        }
      }

      out.push({ type: "msg", m });
    }

    return out;
  }, [messages]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  if (!isAuthed) {
    return <LoginBubble onLogin={onLogin} disabled={loading} />;
  }

  if (!messages.length) {
    return (
      <div className="text-center text-xs text-slate-400">ยังไม่มีข้อความ</div>
    );
  }

  const oaName = oa?.displayName || "Admin";
  const oaPic = oa?.pictureUrl || "";
  const meName = me?.display_name || "Me";
  const mePic = me?.picture_url || "";

  return (
    <div className="flex flex-col gap-4">
      {items.map((it) => {
        if (it.type === "separator") {
          return (
            <div key={it.id} className="flex items-center justify-center">
              <div className="flex w-full max-w-[420px] items-center gap-3">
                <div className="h-[1px] flex-1 bg-slate-200" />
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                  {it.label}
                </div>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </div>
            </div>
          );
        }

        const m = it.m;

        const isMe = m.from === "me";
        const isSystem = m.from === "system";

        if (isSystem) {
          return (
            <div key={m.id} className="flex justify-center">
              <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
                {m.text}
              </div>
            </div>
          );
        }

        return (
          <div
            key={m.id}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[78%] flex items-start gap-2">
              {!isMe &&
                (oaPic ? (
                  <img
                    src={oaPic}
                    alt={oaName}
                    className="mt-1 h-9 w-9 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="mt-1 h-9 w-9 rounded-full bg-slate-200" />
                ))}

              <div className={isMe ? "text-right" : "text-left"}>
                <div className="mb-1 text-[12px] text-slate-600">
                  {isMe ? meName : oaName}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap break-words ${
                    isMe
                      ? "rounded-tr-md bg-sky-100 text-sky-950 border border-sky-200"
                      : "rounded-tl-md bg-white text-slate-900 border border-slate-200"
                  }`}
                >
                  <div>{m.text}</div>

                  <div
                    className={`mt-1 text-[11px] ${
                      isMe ? "text-sky-800/60" : "text-slate-500"
                    }`}
                  >
                    {m.time || ""}
                  </div>
                </div>
              </div>

              {isMe &&
                (mePic ? (
                  <img
                    src={mePic}
                    alt={meName}
                    className="mt-1 h-9 w-9 rounded-full object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="mt-1 h-9 w-9 rounded-full bg-slate-200" />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
