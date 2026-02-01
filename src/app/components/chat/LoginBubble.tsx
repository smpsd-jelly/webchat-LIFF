"use client";

export default function LoginBubble({
  onLogin,
  disabled,
}: {
  onLogin: () => void;
  disabled?: boolean;
}) {
  return (
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
          onClick={onLogin}
          disabled={disabled}
          className="mx-auto mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm hover:bg-sky-50 active:scale-[0.99] disabled:opacity-60"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white text-[11px] font-bold">
            LINE
          </span>
          Login with LINE
        </button>
      </div>
    </div>
  );
}
