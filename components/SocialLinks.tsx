import { socialLinks } from "@/content/site";
import { FacebookIcon, InstagramIcon, SoundCloudIcon, YouTubeIcon } from "./Icons";

const networks = [
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundCloudIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
] as const;

export default function SocialLinks({ className = "" }: { className?: string }) {
  const links: Partial<Record<string, string>> = socialLinks;
  return (
    <ul className={`flex items-center gap-5 ${className}`}>
      {networks.map(({ key, label, Icon }) => {
        const href = links[key];
        if (!href) return null;
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Preston Judd on ${label}`}
              className="block text-white/85 transition-colors hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
