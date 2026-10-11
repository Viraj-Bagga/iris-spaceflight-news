import type { ComponentPropsWithoutRef } from "react";

export function CtaButton({
  className = "",
  children,
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return (
    <a
      {...props}
      className={`inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-display text-sm font-semibold tracking-wide text-space-black transition-colors duration-200 hover:bg-gold-bright ${className}`}
    >
      {children}
    </a>
  );
}
