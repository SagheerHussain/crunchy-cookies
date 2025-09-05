import React from "react";

export default function OrdersTab({ className = "", active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={[
        `${className} md:inline-flex md:w-auto w-full items-center gap-2 rounded-xl border px-5 py-2 text-sm font-semibold`,
        active
          ? "border-transparent bg-primary text-white shadow"
          : "border-primary/20 text-primary hover:bg-primary/20",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 ms-3 md:ms-0 text-xs",
          active ? "bg-white text-primary" : "bg-primary text-white",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}
