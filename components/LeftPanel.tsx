import Image from "next/image";
import { site } from "@/content/site";
import { ThinArrow } from "./Icons";

/**
 * `inactive` is true on mobile while the content screen is showing, so the hidden hero can't take focus.
 * `onNext` reveals the content screen (mobile down arrow).
 */
export default function LeftPanel({ inactive = false, onNext }: { inactive?: boolean; onNext: () => void }) {
  return (
    <header inert={inactive} className="relative h-dvh w-full shrink-0 overflow-hidden md:h-full md:w-1/2">
      <Image
        src="/images/preston-portrait.jpg"
        alt={site.portraitAlt}
        fill
        priority
        quality={90}
        // A full-height "cover" image renders wider than the viewport, so request
        // a larger file than the panel width to keep the photo sharp.
        sizes="(min-width: 768px) 75vw, 150vw"
        className="object-cover object-[50%_20%]"
      />

      {/* Readability gradients */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <p className="text-shadow-soft absolute left-6 top-8 text-sm font-semibold uppercase tracking-[0.35em] md:left-10 md:top-9">
        {site.name}
      </p>

      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center px-6 text-center md:bottom-8">
        <h1 className="text-shadow-strong text-[2.7rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[3.375rem] lg:text-[4.05rem]">
          {site.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        {/* Mobile only: hints that there's more below; tapping it does the same as swiping up. */}
        <button
          type="button"
          onClick={onNext}
          aria-label="Show bio and more"
          className="mt-5 p-2 text-white/90 md:hidden"
        >
          <ThinArrow direction="down" className="h-10 w-4 motion-safe:animate-bounce" />
        </button>
      </div>
    </header>
  );
}
