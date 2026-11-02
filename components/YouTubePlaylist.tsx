"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/content/site";
import { youTubeVideoId } from "./Embed";

/** The parts of YouTube's IFrame Player API (https://developers.google.com/youtube/iframe_api_reference) used here. */
type YouTubePlayer = {
  loadVideoById: (id: string) => void;
  getVideoData: () => { video_id?: string };
};
type YouTubeApi = {
  Player: new (
    iframe: HTMLIFrameElement,
    options: { events: { onReady?: () => void; onStateChange?: (e: { data: number }) => void } },
  ) => YouTubePlayer;
  PlayerState: { ENDED: number };
};

let playerApi: Promise<YouTubeApi | null> | null = null;

/** Loads YouTube's player script once; resolves to null if it can't load (the list then reloads the player instead). */
function loadPlayerApi(): Promise<YouTubeApi | null> {
  playerApi ??= new Promise((resolve) => {
    const w = window as unknown as { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void };
    if (w.YT?.Player) return resolve(w.YT);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT ?? null);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      playerApi = null;
      resolve(null);
    };
    document.head.appendChild(script);
  });
  return playerApi;
}

const playerSrc = (id: string, autoPlay: boolean) =>
  `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0${autoPlay ? "&autoplay=1" : ""}`;

/**
 * A YouTube player with a track list under it. Clicking a track plays it; when one ends the
 * next in the list starts, and the highlighted track follows whatever is playing.
 */
export default function YouTubePlaylist({ title, tracks }: { title: string; tracks: Track[] }) {
  const ids = tracks.map((t) => youTubeVideoId(t.url) ?? t.url);
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [current, setCurrent] = useState(0);
  const [src, setSrc] = useState(() => playerSrc(ids[0], false));

  useEffect(() => {
    let cancelled = false;
    loadPlayerApi().then((YT) => {
      if (cancelled || !YT || !iframeRef.current) return;
      const player = new YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            if (!cancelled) playerRef.current = player;
          },
          onStateChange: (e) => {
            const index = idsRef.current.indexOf(player.getVideoData().video_id ?? "");
            if (index < 0) return;
            setCurrent(index);
            if (e.data === YT.PlayerState.ENDED && index + 1 < idsRef.current.length) {
              player.loadVideoById(idsRef.current[index + 1]);
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, []);

  const play = (index: number) => {
    setCurrent(index);
    if (playerRef.current) playerRef.current.loadVideoById(ids[index]);
    else setSrc(playerSrc(ids[index], true));
  };

  return (
    <>
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/40">
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <ol aria-label="Tracks" className="mt-2 divide-y divide-white/10 px-3">
        {tracks.map((track, i) => {
          const active = i === current;
          return (
            <li key={ids[i]}>
              <button
                type="button"
                onClick={() => play(i)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-baseline gap-4 py-3 text-left transition-colors ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="w-5 shrink-0 text-xs tabular-nums text-white/50">
                  {active ? (
                    <svg viewBox="0 0 10 12" aria-hidden className="inline h-2.5 w-2.5 fill-white">
                      <path d="M0 0l10 6-10 6z" />
                    </svg>
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{track.title}</span>
                  {track.detail && <span className="mt-0.5 block text-xs text-white/55">{track.detail}</span>}
                </span>
                {track.duration && <span className="shrink-0 text-xs tabular-nums text-white/50">{track.duration}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}
