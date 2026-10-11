import { DISCORD_INSTALL_URL } from "../lib/constants";
import { CtaButton } from "./CtaButton";

export function Footer() {
  return (
    <footer className="relative snap-end border-t border-white/10 px-6 py-16 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
        <span className="text-glow-blue-sm font-display text-lg font-semibold tracking-wide text-iris-blue">
          Iris
        </span>
        <p className="font-body text-sm text-text-muted">
          Your squadron's watch on the space domain.
        </p>
        <CtaButton href={DISCORD_INSTALL_URL} target="_blank" rel="noreferrer noopener">
          Add Iris to your server
        </CtaButton>
      </div>
    </footer>
  );
}
