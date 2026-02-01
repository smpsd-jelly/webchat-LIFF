"use client";
import LoginBubble from "./LoginBubble";

type MeUser = {
  line_user_id: string;
  display_name?: string | null;
  picture_url?: string | null;
};

type ChatMsg = {
  id: string;
  from: "oa" | "me" | "system";
  text: string;
  time: string;
};

type OAInfo = {
  displayName?: string;
  pictureUrl?: string;
  userId?: string;
};

export default function ChatMessages({
  loading,
  isAuthed,
  messages,
  me,
  oa,
  onLogin,
}: {
  loading: boolean;
  isAuthed: boolean;
  messages: ChatMsg[];
  me: MeUser | null;
  oa: OAInfo | null;
  onLogin: () => void;
}) {
  const oaName = oa?.displayName || "LINE OA";
  const oaPic = oa?.pictureUrl || "";

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

  const meName = me?.display_name ?? me?.line_user_id ?? "You";
  const mePic = me?.picture_url ?? "";

  return (
    <div className="space-y-4">
      {messages.map((m) => {
        if (m.from === "system") {
          return (
            <div key={m.id} className="flex justify-center">
              <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] text-amber-800">
                {m.text}
              </div>
            </div>
          );
        }

        //  OA / Admin message (ซ้าย)
        if (m.from === "oa") {
          return (
            <div key={m.id} className="flex items-start gap-2">
              {oaPic ? (
                <img
                  src={oaPic}
                  alt={oaName}
                  className="mt-1 h-9 w-9 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="mt-1 h-9 w-9 rounded-full bg-slate-200" />
              )}

              <div className="max-w-[78%]">
                <div className="mb-1 text-[12px] text-slate-600">{oaName}</div>

                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-2 shadow-sm">
                  <div className="text-sm leading-6">{m.text}</div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {m.time}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        //  User message (ขวา)
        return (
          <div key={m.id} className="flex justify-end">
            <div className="max-w-[78%] flex items-start gap-2">
              <div className="text-right">
                <div className="mb-1 text-[12px] text-slate-600">{meName}</div>

                <div className="rounded-2xl rounded-tr-md bg-sky-100 px-4 py-2 text-sky-950 shadow-sm border border-sky-200">
                  <div className="text-sm leading-6">{m.text}</div>
                  <div className="mt-1 text-[11px] text-sky-800/60">
                    {m.time}
                  </div>
                </div>
              </div>

              {mePic ? (
                <img
                  src={mePic}
                  alt={meName}
                  className="mt-1 h-9 w-9 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="mt-1 h-9 w-9 rounded-full bg-slate-200" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
