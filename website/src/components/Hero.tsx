import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DISCORD_INSTALL_URL, SECTION_IDS } from "../lib/constants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { CtaButton } from "./CtaButton";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.9], [1, 0]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-[100dvh] snap-start snap-always flex-col items-center justify-center px-6 text-center"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 600 300"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] sm:h-[480px] sm:w-[940px]"
        fill="none"
      >
        <g stroke="#5ea8ff" strokeWidth="1">
          <line x1="70" y1="55" x2="195" y2="115" />
          <line x1="195" y1="115" x2="335" y2="65" />
          <line x1="335" y1="65" x2="475" y2="135" />
          <line x1="195" y1="115" x2="250" y2="220" />
          <line x1="475" y1="135" x2="535" y2="225" />
        </g>
        <g fill="#8fc5ff">
          <circle cx="70" cy="55" r="3" />
          <circle cx="195" cy="115" r="3.5" />
          <circle cx="335" cy="65" r="3" />
          <circle cx="475" cy="135" r="3.5" />
          <circle cx="250" cy="220" r="2.5" />
          <circle cx="535" cy="225" r="3" />
        </g>
      </svg>
      <motion.div
        style={prefersReducedMotion ? undefined : { scale, y, opacity }}
        className="flex flex-col items-center"
      >
        <h1 className="text-glow-blue font-display text-[4.25rem] font-semibold leading-none tracking-tight text-iris-blue sm:text-[6.5rem] md:text-[8.5rem]">
          IRIS
        </h1>
        <p className="mt-6 max-w-xl font-display text-xl font-medium text-text sm:text-2xl">
          Your squadron's watch on the space domain.
        </p>
        <p className="mt-4 max-w-md font-body text-base text-text-muted sm:text-lg">
          Iris is a bot tasked with keeping you up to date with space news and cutting-edge
          technology.
        </p>
      </motion.div>

      <motion.div
        style={prefersReducedMotion ? undefined : { opacity: ctaOpacity, y }}
        className="mt-10 flex flex-col items-center gap-4"
      >
        <CtaButton href={DISCORD_INSTALL_URL} target="_blank" rel="noreferrer noopener">
          Add Iris to your server
        </CtaButton>
        <button
          type="button"
          onClick={() => scrollToId(SECTION_IDS.howItWorks)}
          className="font-body text-sm text-text-muted underline decoration-text-muted/40 underline-offset-4 transition-colors duration-200 hover:text-iris-blue-bright"
        >
          Learn more
        </button>
      </motion.div>
    </section>
  );
}
