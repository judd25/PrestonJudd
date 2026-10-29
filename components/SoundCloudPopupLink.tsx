"use client";

import { useEffect, useRef, useState } from "react";
import Embed from "./Embed";

/**
 * A text link that opens a SoundCloud player in a pop-up instead of leaving the site.
 * Ctrl/Cmd/Shift/middle-click still open SoundCloud in a new tab.
 */
export default function SoundCloudPopupLink({
  href,
  title,
  className,
  children,
}: {
  href: string;
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  // showModal() puts the dialog in the browser's top layer, above every panel and transform.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className} aria-haspopup="dialog">
        {children}
      </a>
      {open && (
        <dialog
          ref={dialogRef}
          aria-label={`${title} on SoundCloud`}
          // Unmounting on close removes the player, which stops playback.
          onClose={() => setOpen(false)}
          // A click on the dimmed backdrop lands on the dialog element itself.
          onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
          className="m-auto w-[calc(100%-2rem)] max-w-xl overflow-visible bg-transparent p-0 text-white backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        >
          <div className="rounded-2xl border border-white/15 bg-[#151515] p-5 shadow-2xl shadow-black/60">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em]">{title}</h3>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close player"
                className="-m-2 p-2 text-white/70 transition-colors hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden className="h-5 w-5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <Embed embed={{ type: "soundcloud", url: href, title: `${title} on SoundCloud`, height: 166 }} autoPlay />
          </div>
        </dialog>
      )}
    </>
  );
}
