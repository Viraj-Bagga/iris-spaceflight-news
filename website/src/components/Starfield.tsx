import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type StarHue = "white" | "blue" | "gold";

type Star = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  hue: StarHue;
};

const STAR_RGB: Record<StarHue, string> = {
  white: "234, 240, 255",
  blue: "94, 168, 255",
  gold: "242, 193, 78",
};

function generateStars(
  count: number,
  opts: { minR: number; maxR: number; minO: number; maxO: number; tint: number },
): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let hue: StarHue = "white";
    if (roll < opts.tint) hue = "blue";
    else if (roll < opts.tint * 1.4) hue = "gold";
    stars.push({
      x: Math.random(),
      y: Math.random(),
      radius: opts.minR + Math.random() * (opts.maxR - opts.minR),
      opacity: opts.minO + Math.random() * (opts.maxO - opts.minO),
      hue,
    });
  }
  return stars;
}

function StarLayer({
  stars,
  glow,
  translateY,
  extraHeight,
}: {
  stars: Star[];
  glow: boolean;
  translateY: MotionValue<number> | number;
  extraHeight: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight + extraHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const cx = star.x * width;
        const cy = star.y * height;
        ctx.beginPath();
        if (glow) {
          const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, star.radius * 5);
          gradient.addColorStop(0, `rgba(${STAR_RGB[star.hue]}, ${star.opacity})`);
          gradient.addColorStop(0.4, `rgba(${STAR_RGB[star.hue]}, ${star.opacity * 0.35})`);
          gradient.addColorStop(1, `rgba(${STAR_RGB[star.hue]}, 0)`);
          ctx.fillStyle = gradient;
          ctx.arc(cx, cy, star.radius * 5, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(${STAR_RGB[star.hue]}, ${star.opacity})`;
          ctx.arc(cx, cy, star.radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [stars, glow, extraHeight]);

  return (
    <motion.div
      className="absolute left-0 top-0 w-full"
      style={{ height: `calc(100% + ${extraHeight}px)`, y: translateY }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </motion.div>
  );
}

export function Starfield() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const enableParallax = !prefersReducedMotion && !isMobile;

  const { scrollYProgress } = useScroll();

  const farY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const farStars = useMemo(
    () => generateStars(170, { minR: 0.5, maxR: 1.1, minO: 0.25, maxO: 0.55, tint: 0.05 }),
    [],
  );
  const midStars = useMemo(
    () => generateStars(75, { minR: 1, maxR: 1.8, minO: 0.35, maxO: 0.7, tint: 0.3 }),
    [],
  );
  const nearStars = useMemo(
    () => generateStars(26, { minR: 1.6, maxR: 2.6, minO: 0.55, maxO: 0.95, tint: 0.5 }),
    [],
  );

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-space-black" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(11,19,39,0.9), rgba(5,7,15,1) 65%)",
        }}
      />
      <StarLayer
        stars={farStars}
        glow={false}
        translateY={enableParallax ? farY : 0}
        extraHeight={enableParallax ? 90 : 0}
      />
      <StarLayer
        stars={midStars}
        glow={false}
        translateY={enableParallax ? midY : 0}
        extraHeight={enableParallax ? 190 : 0}
      />
      <StarLayer
        stars={nearStars}
        glow
        translateY={enableParallax ? nearY : 0}
        extraHeight={enableParallax ? 340 : 0}
      />
    </div>
  );
}
