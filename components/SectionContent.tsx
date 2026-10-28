import { bio, compositions, futureProjects, listen } from "@/content/site";
import type { Composition, FutureProject } from "@/content/site";
import Embed from "./Embed";

/** Number, title, and rule. Rendered outside the scroll area so it stays put on desktop. */
export function SectionHeader({ number, title, id }: { number: number; title: string; id: string }) {
  return (
    <header>
      <p className="mb-3 text-xs font-medium tracking-[0.3em] text-white/60">
        {String(number).padStart(2, "0")}
      </p>
      <h2 id={id} className="text-2xl font-semibold uppercase tracking-[0.3em] md:text-3xl">
        {title}
      </h2>
      <span aria-hidden className="mt-5 block h-px w-12 bg-white/70" />
    </header>
  );
}

function Intro({ text }: { text?: string }) {
  return text ? <p className="mb-10 text-sm leading-relaxed text-white/70">{text}</p> : null;
}

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
    >
      {children}
      <span aria-hidden>→</span>
    </a>
  );
}

export function BioSection() {
  return (
    <>
      <div className="space-y-5 text-[15px] leading-relaxed text-white/85">
        {bio.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {bio.highlights.length > 0 && (
        <dl className="mt-10 divide-y divide-white/15 border-y border-white/15">
          {bio.highlights.map((h) => (
            <div key={h.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-xs font-medium uppercase tracking-[0.2em] text-white/60">{h.label}</dt>
              <dd className="space-y-1 text-sm text-white/90">
                {(Array.isArray(h.value) ? h.value : [h.value]).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </>
  );
}

export function ListenSection() {
  return (
    <>
      <Intro text={listen.intro} />
      <div className="space-y-6">
        {listen.embeds.map((embed, i) => (
          <div key={i} className="overflow-hidden border border-white/15 bg-black/30 p-2 shadow-2xl shadow-black/40">
            <Embed embed={embed} />
          </div>
        ))}
      </div>
    </>
  );
}

export function CompositionsSection() {
  return (
    <>
      <Intro text={compositions.intro} />
      <ul className="space-y-5">
        {(compositions.works as Composition[]).map((work) => (
          <li key={work.title} className="border border-white/15 bg-black/20 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-base font-semibold uppercase tracking-[0.15em]">{work.title}</h3>
              <span className="text-xs tracking-[0.2em] text-white/60">{work.year}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/60">{work.instrumentation}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/85">{work.description}</p>
            {work.embed && (
              <div className="mt-5">
                <Embed embed={work.embed} />
              </div>
            )}
            {work.link && (
              <p className="mt-5">
                <TextLink href={work.link.href}>{work.link.label}</TextLink>
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** `today` is "YYYY-MM-DD", or null before the browser has mounted (everything is treated as upcoming). */
export function FutureSection({ today }: { today: string | null }) {
  const isPast = (p: FutureProject) => today !== null && p.date < today;
  const sorted = [...(futureProjects.projects as FutureProject[])].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((p) => !isPast(p));
  const past = futureProjects.pastProjects === "completed" ? sorted.filter(isPast).reverse() : [];
  const items = [...upcoming, ...past];

  return (
    <>
      <Intro text={futureProjects.intro} />
      {upcoming.length === 0 && <p className="mb-6 text-sm text-white/70">{futureProjects.emptyMessage}</p>}
      <ul className="divide-y divide-white/15 border-y border-white/15">
        {items.map((p) => {
          const done = isPast(p);
          return (
            <li key={p.title + p.date} className={`grid gap-2 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6 ${done ? "opacity-55" : ""}`}>
              <div>
                <time dateTime={p.date} className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                  {dateFormat.format(new Date(`${p.date}T00:00:00Z`))}
                </time>
                {done && (
                  <span className="mt-2 inline-block border border-white/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em]">
                    Completed
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold uppercase tracking-[0.15em]">{p.title}</h3>
                {p.location && <p className="mt-1 text-xs uppercase tracking-[0.15em] text-white/60">{p.location}</p>}
                <p className="mt-3 text-sm leading-relaxed text-white/85">{p.description}</p>
                {p.link && !done && (
                  <p className="mt-4">
                    <TextLink href={p.link.href}>{p.link.label}</TextLink>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
