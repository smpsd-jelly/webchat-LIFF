"use client";
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

type MeUser = {
  line_user_id: string;
  display_name?: string | null;
  picture_url?: string | null;
};

type OAInfo = { displayName?: string; pictureUrl?: string; userId?: string };

export default function ChatHeader({
  isAuthed,
  loading,
  me,
  onLogin,
  onLogout,
}: {
  isAuthed: boolean;
  loading: boolean;
  me: MeUser | null;
  onLogin: () => void;
  onLogout: () => void;
}) {
  const [oa, setOa] = useState<OAInfo | null>(null);
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await apiGet("/auth/info");

        if (!r.ok) return;
        const data = await r.json();
        if (alive) setOa(data.oa);
      } catch {}
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="border-b border-slate-200/70 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 px-5 py-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {oa?.pictureUrl ? (
            <img
              src={oa.pictureUrl}
              alt={oa.displayName || "LINE OA"}
              className="h-11 w-11 rounded-full border border-white/20 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xs font-semibold">
              OA
            </div>
          )}

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">
              {oa?.displayName || "LINE OA"}
            </div>

            <div className="mt-0.5 text-xs text-white/75 flex items-center gap-2">
              {isAuthed ? (
                <>
                  {me?.picture_url ? (
                    <img
                      src={me.picture_url}
                      alt={me.display_name ?? me.line_user_id}
                      className="h-4 w-4 rounded-full object-cover border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="inline-block h-4 w-4 rounded-full bg-white/20" />
                  )}
                  <span>
                    {me?.display_name ?? me?.line_user_id ?? "Logged in"}
                  </span>
                </>
              ) : (
                <span>Please login</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {!isAuthed ? (
            <button
              type="button"
              onClick={onLogin}
              disabled={loading}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/90 hover:bg-white/15 disabled:opacity-60"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              disabled={loading}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/90 hover:bg-white/15 disabled:opacity-60"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
