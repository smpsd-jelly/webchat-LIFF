"use client";

import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";

export default function BackButton({
  href,
  label = "Back",
  className = "",
  onClick,
}: {
  href?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  function handleClick() {
    onClick?.();

    if (href) {
      router.push(href);
      return;
    }

    if (typeof window !== "undefined" && window.history.length <= 1) {
      router.push("/");
      return;
    }

    router.back();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900",
        "hover:bg-slate-50 active:scale-[0.99]",
        className,
      ].join(" ")}
      aria-label={label}
    >
      <IoChevronBackOutline  className="h-3 w-3" />
      <span className="leading-none">{label}</span>
    </button>
  );
}
