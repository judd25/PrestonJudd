/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT: edit this file to update the website.
 *  Anything marked [REPLACE] is placeholder text you should swap
 *  for your real content. Layout code lives in /components and
 *  never needs to change for content updates.
 * ─────────────────────────────────────────────────────────────
 */

/* ---------- Types (you don't need to edit these) ---------- */

export type Embed =
  | {
      type: "soundcloud";
      /** The normal SoundCloud page URL of a track or playlist, e.g. https://soundcloud.com/user/sets/playlist-name */
      url: string;
      title: string;
      /** Player height in px. Playlists look best at 300–450, single tracks at 166. */
      height?: number;
    }
  | {
      type: "youtube";
      /** Any YouTube URL (watch?v=…, youtu.be/…, or embed/…) or just the video ID. */
      url: string;
      title: string;
    };

export type Link = { label: string; href: string };

export type Composition = {
  title: string;
  year: number | string;
  instrumentation: string;
  description: string;
  embed?: Embed;
  link?: Link;
};

export type FutureProject = {
  title: string;
  /** ISO format: "YYYY-MM-DD" */
  date: string;
  location?: string;
  description: string;
  link?: Link;
};

/* ---------- General ---------- */

export const site = {
  name: "Preston Judd",
  title: "Preston Judd | Utah Trombonist",
  description:
    "Preston Judd is a New York City–based trombonist and composer performing jazz, contemporary, and orchestral music.", // [REPLACE] if you'd like different wording
  headline: ["Utah Based", "Trombonist"],
  portraitAlt: "Portrait of Preston Judd", // [REPLACE] with a more specific description of the photo
};

/** Social links: replace the placeholder URLs. Remove a line to hide that icon. */
export const socialLinks = {
  youtube: "https://www.youtube.com/@REPLACE",
  facebook: "https://www.facebook.com/REPLACE",
  soundcloud: "https://soundcloud.com/REPLACE",
  instagram: "https://www.instagram.com/REPLACE",
} satisfies Partial<Record<"youtube" | "facebook" | "soundcloud" | "instagram", string>>;

/* ---------- 01 · Bio ---------- */

export const bio = {
  navLabel: "Bio",
  title: "Bio",
  paragraphs: [
    "I'm a freelance bass trombonist based in New York City and Utah. I've performed with premier ensembles including the Utah Symphony & Opera and Boston Brass, and shared the stage with artists such as the Beach Boys, Celtic Woman, Leslie Odom Jr., Storm Large, Joshua Henry, Byron Stripling, Christopher Bill, and Wycliffe Gordon.",
    "My playing can also be heard on screen and in games, including the soundtrack of the STARZ hit series Spartacus: House of Ashur and the video games Minecraft Legends, Honor of Kings, and League of Legends.",
  ],
  highlights: [
    // A value can be one line of text, or a list in [ ] for several lines.
    {
      label: "Education",
      value: [
        "M.M. in Orchestral Performance, Manhattan School of Music",
        "B.M. in Music Performance, Brigham Young University",
      ],
    },
  ],
};

/* ---------- 02 · Listen to Me ---------- */

export const listen = {
  navLabel: "Listen",
  title: "Listen to Me",
  intro: "[REPLACE] A selection of recent recordings, live sessions, and original music.",
  embeds: [
    {
      type: "soundcloud",
      // [REPLACE] with your SoundCloud playlist URL
      url: "https://soundcloud.com/soundcloud-scenes/sets/jazz-classics",
      title: "Preston Judd on SoundCloud",
      height: 360,
    },
    // Add more players here, for example:
    // { type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Live at Venue" },
  ] satisfies Embed[],
};

/* ---------- 03 · My Compositions ---------- */

export const compositions = {
  navLabel: "Compositions",
  title: "My Compositions",
  intro: "[REPLACE] Original works for small ensembles, brass, and mixed chamber groups.",
  works: [
    {
      title: "[REPLACE] Hudson Light",
      year: 2025,
      instrumentation: "Trombone, tenor sax, piano, bass, drums",
      description:
        "[REPLACE] A slow-burning ballad inspired by early evenings on the Hudson River, built around a long-lined trombone melody.",
      link: { label: "Listen on SoundCloud", href: "https://soundcloud.com/REPLACE" },
    },
    {
      title: "[REPLACE] Concrete Etudes",
      year: 2024,
      instrumentation: "Solo trombone",
      description:
        "[REPLACE] A set of three short studies exploring multiphonics, extended slide technique, and the resonance of empty rooms.",
    },
    {
      title: "[REPLACE] Subway Chorale",
      year: 2023,
      instrumentation: "Brass quintet",
      description:
        "[REPLACE] A chorale for brass quintet that layers fragments of overheard city rhythms into a slowly unfolding harmony.",
      // Optional embed example:
      // embed: { type: "youtube", url: "https://youtu.be/VIDEO_ID", title: "Subway Chorale performance" },
    },
  ] satisfies Composition[],
};

/* ---------- 04 · Future Projects ---------- */

export const futureProjects = {
  navLabel: "Future",
  title: "Future Projects",
  intro: "[REPLACE] Upcoming concerts, recordings, and collaborations.",
  /** What to do with entries whose date has passed: "completed" shows them with a Completed tag, "hide" removes them. */
  pastProjects: "completed" as "completed" | "hide",
  emptyMessage: "New dates coming soon.",
  projects: [
    {
      title: "[REPLACE] Quintet Album Release Show",
      date: "2026-12-12",
      location: "[REPLACE] Venue Name, Brooklyn NY",
      description: "[REPLACE] Celebrating the release of the debut quintet record with a full live performance.",
      link: { label: "Tickets", href: "https://example.com/REPLACE" },
    },
    {
      title: "[REPLACE] Debut Album Recording Session",
      date: "2027-02-08",
      location: "[REPLACE] Studio Name, New York NY",
      description: "[REPLACE] Tracking a new album of original compositions with the quintet.",
    },
    {
      title: "[REPLACE] New Work for Trombone Choir",
      date: "2027-05-20",
      description: "[REPLACE] Premiere of a newly commissioned piece for twelve trombones.",
    },
    {
      title: "[REPLACE] Summer Jazz Series",
      date: "2026-07-18",
      location: "[REPLACE] Park Name, Manhattan NY",
      description: "[REPLACE] Outdoor set with the big band as part of the summer concert series.",
    },
  ] satisfies FutureProject[],
};
