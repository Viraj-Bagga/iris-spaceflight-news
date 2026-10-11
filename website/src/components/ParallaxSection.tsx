import { useRef, type ReactNode } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function ParallaxSection({
  id,
  children,
  className = "",
}: {
  id: string;
  children: (active: boolean) => ReactNode;
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const active = useInView(sectionRef, { amount: 0.6 });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative flex min-h-[100dvh] snap-start snap-always items-center justify-center px-6 py-10 ${className}`}
    >
      <div className="w-full max-w-3xl">{children(active)}</div>
    </section>
  );
}

type RevealFrom = "left" | "right" | "up" | "scale" | "fade";

const HIDDEN_BY_FROM: Record<RevealFrom, Record<string, number>> = {
  left: { opacity: 0, x: -56 },
  right: { opacity: 0, x: 56 },
  up: { opacity: 0, y: 20 },
  scale: { opacity: 0, scale: 0.88, y: 10 },
  fade: { opacity: 0 },
};

function buildVariants(from: RevealFrom, delay: number, duration: number): Variants {
  return {
    hidden: HIDDEN_BY_FROM[from],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
}

/** Section heading: a quiet fade in place — distinct from the body's directional entrance. */
export function SectionHeading({
  active,
  children,
  className = "",
  delay = 0,
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = buildVariants("fade", delay, 0.7);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : active ? "visible" : "hidden"}
      variants={prefersReducedMotion ? undefined : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Body content that reveals from a direction once its section becomes the active snap frame. */
export function Reveal({
  active,
  from = "up",
  delay = 0,
  duration = 0.6,
  children,
  className = "",
}: {
  active: boolean;
  from?: RevealFrom;
  delay?: number;
  duration?: number;
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = buildVariants(from, delay, duration);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? undefined : active ? "visible" : "hidden"}
      variants={prefersReducedMotion ? undefined : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
