"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import LeftPanel from "./LeftPanel";
import SocialLinks from "./SocialLinks";
import { ThinArrow } from "./Icons";
import { BioSection, CompositionsSection, FutureSection, ListenSection } from "./SectionContent";
import { indexFromHash, sections } from "./sections";

const DESKTOP_QUERY = "(min-width: 768px)";
/** Minimum time between section switches; slightly longer than the 500ms transition. */
const SWITCH_LOCK_MS = 700;
/** A pause this long between wheel events ends one scroll "gesture". */
const GESTURE_IDLE_MS = 200;
const SWIPE_THRESHOLD_PX = 50;

function subscribeDesktop(cb: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Can `el` scroll further in direction `dir` (1 = down, -1 = up)? */
function canScroll(el: HTMLElement, dir: number) {
  return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 1;
}

function localDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function SiteShell() {
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);
  const [today, setToday] = useState<string | null>(null);
  const activeRef = useRef(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  activeRef.current = active;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return;
    const desktop = window.matchMedia(DESKTOP_QUERY).matches;
    setActive(index);
    history.replaceState(null, "", `#${sections[index].id}`);
    if (!desktop) {
      sectionRefs.current[index]?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, []);

  const linkTo = (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goTo(index);
  };

  // Initial hash, "today" for past/upcoming projects, and manual hash edits.
  useEffect(() => {
    const index = indexFromHash(window.location.hash);
    if (index >= 0) {
      setActive(index);
      if (!window.matchMedia(DESKTOP_QUERY).matches) sectionRefs.current[index]?.scrollIntoView();
    }
    setToday(localDateString());

    const onHashChange = () => {
      const i = indexFromHash(window.location.hash);
      if (i >= 0) goTo(i);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goTo]);

  // Desktop: wheel, touch swipe, and keyboard switch sections.
  useEffect(() => {
    if (!isDesktop) return;

    let gestureConsumed = false;
    let idleTimer: number | undefined;
    let lockUntil = 0;
    let touchStartY: number | null = null;
    let touchStartScrollable = false;

    const activeSection = () => sectionRefs.current[activeRef.current];

    const trySwitch = (dir: number) => {
      const now = performance.now();
      if (now < lockUntil) return;
      lockUntil = now + SWITCH_LOCK_MS;
      goTo(activeRef.current + dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || Math.abs(e.deltaY) < 2) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => (gestureConsumed = false), GESTURE_IDLE_MS);
      if (gestureConsumed) return;
      gestureConsumed = true;

      const dir = e.deltaY > 0 ? 1 : -1;
      const el = activeSection();
      // Let long sections scroll natively until they reach their edge.
      if (el && el.contains(e.target as Node) && canScroll(el, dir)) return;
      trySwitch(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      const el = activeSection();
      touchStartScrollable = !!el && el.contains(e.target as Node) && el.scrollHeight > el.clientHeight;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return;
      const dir = dy > 0 ? 1 : -1;
      const el = activeSection();
      if (touchStartScrollable && el && canScroll(el, dir)) return;
      trySwitch(dir);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;

      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      if (!dir) return;
      e.preventDefault();

      const el = activeSection();
      if (el && canScroll(el, dir)) {
        const step = e.key.startsWith("Page") ? el.clientHeight * 0.85 : 80;
        el.scrollBy({ top: dir * step, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        return;
      }
      if (!e.repeat) trySwitch(dir);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDesktop, goTo]);

  // Mobile: highlight the nav item for the section currently on screen.
  useEffect(() => {
    if (isDesktop) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(sectionRefs.current.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop]);

  const sectionBodies = [
    <BioSection key="bio" titleId="bio-title" />,
    <ListenSection key="listen" titleId="listen-title" />,
    <CompositionsSection key="compositions" titleId="compositions-title" />,
    <FutureSection key="future-projects" titleId="future-projects-title" today={today} />,
  ];

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="bg-[#111] md:flex md:h-dvh md:overflow-hidden">
      <a
        href="#main"
        className="sr-only z-50 bg-white px-4 py-2 text-sm text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Mobile sticky nav */}
      <nav aria-label="Sections" className="fixed inset-x-0 top-0 z-40 bg-black/55 backdrop-blur-md md:hidden">
        <ul className="flex items-center justify-between px-4 py-3">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={linkTo(i)}
                aria-current={active === i ? "true" : undefined}
                className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                  active === i ? "text-white underline underline-offset-4" : "text-white/65"
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <LeftPanel onLearnMore={linkTo(0)} />

      <main id="main" tabIndex={-1} className="relative min-w-0 overflow-hidden md:h-full md:w-1/2">
        <Image src="/images/concrete-texture.jpg" alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-black/45" />

        <a
          href="#bio"
          onClick={linkTo(0)}
          className="absolute right-10 top-8 z-20 hidden text-xs font-semibold uppercase tracking-[0.3em] underline decoration-1 underline-offset-[6px] md:block"
        >
          About
        </a>

        {/* Inset top and bottom so scrolling content clips before the ABOUT link and social icons */}
        <div className="relative md:absolute md:inset-x-0 md:bottom-20 md:top-20">
          {sections.map((s, i) => {
            const isActive = i === active;
            const state = isActive
              ? "md:visible md:translate-y-0 md:opacity-100"
              : `md:pointer-events-none md:invisible md:opacity-0 ${i < active ? "md:-translate-y-6" : "md:translate-y-6"}`;
            return (
              <section
                key={s.id}
                ref={(el) => {
                  sectionRefs.current[i] = el;
                }}
                aria-labelledby={`${s.id}-title`}
                inert={isDesktop && !isActive}
                className={`thin-scroll relative scroll-mt-12 md:absolute md:inset-0 md:overflow-y-auto md:overscroll-contain md:[mask-image:linear-gradient(to_bottom,transparent,black_2rem,black_calc(100%-2rem),transparent)] md:transition-[opacity,translate,visibility] md:duration-500 md:ease-out ${state}`}
              >
                <div className="flex min-h-full flex-col justify-center px-6 py-16 md:px-16 md:py-12 lg:px-24">
                  <div className="mx-auto w-full max-w-[640px]">{sectionBodies[i]}</div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Section indicator (desktop) */}
        <nav
          aria-label="Section navigation"
          className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex lg:right-8"
        >
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            aria-label="Previous section"
            className="p-1 text-white transition-opacity hover:opacity-70 disabled:opacity-25"
          >
            <ThinArrow direction="up" className="h-9 w-3" />
          </button>
          <div className="flex flex-col items-center gap-2 text-xs font-medium tabular-nums tracking-[0.15em]">
            <span>{pad(active + 1)}</span>
            <span aria-hidden className="h-px w-5 bg-white/70" />
            <span className="text-white/60">{pad(sections.length)}</span>
          </div>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            disabled={active === sections.length - 1}
            aria-label="Next section"
            className="p-1 text-white transition-opacity hover:opacity-70 disabled:opacity-25"
          >
            <ThinArrow direction="down" className="h-9 w-3" />
          </button>
        </nav>
        <p className="sr-only" aria-live="polite">
          {isDesktop ? `Section ${active + 1} of ${sections.length}: ${sections[active].title}` : ""}
        </p>

        <div className="relative z-20 flex justify-center pb-10 pt-4 md:absolute md:bottom-8 md:right-10 md:p-0">
          <SocialLinks />
        </div>
      </main>
    </div>
  );
}
