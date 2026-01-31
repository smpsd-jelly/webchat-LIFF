"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

type MeUser = {
  line_user_id: string;
  display_name?: string | null;
  picture_url?: string | null;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [me, setMe] = useState<MeUser | null>(null);

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
      }
    } catch {
      setIsAuthed(false);
      setMe(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function handleLoginMock() {
    setLoading(true);

    try {
      const res = await apiPost("/auth/login", {
        line_user_id: "U_MOCK_123",
        display_name: "Mock User",
        picture_url: null,
      });

      const text = await res.text(); // อ่าน raw ก่อน
      console.log("login status:", res.status, "body:", text);

      if (!res.ok) {
        alert(`login failed: ${res.status}\n${text}`);
        return;
      }

      await checkAuth();
    } catch (e) {
      console.error(e);
      alert("login error (network/cors)");
    } finally {
      setLoading(false);
    }
  }

  // ✅ NEW: logout
  async function handleLogout() {
    setLoading(true);
    try {
      const res = await apiPost("/auth/logout", {});
      const text = await res.text().catch(() => "");
      console.log("logout status:", res.status, "body:", text);

      // ไม่ว่า ok หรือไม่ ให้เคลียร์ state ฝั่ง UI ก่อน
      setIsAuthed(false);
      setMe(null);

      // แล้วค่อยเช็ค auth ซ้ำให้ชัวร์ (กรณี cookie/session ถูกลบจริง)
      await checkAuth();
    } catch (e) {
      console.error(e);
      // fallback: เคลียร์หน้าไว้ก่อน
      setIsAuthed(false);
      setMe(null);
      alert("logout error (network/cors)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-slate-50 p-6 text-slate-900">
      <main className="mx-auto flex h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)]">
        {/* Header */}
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xs font-semibold">
                LINE
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">NAME OA</div>
                <div className="mt-0.5 text-xs text-white/75">
                  {isAuthed
                    ? `Logged in: ${me?.display_name ?? me?.line_user_id}`
                    : "Please login"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/80">
                LIFF/Webchat UI
              </span>

              {/* ✅ NEW: Logout button */}
              {isAuthed && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/90 hover:bg-white/15 disabled:opacity-60"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-white p-5">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading...
            </div>
          ) : !isAuthed ? (
            // 🔒 ยังไม่ login
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-center shadow-sm">
                <div className="text-sm font-semibold text-slate-900">
                  กรุณา Login LINE ก่อนเริ่มใช้งาน
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  เพื่อเชื่อมต่อบัญชีและเริ่มแชทกับ LINE OA
                </div>

                <button
                  type="button"
                  onClick={handleLoginMock}
                  className="mx-auto mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 active:scale-[0.99]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                    LINE
                  </span>
                  Login with LINE
                </button>

                <div className="mt-2 text-[11px] text-slate-500">
                  * ตอนนี้เป็น mock login
                </div>
              </div>
            </div>
          ) : (
            // 💬 login แล้ว
            <div className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-200" />
                <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
                  <div className="text-sm leading-6">
                    สวัสดีครับ ขอสอบถามข้อมูลหน่อย
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">10:02</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[78%] rounded-2xl rounded-br-md bg-sky-100 px-4 py-2 text-sky-950 shadow-sm border border-sky-200">
                  <div className="text-sm leading-6">
                    ได้เลยครับ ต้องการสอบถามเรื่องอะไร
                  </div>
                  <div className="mt-1 text-[11px] text-sky-800/70">10:03</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        {isAuthed && !loading && (
          <div className="border-t border-slate-200/70 bg-white p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
              <textarea
                placeholder="พิมพ์ข้อความ..."
                className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
              />
              <button className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                ส่ง
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
