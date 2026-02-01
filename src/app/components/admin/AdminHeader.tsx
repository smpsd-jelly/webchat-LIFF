"use client";

export default function AdminHeader({
  q,
  onChangeQ,
  rightText,
}: {
  q: string;
  onChangeQ: (v: string) => void;
  rightText?: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-semibold tracking-tight">Chat</div>
          <div className="text-xs text-slate-500">
            ข้อความจะส่งเข้า LINE OA {rightText ? `• ${rightText}` : ""}
          </div>
        </div>

    
      </div>

      <div className="mt-3">
        <input
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          placeholder="Search user"
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-200"
        />
      </div>
    </div>
  );
}
