import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { DISCORD_INSTALL_URL, SECTION_IDS } from "../lib/constants";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { CtaButton } from "./CtaButton";

const NAV_LINKS = [
  { label: "How it works", id: SECTION_IDS.howItWorks },
  { label: "Why Iris", id: SECTION_IDS.whyIris },
  { label: "Setup", id: SECTION_IDS.setup },
  { label: "About", id: SECTION_IDS.about },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
    if (prefersReducedMotion) {
      lastY.current = latest;
      return;
    }
    const diff = latest - lastY.current;
    if (latest > 80 && diff > 0) setHidden(true);
    else if (diff < 0) setHidden(false);
    lastY.current = latest;
  });

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      animate={{
        y: !prefersReducedMotion && hidden && !menuOpen ? "-100%" : "0%",
        opacity: !prefersReducedMotion && hidden && !menuOpen ? 0 : 1,
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-space-navy/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg font-semibold tracking-wide text-iris-blue text-glow-blue-sm"
        >
          Iris
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="font-body text-sm text-text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CtaButton href={DISCORD_INSTALL_URL} target="_blank" rel="noreferrer noopener">
            Add to server
          </CtaButton>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-text md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
              <path
                d={menuOpen ? "M2 2L20 14M20 2L2 14" : "M0 1H22M0 8H22M0 15H22"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${
          menuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav
          className="flex flex-col gap-1 border-t border-white/10 bg-space-navy/95 px-5 pb-6 pt-4 backdrop-blur-md"
          aria-label="Mobile"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="py-3 text-left font-body text-base text-text-muted transition-colors duration-200 hover:text-text"
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
