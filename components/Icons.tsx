import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

type IconProps = SVGProps<SVGSVGElement>;

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function SoundCloudIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M11 8v10h8.5a3.5 3.5 0 0 0 .4-6.98A5 5 0 0 0 11 8z" />
      <path d="M2 14.5V18M5 11.5V18M8 9.5V18" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

/** Thin arrow; `direction` sets which way it points. */
export function ThinArrow({ direction, className }: { direction: "up" | "down"; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      aria-hidden
      focusable={false}
      className={className}
      style={direction === "up" ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M6 1v37M1.5 33.5 6 38l4.5-4.5" />
    </svg>
  );
}
