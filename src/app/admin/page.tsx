"use client";

export default function Admin() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-slate-50 p-6 text-slate-900">
      <main className="mx-auto flex h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-blue-700 via-sky-600 to-blue-700 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-xs font-semibold">
                LINE
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-wide">
                  NAME OA
                </div>
                <div className="mt-0.5 text-xs text-white/75">
                  Premium Webchat • Online
                </div>
              </div>
            </div>

            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] text-white/80">
              LIFF/Webchat UI
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-5">
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

            <div className="flex items-end gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm">
                <div className="text-sm leading-6">
                  อยากทราบสถานะการจัดส่งครับ
                </div>
                <div className="mt-1 text-[11px] text-slate-500">10:04</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/70 bg-white p-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-sky-300 focus-within:ring-2 focus-within:ring-sky-100">
            <textarea
              placeholder="พิมพ์ข้อความ..."
              className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
            />
            <button className="h-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-700 to-sky-600 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 active:scale-[0.99]">
              ส่ง
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Enter เพื่อส่ง • Shift+Enter ขึ้นบรรทัดใหม่</span>
            <span className="rounded-full bg-sky-50 px-2 py-1 text-sky-700">
              UI only
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
