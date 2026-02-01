import Link from "next/link";

export default function HomePage() {
  const USER_PATH = "/user";
  const ADMIN_PATH = "/admin";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-sky-200/60 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-fuchsia-200/50 blur-[120px]" />

      <div className="relative flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-white/70 px-6 py-3 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-fuchsia-600 bg-clip-text text-transparent">
                Welcome
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              เลือกประเภทการเข้าใช้งานเพื่อไปยังหน้าที่ต้องการ
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-7 shadow-xl shadow-slate-200/40 backdrop-blur">
            <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900">
              เลือกประเภทการเข้าใช้งาน
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-600">
              กรุณาเลือกว่าต้องการเข้าเป็น{" "}
              <span className="font-semibold text-slate-900">ผู้ใช้งานทั่วไป</span>{" "}
              หรือ{" "}
              <span className="font-semibold text-slate-900">ผู้ดูแลระบบ</span>
            </p>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <div className="space-y-3">
              <Link
                href={USER_PATH}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition
                           hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-100 ring-1 ring-sky-200">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-sky-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>

                  <div className="text-left">
                    <div className="text-base font-semibold text-slate-900">
                      ผู้ใช้งานทั่วไป
                    </div>
                
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-sm text-slate-500 transition group-hover:text-slate-900">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>

              <Link
                href={ADMIN_PATH}
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition
                           hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-fuchsia-50 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-fuchsia-100 ring-1 ring-fuchsia-200">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-fuchsia-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 1l3 5 5 1-3 4 1 6-6-3-6 3 1-6-3-4 5-1 3-5z" />
                    </svg>
                  </div>

                  <div className="text-left">
                    <div className="text-base font-semibold text-slate-900">
                      ผู้ดูแลระบบ
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-sm text-slate-500 transition group-hover:text-slate-900">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>

        
          </div>
        </div>
      </div>
    </main>
  );
}
