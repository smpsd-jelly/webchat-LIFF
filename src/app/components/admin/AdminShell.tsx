"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import AdminHeader from "./AdminHeader";
import ConversationList from "./ConversationList";
import ChatPanel from "./ChatPanel";
import ReplyComposer from "./ReplyComposer";
import { Conversation, Message } from "./types";
import { apiGet, apiPost } from "@/lib/api";
import BackButton from "../common/BackButton";

const ADMIN_PREFIX = "/admin";

export default function AdminShell() {
  const [q, setQ] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  const selectedConv = useMemo(
    () =>
      conversations.find((c) => String(c.id) === String(selectedId)) || null,
    [conversations, selectedId],
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const lastMessageAtRef = useRef<string | null>(null);

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  async function fetchConversations() {
    const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    const r = await apiGet(`${ADMIN_PREFIX}/conversations${qs}`);
    if (!r.ok) throw new Error(await r.text());

    const data = await r.json();
    setConversations(data.conversations || data.items || []);
  }

  async function fetchMessages(
    conversationId: string | number,
    after?: string | null,
  ) {
    const qs = after ? `?after=${encodeURIComponent(after)}` : "";
    const r = await apiGet(
      `${ADMIN_PREFIX}/conversations/${conversationId}/messages${qs}`,
    );
    if (!r.ok) throw new Error(await r.text());

    const data = await r.json();
    const newMsgs: Message[] = data.messages || data.items || [];

    if (after) {
      if (newMsgs.length) setMessages((prev) => [...prev, ...newMsgs]);
    } else {
      setMessages(newMsgs);
    }

    if (newMsgs.length) {
      lastMessageAtRef.current =
        (newMsgs[newMsgs.length - 1] as any)?.created_at ||
        lastMessageAtRef.current;
    }
  }

  async function sendMessage(text: string) {
    if (!selectedId) return;

    const r = await apiPost(
      `${ADMIN_PREFIX}/conversations/${selectedId}/messages`,
      { text },
    );
    if (!r.ok) throw new Error(await r.text());

    await fetchMessages(selectedId, lastMessageAtRef.current);
    await fetchConversations();
  }

  useEffect(() => {
    let alive = true;

    const run = async () => {
      try {
        await fetchConversations();
      } catch {}
    };

    run();
    const t = setInterval(() => {
      if (!alive) return;
      run();
    }, 2000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [q]);

  useEffect(() => {
    if (!selectedId) return;

    let alive = true;

    const load = async () => {
      try {
        lastMessageAtRef.current = null;
        await fetchMessages(selectedId);
      } catch {}
    };

    load();

    const t = setInterval(async () => {
      if (!alive) return;
      try {
        await fetchMessages(selectedId, lastMessageAtRef.current);
      } catch {}
    }, 1000);

    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [selectedId]);

  function handleSelectConversation(id: string | number) {
    setSelectedId(id);
    setMobileView("chat");
  }

  function handleBackToList() {
    setMobileView("list");
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 text-slate-900 sm:p-4 md:p-6">
      <main className="mx-auto w-full max-w-6xl">
        <div className="mb-3 flex items-center gap-3">
          <BackButton
            label={mobileView === "chat" ? "Home" : "Home"}
            href={mobileView === "chat" ? undefined : "/"}
            onClick={() => {
              if (mobileView === "chat") handleBackToList();
            }}
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)]">
          <div className="grid h-[88vh] grid-cols-1 md:h-[84vh] md:grid-cols-[320px_1fr]">
            <aside
              className={[
                "flex flex-col border-slate-200 bg-slate-50/70 md:border-r",
                mobileView === "chat" ? "hidden md:flex" : "flex",
              ].join(" ")}
            >
              <AdminHeader q={q} onChangeQ={setQ} rightText="Admin" />
              <ConversationList
                conversations={conversations}
                selectedId={selectedId}
                onSelect={handleSelectConversation}
              />
            </aside>

            <section
              className={[
                "flex min-w-0 flex-col bg-white",
                mobileView === "list" ? "hidden md:flex" : "flex",
              ].join(" ")}
            >
              <ChatPanel
                selectedConv={selectedConv}
                messages={messages}
                onBackMobile={handleBackToList}
              />
              <ReplyComposer disabled={!selectedConv} onSend={sendMessage} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
