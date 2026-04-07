"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let t = 0;
    const isDark = true;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.0003 + 0.0001, flicker: Math.random() * Math.PI * 2,
    }));

    const exhaust: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];

    const draw = () => {
      t += 0.016;
      const w = canvas.width, h = canvas.height;

      ctx.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx.fillRect(0, 0, w, h);

      // Stars (dark mode only)
      if (isDark) {
        stars.forEach((s) => {
          s.flicker += s.speed * 60;
          const alpha = 0.1 + 0.5 * Math.abs(Math.sin(s.flicker));
          ctx.beginPath();
          ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(125, 180, 224, ${alpha * 0.6})`;
          ctx.fill();
        });
      }

      // Rocket position
      const rx = w * 0.5 + Math.sin(t * 0.4) * 3;
      const lift = Math.min(t * 6, h * 0.1);
      const ry = h * 0.6 - lift + Math.sin(t * 1.5) * 2;

      // Engine glow with accent color
      const glow = ctx.createRadialGradient(rx, ry + 35, 0, rx, ry + 35, 120);
      glow.addColorStop(0, isDark ? "rgba(125,180,224,0.1)" : "rgba(74,143,194,0.06)");
      glow.addColorStop(0.5, isDark ? "rgba(196,154,108,0.04)" : "rgba(160,122,76,0.02)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // Exhaust particles
      for (let i = 0; i < 2; i++) {
        exhaust.push({ x: rx + (Math.random() - 0.5) * 8, y: ry + 30 + Math.random() * 6,
          vx: (Math.random() - 0.5) * 1.5, vy: Math.random() * 3 + 1.5,
          life: 0, maxLife: 30 + Math.random() * 20, size: Math.random() * 3 + 1 });
      }

      for (let i = exhaust.length - 1; i >= 0; i--) {
        const p = exhaust[i];
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life > p.maxLife) { exhaust.splice(i, 1); continue; }
        const prog = p.life / p.maxLife;
        const alpha = (1 - prog) * (isDark ? 0.5 : 0.3);
        const r = p.size * (1 + prog * 1.5);
        if (isDark) {
          const blue = Math.floor(180 + prog * 75);
          ctx.fillStyle = `rgba(125, ${blue}, 224, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(74, 143, 194, ${alpha})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Flame
      const fh = 35 + Math.sin(t * 12) * 10;
      const fg = ctx.createLinearGradient(rx, ry + 16, rx, ry + 16 + fh);
      fg.addColorStop(0, isDark ? "rgba(196,154,108,0.8)" : "rgba(160,122,76,0.5)");
      fg.addColorStop(0.4, isDark ? "rgba(125,180,224,0.4)" : "rgba(74,143,194,0.3)");
      fg.addColorStop(1, "transparent");
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(rx - 6, ry + 16); ctx.quadraticCurveTo(rx, ry + 16 + fh, rx + 6, ry + 16);
      ctx.closePath(); ctx.fillStyle = fg; ctx.fill();
      ctx.restore();

      // Rocket body
      ctx.save();
      const bodyColor = isDark ? "#e0e0e0" : "#333333";
      const darkSide = isDark ? "#888" : "#666";
      const bg2 = ctx.createLinearGradient(rx - 8, 0, rx + 8, 0);
      bg2.addColorStop(0, darkSide);
      bg2.addColorStop(0.4, bodyColor);
      bg2.addColorStop(0.6, bodyColor);
      bg2.addColorStop(1, darkSide);
      ctx.fillStyle = bg2;
      ctx.beginPath();
      ctx.moveTo(rx, ry - 35);
      ctx.quadraticCurveTo(rx + 10, ry - 16, rx + 8, ry + 16);
      ctx.lineTo(rx - 8, ry + 16);
      ctx.quadraticCurveTo(rx - 10, ry - 16, rx, ry - 35);
      ctx.fill();

      // Nose with accent
      const noseGrad = ctx.createLinearGradient(rx - 5, ry - 35, rx + 5, ry - 19);
      noseGrad.addColorStop(0, isDark ? "rgba(125,180,224,0.9)" : "rgba(74,143,194,0.7)");
      noseGrad.addColorStop(1, isDark ? "rgba(196,154,108,0.6)" : "rgba(160,122,76,0.4)");
      ctx.fillStyle = noseGrad;
      ctx.beginPath(); ctx.moveTo(rx, ry - 35);
      ctx.quadraticCurveTo(rx + 5, ry - 26, rx + 4, ry - 19);
      ctx.lineTo(rx - 4, ry - 19);
      ctx.quadraticCurveTo(rx - 5, ry - 26, rx, ry - 35); ctx.fill();

      // Window
      ctx.beginPath(); ctx.arc(rx, ry - 8, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(125,180,224,0.5)" : "rgba(74,143,194,0.4)"; ctx.fill();

      // Fins
      ctx.fillStyle = isDark ? "rgba(125,180,224,0.7)" : "rgba(74,143,194,0.5)";
      ctx.beginPath(); ctx.moveTo(rx - 8, ry + 11); ctx.lineTo(rx - 14, ry + 20); ctx.lineTo(rx - 8, ry + 16); ctx.fill();
      ctx.beginPath(); ctx.moveTo(rx + 8, ry + 11); ctx.lineTo(rx + 14, ry + 20); ctx.lineTo(rx + 8, ry + 16); ctx.fill();
      ctx.restore();

      if (exhaust.length > 150) exhaust.splice(0, 30);
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
