import { Fragment } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  RefreshCw,
  Rss,
  Send,
  ShieldCheck,
  Target,
} from "lucide-react";
import { DISCORD_INSTALL_URL, SECTION_IDS } from "../lib/constants";
import { ParallaxSection, Reveal, SectionHeading } from "./ParallaxSection";
import irisAvatar from "../assets/iris-avatar.webp";
import { CtaButton } from "./CtaButton";

const STEPS = [
  {
    number: "01",
    icon: Rss,
    title: "Watches the feed.",
    body: "Iris continuously pulls new articles from spaceflight and defense news sources.",
  },
  {
    number: "02",
    icon: Filter,
    title: "Keeps what matters.",
    body: "Every article gets checked for relevance to i5 cadets: military space, aerospace, leadership, national security. The rest is dropped.",
  },
  {
    number: "03",
    icon: Send,
    title: "Posts to your channel.",
    body: "Approved stories go to the Discord channel you pick, each with a short summary.",
  },
];

function StepConnector() {
  return (
    <div className="hidden items-center justify-center md:flex" aria-hidden="true">
      <ChevronRight className="h-5 w-5 text-iris-blue/30" />
    </div>
  );
}

export function HowItWorks() {
  return (
    <ParallaxSection id={SECTION_IDS.howItWorks}>
      {(active) => (
        <div className="flex flex-col items-center">
          <SectionHeading active={active}>
            <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
              How it works
            </h2>
          </SectionHeading>
          <div className="mt-8 grid w-full gap-10 text-left md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-6">
            {STEPS.map((step, index) => (
              <Fragment key={step.number}>
                <Reveal active={active} from="left" delay={0.15 + index * 0.15}>
                  <step.icon className="h-5 w-5 text-iris-blue" aria-hidden="true" />
                  <span className="mt-3 block font-display text-sm font-semibold tracking-[0.2em] text-iris-blue">
                    {step.number}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-text-muted sm:text-base">
                    {step.body}
                  </p>
                </Reveal>
                {index < STEPS.length - 1 && <StepConnector />}
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </ParallaxSection>
  );
}

const BENEFITS = [
  {
    icon: RefreshCw,
    title: "Stays current on its own.",
    body: "Your cadets keep up with the space domain without anyone assigning it or checking feeds.",
  },
  {
    icon: Target,
    title: "Only what's relevant.",
    body: "Iris posts the few articles that matter to i5 cadets, not everything that gets published.",
  },
  {
    icon: ShieldCheck,
    title: "Made for i5.",
    body: "The filter is set to what i5 squadrons care about, not general space news.",
  },
];

export function WhyIris() {
  return (
    <ParallaxSection id={SECTION_IDS.whyIris}>
      {(active) => (
        <div className="flex flex-col items-center">
          <SectionHeading active={active}>
            <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">
              Why Iris
            </h2>
          </SectionHeading>
          <div className="mt-8 grid w-full gap-10 text-left md:grid-cols-3 md:gap-8">
            {BENEFITS.map((benefit, index) => (
              <Reveal
                key={benefit.title}
                active={active}
                from="scale"
                delay={0.15 + index * 0.12}
              >
                <benefit.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                <h3 className="mt-3 font-display text-lg font-semibold text-text">
                  {benefit.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-text-muted sm:text-base">
                  {benefit.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </ParallaxSection>
  );
}

function DiscordPreview() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-space-navy/60 p-4 text-left shadow-[0_0_40px_rgba(94,168,255,0.08)]">
      <div className="flex items-center gap-2">
        <img
          src={irisAvatar}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-full ring-1 ring-iris-blue/30"
        />
        <span className="font-display text-sm font-semibold text-text">Iris</span>
        <span className="rounded bg-iris-blue/20 px-1.5 py-0.5 font-body text-[10px] font-medium uppercase tracking-wide text-iris-blue-bright">
          Bot
        </span>
        <span className="font-body text-[11px] text-text-muted">Today at 9:41 AM</span>
      </div>
      <p className="mt-2 font-body text-sm leading-relaxed text-text">
        Starship Flight 9 completes static fire ahead of next launch window.
      </p>
      <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 font-body text-[11px] font-medium text-gold-bright">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
        Aerospace &middot; Launch Ops
      </span>
    </div>
  );
}

export function Setup() {
  return (
    <ParallaxSection id={SECTION_IDS.setup}>
      {(active) => (
        <div className="flex flex-col items-center text-center">
          <SectionHeading active={active}>
            <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">Setup</h2>
          </SectionHeading>
          <Reveal active={active} from="scale" delay={0.15} className="mt-5 flex flex-col items-center">
            <p className="max-w-xl font-body text-base leading-relaxed text-text-muted sm:text-lg">
              Add Iris, run{" "}
              <code className="rounded-md bg-space-navy px-2 py-1 font-display text-sm text-iris-blue-bright">
                /setup
              </code>
              , and pick a channel. Under a minute, and it runs on its own from there.
            </p>
            <div className="mt-6">
              <CtaButton href={DISCORD_INSTALL_URL} target="_blank" rel="noreferrer noopener">
                Add Iris to your server
              </CtaButton>
            </div>
          </Reveal>
          <Reveal active={active} from="scale" delay={0.35} className="mt-8 flex w-full justify-center">
            <DiscordPreview />
          </Reveal>
        </div>
      )}
    </ParallaxSection>
  );
}

export function About() {
  return (
    <ParallaxSection id={SECTION_IDS.about}>
      {(active) => (
        <div className="relative flex flex-col items-center text-center">
          {/* Future: swap this glow for the Iris character illustration, using it as a backdrop. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-iris-blue/10 blur-3xl"
          />
          <SectionHeading active={active}>
            <h2 className="font-display text-3xl font-semibold text-text sm:text-4xl">About</h2>
          </SectionHeading>
          <Reveal active={active} from="up" delay={0.15} duration={0.8} className="mt-5">
            <p className="mx-auto max-w-xl font-body text-base leading-relaxed text-text-muted sm:text-lg">
              Iris was built by an i5 cadet to keep detachments current on the space domain.
            </p>
          </Reveal>
        </div>
      )}
    </ParallaxSection>
  );
}
