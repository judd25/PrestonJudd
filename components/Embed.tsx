import type { Embed as EmbedConfig } from "@/content/site";

/** Embed URL for a YouTube video, a playlist (…?list=…), or a video within a playlist. */
function youTubeSrc(url: string): string {
  const video = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
  const list = url.match(/[?&]list=([\w-]+)/)?.[1];
  const base = "https://www.youtube-nocookie.com/embed/";
  if (list) return `${base}${video ?? "videoseries"}?list=${list}`;
  return base + (video ?? url);
}

function soundCloudSrc(url: string, autoPlay: boolean): string {
  const params = new URLSearchParams({
    url,
    color: "#1a1a1a",
    auto_play: String(autoPlay),
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params}`;
}

/** Turns an open.spotify.com share link (tracking params and all) into its embed URL. */
function spotifySrc(url: string): string {
  const match = url.match(/open\.spotify\.com\/(?:intl-[\w-]+\/)?(playlist|album|track|artist|episode|show)\/(\w+)/);
  const path = match ? `${match[1]}/${match[2]}` : url;
  return `https://open.spotify.com/embed/${path}?utm_source=generator&theme=0`;
}

/** `autoPlay` starts SoundCloud playback on load (used by the pop-up player). */
export default function Embed({ embed, autoPlay = false }: { embed: EmbedConfig; autoPlay?: boolean }) {
  if (embed.type === "spotify") {
    return (
      <iframe
        src={spotifySrc(embed.url)}
        title={embed.title}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        height={embed.height ?? 352}
        className="block w-full rounded-xl border-0"
      />
    );
  }

  if (embed.type === "youtube") {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/40">
        <iframe
          src={youTubeSrc(embed.url)}
          title={embed.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <iframe
      src={soundCloudSrc(embed.url, autoPlay)}
      title={embed.title}
      // An autoplaying player is on screen right away, so don't defer it.
      loading={autoPlay ? "eager" : "lazy"}
      allow="autoplay"
      height={embed.height ?? 166}
      className="block w-full border-0 bg-white"
    />
  );
}
