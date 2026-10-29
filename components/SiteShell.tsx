"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import LeftPanel from "./LeftPanel";
import SocialLinks from "./SocialLinks";
import { ThinArrow } from "./Icons";
import { BioSection, CompositionsSection, FutureSection, ListenSection, SectionHeader } from "./SectionContent";
import { indexFromHash, sections } from "./sections";

const DESKTOP_QUERY = "(min-width: 768px)";
/** Minimum time between section switches; slightly longer than the transitions. */
const SWITCH_LOCK_MS = 750;
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

const isDesktopNow = () => window.matchMedia(DESKTOP_QUERY).matches;

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

/**
 * Desktop: portrait on the left, content panel on the right.
 * Mobile: two full screens stacked vertically, the portrait first and the content panel second.
 * On both, the content panel's background stays put and only the section content changes.
 */
export default function SiteShell() {
  const isDesktop = useIsDesktop();
  const [active, setActive] = useState(0);
  /** Mobile only: whether the portrait screen is showing instead of the content panel. */
  const [heroShown, setHeroShown] = useState(true);
  const [today, setToday] = useState<string | null>(null);
  const activeRef = useRef(0);
  const heroShownRef = useRef(true);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  /** The scrollable content area under each section's fixed header. */
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  activeRef.current = active;
  heroShownRef.current = heroShown;

  const showHero = useCallback(() => {
    setHeroShown(true);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }, []);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= sections.length) return;
    setActive(index);
    setHeroShown(false);
    history.replaceState(null, "", `#${sections[index].id}`);
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
      setHeroShown(false);
    }
    setToday(localDateString());

    const onHashChange = () => {
      const i = indexFromHash(window.location.hash);
      if (i >= 0) goTo(i);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [goTo]);

  // Wheel, touch swipe, and keyboard move between screens and sections.
  useEffect(() => {
    // Each wheel gesture either scrolls the section's content or switches sections, never both.
    let gestureMode: "scroll" | "switch" | null = null;
    let idleTimer: number | undefined;
    let lockUntil = 0;
    let touchStartY: number | null = null;
    let touchStartScrollable = false;

    const onContentScreen = () => isDesktopNow() || !heroShownRef.current;
    // While a pop-up (e.g. the SoundCloud player) is open, gestures and keys belong to it.
    const popupOpen = () => !!document.querySelector("dialog[open]");
    const activeSection = () => (onContentScreen() ? sectionRefs.current[activeRef.current] : null);
    const activeBody = () => (onContentScreen() ? bodyRefs.current[activeRef.current] : null);

    const trySwitch = (dir: number) => {
      const now = performance.now();
      if (now < lockUntil) return;
      lockUntil = now + SWITCH_LOCK_MS;

      if (!onContentScreen()) {
        // Mobile portrait screen: moving forward reveals the content panel.
        if (dir > 0) goTo(activeRef.current);
        return;
      }
      const next = activeRef.current + dir;
      if (next < 0 && !isDesktopNow()) showHero();
      else goTo(next);
    };

    const onWheel = (e: WheelEvent) => {
      if (popupOpen()) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || Math.abs(e.deltaY) < 2) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => (gestureMode = null), GESTURE_IDLE_MS);
      if (gestureMode === "switch") return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const target = e.target as Node;
      const body = activeBody();
      const inSection = !!activeSection()?.contains(target);
      // Long content scrolls until it reaches its edge; only a fresh gesture then switches.
      if (gestureMode === "scroll" || (inSection && body && canScroll(body, dir))) {
        gestureMode = "scroll";
        // Over the fixed header the browser won't scroll the content itself, so do it here.
        if (inSection && body && !body.contains(target)) {
          body.scrollBy({ top: e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY });
        }
        return;
      }
      gestureMode = "switch";
      trySwitch(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (popupOpen()) {
        touchStartY = null;
        return;
      }
      touchStartY = e.touches[0].clientY;
      const body = activeBody();
      touchStartScrollable =
        !!body && !!activeSection()?.contains(e.target as Node) && body.scrollHeight > body.clientHeight;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      touchStartY = null;
      if (Math.abs(dy) < SWIPE_THRESHOLD_PX) return;
      const dir = dy > 0 ? 1 : -1;
      const body = activeBody();
      if (touchStartScrollable && body && canScroll(body, dir)) return;
      trySwitch(dir);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (popupOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;

      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      if (!dir) return;
      e.preventDefault();

      const el = activeBody();
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
  }, [goTo, showHero]);

  const sectionBodies = [
    <BioSection key="bio" />,
    <ListenSection key="listen" />,
    <CompositionsSection key="compositions" />,
    <FutureSection key="future-projects" today={today} />,
  ];

  const pad = (n: number) => String(n).padStart(2, "0");
  /** Mobile only: the portrait screen is showing and the content panel is off-screen. */
  const mobileHeroShown = !isDesktop && heroShown;

  return (
    <div className="h-dvh overflow-hidden bg-[#111] md:flex">
      <a
        href="#main"
        onClick={linkTo(active)}
        className="sr-only z-50 bg-white px-4 py-2 text-sm text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Mobile: a two-screen track that slides up to reveal the content panel. Desktop: no box, children sit side by side. */}
      <div
        className={`transition-[translate] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:contents ${
          heroShown ? "translate-y-0" : "-translate-y-1/2"
        }`}
      >
        <LeftPanel inactive={!isDesktop && !heroShown} onNext={() => goTo(active)} />

        <main
          id="main"
          tabIndex={-1}
          inert={mobileHeroShown}
          className="relative h-dvh min-w-0 overflow-hidden md:h-full md:w-1/2"
        >
          <Image
            src="/images/concrete-texture.jpg"
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 200vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/60" />

          {/* Section nav; on wide screens it lines up with the content column below */}
          <nav aria-label="Sections" className="absolute inset-x-0 top-0 z-20 xl:px-24">
            <ul className="flex items-center justify-between gap-4 px-6 py-5 md:py-8 lg:px-10 xl:mx-auto xl:max-w-[640px] xl:px-0">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={linkTo(i)}
                    aria-current={active === i ? "true" : undefined}
                    className={`text-[11px] font-medium uppercase tracking-[0.2em] transition-colors md:tracking-[0.15em] lg:text-xs xl:tracking-[0.2em] ${
                      active === i ? "text-white underline underline-offset-4" : "text-white/65 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Inset top and bottom so scrolling content clips before the nav/ABOUT link and social icons */}
          <div className="absolute inset-x-0 bottom-16 top-14 md:bottom-20 md:top-20">
            {sections.map((s, i) => {
              const isActive = i === active;
              const state = isActive
                ? "visible translate-y-0 opacity-100"
                : `pointer-events-none invisible opacity-0 ${i < active ? "-translate-y-6" : "translate-y-6"}`;
              return (
                <section
                  key={s.id}
                  ref={(el) => {
                    sectionRefs.current[i] = el;
                  }}
                  aria-labelledby={`${s.id}-title`}
                  inert={!isActive}
                  className={`absolute inset-0 transition-[opacity,translate,visibility] duration-500 ease-out ${state}`}
                >
                  {/* Short sections stay vertically centered; tall ones fill the height and scroll below the header. */}
                  <div className="flex h-full flex-col justify-center px-6 py-4 md:px-16 md:py-6 lg:px-24">
                    <div className="mx-auto flex max-h-full w-full max-w-[640px] flex-col">
                      <SectionHeader number={i + 1} title={s.title} id={`${s.id}-title`} />
                      <div
                        ref={(el) => {
                          bodyRefs.current[i] = el;
                        }}
                        className="thin-scroll min-h-0 overflow-y-auto overscroll-contain pb-8 pt-8 [mask-image:linear-gradient(to_bottom,transparent,black_2rem,black_calc(100%-2rem),transparent)]"
                      >
                        {sectionBodies[i]}
                      </div>
                    </div>
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
            {mobileHeroShown ? "" : `Section ${active + 1} of ${sections.length}: ${sections[active].title}`}
          </p>

          <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center md:bottom-8 md:left-auto md:right-10">
            <SocialLinks />
          </div>
        </main>
      </div>
    </div>
  );
}
