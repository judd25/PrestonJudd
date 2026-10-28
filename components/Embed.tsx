import type { Embed as EmbedConfig } from "@/content/site";

function youTubeId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return match ? match[1] : url;
}

function soundCloudSrc(url: string): string {
  const params = new URLSearchParams({
    url,
    color: "#1a1a1a",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params}`;
}

export default function Embed({ embed }: { embed: EmbedConfig }) {
  if (embed.type === "youtube") {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youTubeId(embed.url)}`}
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
      src={soundCloudSrc(embed.url)}
      title={embed.title}
      loading="lazy"
      allow="autoplay"
      height={embed.height ?? 166}
      className="block w-full border-0 bg-white"
    />
  );
}
