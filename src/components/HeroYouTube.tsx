"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => unknown };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  mute: () => void;
  playVideo: () => void;
  seekTo: (s: number, allow: boolean) => void;
  getCurrentTime: () => number;
  destroy: () => void;
};

let apiPromise: Promise<void> | null = null;
export function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) { resolve(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

export default function HeroYouTube({ videoId }: { videoId: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.mute();
            e.target.playVideo();
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === 0) {
              e.target.seekTo(0, true);
              e.target.playVideo();
            }
            if (e.data === 1) {
              const player = e.target;
              const tick = () => {
                if (cancelled) return;
                if (player.getCurrentTime() > 0.15) {
                  setReady(true);
                } else {
                  requestAnimationFrame(tick);
                }
              };
              requestAnimationFrame(tick);
            }
          },
        },
      }) as unknown as YTPlayer;
    });
    return () => {
      cancelled = true;
      try { playerRef.current?.destroy(); } catch {}
    };
  }, [videoId]);

  return (
    <div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{
        width: "100vw",
        height: "56.25vw",
        minHeight: "100vh",
        minWidth: "177.78vh",
        transform: "translate(-50%, -50%)",
        opacity: ready ? 1 : 0,
        transition: "opacity 0.4s ease-out",
      }}
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
