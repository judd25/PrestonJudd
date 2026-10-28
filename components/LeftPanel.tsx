import Image from "next/image";
import { site } from "@/content/site";

export default function LeftPanel() {
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

      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center px-6 text-center">
        <h1 className="text-shadow-strong text-[2.7rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-[3.375rem] lg:text-[4.05rem]">
          {site.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </div>
    </header>
  );
}
