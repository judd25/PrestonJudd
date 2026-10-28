import Image from "next/image";
import { site } from "@/content/site";
import { ThinArrow } from "./Icons";

export default function LeftPanel({ onLearnMore }: { onLearnMore: (e: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <header className="relative h-[70vh] min-h-[460px] w-full overflow-hidden md:h-full md:min-h-0 md:w-1/2 md:shrink-0">
      <Image
        src="/images/preston-portrait.jpg"
        alt={site.portraitAlt}
        fill
        priority
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover object-[50%_20%]"
      />

      {/* Readability gradients */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <p className="text-shadow-soft absolute left-6 top-16 text-sm font-semibold uppercase tracking-[0.35em] md:left-10 md:top-9">
        {site.name}
      </p>

      <div className="absolute inset-x-0 bottom-[12%] flex flex-col items-center px-6 text-center">
        <h1 className="text-shadow-strong text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          {site.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <a
          href="#bio"
          onClick={onLearnMore}
          className="mt-8 rounded-full bg-white px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:bg-white/85"
        >
          {site.learnMoreLabel}
        </a>
      </div>

      <div aria-hidden className="absolute bottom-8 left-8 hidden flex-col items-center gap-3 md:flex">
        <span className="text-shadow-soft rotate-180 text-[10px] uppercase tracking-[0.3em] text-white/85 [writing-mode:vertical-rl]">
          Scroll down to switch
        </span>
        <ThinArrow direction="down" className="h-10 w-3 text-white/85" />
      </div>
    </header>
  );
}
