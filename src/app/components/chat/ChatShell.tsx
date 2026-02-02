/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import liff from "@line/liff";
import Swal from "sweetalert2";
import { apiGet, apiPost } from "@/lib/api";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import FriendChoiceBubble from "./FriendChoiceBubble";
import ChatComposer from "./ChatComposer";
import BackButton from "../common/BackButton";

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
  ts: number;
  clientId?: string;
};

type OAInfo = { displayName?: string; pictureUrl?: string; userId?: string };

function fmtHHMM(d: Date) {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

type ApiMsg = {
  id: string | number;
  sender_type: "user" | "admin" | "system";
  text: string;
  created_at: string;
};

function safeParseTs(input: unknown): number {
  if (!input) return 0;
  let s = String(input).trim();

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
    s = s.replace(" ", "T");
  }

  const t = Date.parse(s);
  return Number.isFinite(t) ? t : 0;
}

function mapApiMsgToChatMsg(x: ApiMsg): ChatMsg {
  const ts = safeParseTs(x.created_at);

  return {
    id: String(x.id),
    from:
      x.sender_type === "admin"
        ? "oa"
        : x.sender_type === "user"
          ? "me"
          : "system",
    text: x.text,
    time: ts ? fmtHHMM(new Date(ts)) : "",
    ts,
  };
}

function nowTime() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function mergeIncomingWithLocal(prev: ChatMsg[], incoming: ChatMsg[]) {
  const byId = new Map<string, ChatMsg>();
  for (const m of prev) byId.set(m.id, m);

  const out = [...prev];

  for (const inc of incoming) {
    if (byId.has(inc.id)) continue;

    if (inc.from === "me") {
      const idx = out.findIndex(
        (m) =>
          m.id.startsWith("local-") &&
          m.from === "me" &&
          m.text === inc.text &&
          Math.abs((m.ts || 0) - (inc.ts || 0)) <= 10000,
      );

      if (idx !== -1) {
        out[idx] = { ...inc, clientId: out[idx].clientId || out[idx].id };
        byId.set(inc.id, inc);
        continue;
      }
    }

    out.push(inc);
    byId.set(inc.id, inc);
  }

  return out;
}

export default function ChatShell() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [me, setMe] = useState<MeUser | null>(null);
  const [oa, setOa] = useState<OAInfo | null>(null);

  const [friendChecked, setFriendChecked] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendChoice, setFriendChoice] = useState<"unknown" | "add" | "skip">(
    "unknown",
  );
  const showedWaitingOnceRef = useRef(false);
  const pollingTimerRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const oaAddFriendUrl = useMemo(
    () => process.env.NEXT_PUBLIC_OA_ADD_FRIEND_URL || "",
    [],
  );

  const lastAfterRef = useRef<string | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  // ✅ CHANGE
  async function loadHistoryInitial() {
    const r = await apiGet("/messages/history");
    if (!r.ok) throw new Error(await r.text().catch(() => "history failed"));

    const data = (await r.json()) as { messages: ApiMsg[] };
    const mapped = (data.messages || []).map(mapApiMsgToChatMsg);

    // ✅ เซ็ต seen ids
    mapped.forEach((m) => seenIdsRef.current.add(m.id));

    // ✅ เซ็ต after
    const last = data.messages?.[data.messages.length - 1]?.created_at;
    lastAfterRef.current = last || null;

    // ✅ ถ้ามี history → ใช้เลย
    if (mapped.length) {
      setMessages(mapped);
      return;
    }

    // ✅ ถ้าไม่มี history → inject สวัสดีครั้งเดียว
    setMessages([
      {
        id: "oa-admin-hello",
        from: "oa",
        text: "สวัสดีครับ ต้องการสอบถามเรื่องอะไรครับ",
        time: nowTime(),
        ts: Date.now(),
      },
    ]);
  }

  async function pollNewMessages() {
    const qs = lastAfterRef.current
      ? `?after=${encodeURIComponent(lastAfterRef.current)}`
      : "";
    const r = await apiGet(`/messages/history${qs}`);

    if (r.status === 401) {
      setIsAuthed(false);
      setMe(null);
      setMessages([]);
      lastAfterRef.current = null;
      seenIdsRef.current = new Set();
      showedWaitingOnceRef.current = false;
      return;
    }

    if (!r.ok) return;

    const data = (await r.json()) as { messages: ApiMsg[] };
    const incoming = data.messages || [];
    if (!incoming.length) return;

    const last = incoming[incoming.length - 1]?.created_at;
    if (last) lastAfterRef.current = last;

    const mapped = incoming.map(mapApiMsgToChatMsg).filter((m) => {
      if (seenIdsRef.current.has(m.id)) return false;
      seenIdsRef.current.add(m.id);
      return true;
    });

    if (!mapped.length) return;

    setMessages((prev) => mergeIncomingWithLocal(prev, mapped));
  }

  useEffect(() => {
    if (!isAuthed) {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        await loadHistoryInitial();
        if (cancelled) return;

        if (!pollingTimerRef.current) {
          pollingTimerRef.current = setInterval(() => {
            pollNewMessages().catch(() => {});
          }, 1500);
        }
      } catch (e) {
        console.error("history/poll init error:", e);
      }
    })();

    return () => {
      cancelled = true;
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
        pollingTimerRef.current = null;
      }
    };
  }, [isAuthed]);

  async function checkAuth() {
    try {
      const res = await apiGet("/auth/user");
      if (res.ok) {
        const data = await res.json();
        setIsAuthed(true);
        setMe(data.user);
      } else {
        setIsAuthed(false);
        setMe(null);
        setMessages([]);
      }
    } catch {
      setIsAuthed(false);
      setMe(null);
    }
  }

  async function loadOAInfo() {
    try {
      const r = await apiGet("/auth/info");
      const raw = await r.text().catch(() => "");
      if (!r.ok) return;

      const data = raw ? JSON.parse(raw) : null;
      const oaInfo = data?.oa ?? data;

      setOa(oaInfo);
    } catch (e) {
      console.error("loadOAInfo error:", e);
    }
  }

  async function checkFriendship() {
    try {
      const fr = await liff.getFriendship();
      setIsFriend(!!fr?.friendFlag);
    } catch {
      setIsFriend(false);
    } finally {
      setFriendChecked(true);
    }
  }

  function ensureAdminHelloOnce() {
    setMessages((prev) => {
      const userHasSpoken = prev.some((m) => m.from === "me");
      if (userHasSpoken) return prev;

      const oaHelloExists = prev.some((m) => m.id === "oa-admin-hello");
      if (oaHelloExists) return prev;

      return [
        ...prev,
        {
          id: "oa-admin-hello",
          from: "oa",
          text: "สวัสดีครับ ต้องการสอบถามเรื่องอะไรครับ",
          time: nowTime(),
          ts: Date.now(),
        },
      ];
    });
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
        await liff.init({ liffId });

        await checkAuth();
        await loadOAInfo();

        if (!alive) return;

        const authedNow = await (async () => {
          try {
            const res = await apiGet("/auth/user");
            return res.ok;
          } catch {
            return false;
          }
        })();

        if (!authedNow && liff.isLoggedIn()) {
          const idToken = liff.getIDToken();
          if (idToken) {
            const res = await apiPost("/auth/line/verify", { idToken });
            if (res.ok) await checkAuth();
            else liff.logout();
          } else {
            liff.logout();
          }
        }

        await checkFriendship();

        const alreadyFriend = await liff
          .getFriendship()
          .then((r) => !!r.friendFlag)
          .catch(() => false);

        if (alive && alreadyFriend) {
          setFriendChoice("add");
          ensureAdminHelloOnce();
        }
      } catch (e) {
        console.error(e);
        await checkAuth().catch(() => {});
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function handleLoginWithLINE() {
    setLoading(true);
    try {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
      await liff.init({ liffId });

      const redirectUri = `${window.location.origin}/user`;

      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri });
        return;
      }

      const idToken = liff.getIDToken();
      if (!idToken) {
        liff.logout();
        window.location.href = redirectUri;
        return;
      }

      const vr = await apiPost("/auth/line/verify", { idToken });
      if (!vr.ok) {
        const t = await vr.text().catch(() => "");
        console.error("verify failed:", t);
        liff.logout();
        throw new Error("verify failed");
      }

      await checkAuth();
      await checkFriendship();
    } catch (e) {
      console.error(e);
      await Swal.fire({ icon: "error", title: "LINE login error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await apiPost("/auth/logout", {});
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID!;
        await liff.init({ liffId });
        if (liff.isLoggedIn()) liff.logout();
      } catch {}

      setIsAuthed(false);
      setMe(null);
      setFriendChecked(false);
      setIsFriend(false);
      setFriendChoice("unknown");
      setMessages([]);
      lastAfterRef.current = null;
      seenIdsRef.current = new Set();
      showedWaitingOnceRef.current = false;

      window.location.reload();
    } catch (e) {
      console.error(e);
      await Swal.fire({ icon: "error", title: "Logout ไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  }

  function openAddFriend() {
    if (!oaAddFriendUrl) {
      Swal.fire({
        icon: "warning",
        title: "ตั้งค่าไม่ครบ",
        text: "ยังไม่ได้ตั้งค่า",
      });
      return;
    }
    liff.openWindow({ url: oaAddFriendUrl, external: true });
  }

  async function recheckFriendship() {
    setLoading(true);
    try {
      await checkFriendship();
      const ok = await liff
        .getFriendship()
        .then((r) => !!r.friendFlag)
        .catch(() => false);

      setIsFriend(ok);

      await Swal.fire({
        icon: ok ? "success" : "info",
        title: ok ? "เพิ่มเพื่อนแล้ว" : "ยังไม่ได้เพิ่มเพื่อน",
        timer: 1400,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onChooseAdd() {
    setFriendChoice("add");
    ensureAdminHelloOnce();
    await Swal.fire({
      icon: "info",
      title: "เพิ่มเพื่อน",
      html: `<div style="font-size:13px;color:#64748b;">
        * หากเพิ่มเพื่อนจะได้รับข่าวสารอื่น ๆ จากเราเพิ่มเติม
      </div>`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((r) => {
      if (r.isConfirmed) openAddFriend();
    });
  }

  async function onChooseSkip() {
    setFriendChoice("skip");
    ensureAdminHelloOnce();
    await Swal.fire({
      icon: "success",
      title: "เริ่มใช้งานได้เลย",
      timer: 1400,
      showConfirmButton: false,
    });
  }

  async function onSend(text: string) {
    const msg = text.trim();
    if (!msg) return;

    const clientId = `local-${crypto.randomUUID()}`;
    const ts = Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: clientId,
        clientId,
        from: "me",
        text: msg,
        time: fmtHHMM(new Date(ts)),
        ts,
      },
    ]);

    try {
      if (liff.isInClient()) {
        await liff.sendMessages([{ type: "text", text: msg }]);
        return;
      }

      const res = await apiPost("/messages/send", { text: msg });
      if (!res.ok) throw new Error(await res.text().catch(() => "send failed"));

      if (!showedWaitingOnceRef.current) {
        showedWaitingOnceRef.current = true;

        setMessages((prev) => {
          if (prev.some((m) => m.id === "sys-waiting-once")) return prev;

          return [
            ...prev,
            {
              id: "sys-waiting-once",
              from: "system",
              text: "กรุณารอการตอบกลับสักครู่",
              time: "",
              ts: Date.now(),
            },
          ];
        });
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${clientId}`,
          from: "system",
          text: "ส่งไม่สำเร็จ กรุณาลองใหม่",
          time: "",
          ts,
        },
      ]);
    }
  }

  const showChoiceBubble = isAuthed && !loading && friendChoice === "unknown";

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-slate-50 p-6 text-slate-900">
      <div className="mx-auto mb-3 w-full max-w-xl">
        <BackButton
          href="/"
          label="Home"
          className="text-black hover:underline"
        />
      </div>

      <main className="mx-auto flex h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)]">
        <ChatHeader
          isAuthed={isAuthed}
          loading={loading}
          me={me}
          onLogin={handleLoginWithLINE}
          onLogout={handleLogout}
        />

        <div className="relative flex-1 overflow-y-auto bg-white p-5">
          <ChatMessages
            loading={loading}
            isAuthed={isAuthed}
            messages={messages}
            me={me}
            oa={oa}
            onLogin={handleLoginWithLINE}
          />

          {showChoiceBubble && (
            <FriendChoiceBubble
              isFriend={isFriend}
              friendChecked={friendChecked}
              onChooseAdd={onChooseAdd}
              onChooseSkip={onChooseSkip}
              onOpenAddFriend={openAddFriend}
              onRecheckFriendship={recheckFriendship}
            />
          )}
        </div>

        {isAuthed && !loading && <ChatComposer onSend={onSend} />}
      </main>
    </div>
  );
}
