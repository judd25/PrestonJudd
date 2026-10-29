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
      type: "spotify";
      /** The Spotify share link of a playlist, album, track, artist, or podcast, e.g. https://open.spotify.com/playlist/… */
      url: string;
      title: string;
      /** Player height in px. 352 shows a track list; 152 is the compact player. */
      height?: number;
    }
  | {
      type: "youtube";
      /** Any YouTube URL (watch?v=…, youtu.be/…, or embed/…) or just the video ID. */
      url: string;
      title: string;
    };

export type Link = { label: string; href: string };

/** A labeled row under the bio. `value` can be one line, or a list in [ ] for several lines. */
export type Highlight = { label: string; value: string | string[] };

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
  // Optional labeled rows shown under the bio. Leave empty to hide them. Example:
  // { label: "Education", value: ["M.M. in Orchestral Performance, Manhattan School of Music", "B.M. in Music Performance, Brigham Young University"] },
  highlights: [] as Highlight[],
};

/* ---------- 02 · Recordings ---------- */

export const listen = {
  navLabel: "Recordings",
  title: "Recordings",
  intro: "A selection of recent recordings, live sessions, and original music.",
  embeds: [
    {
      type: "spotify",
      url: "https://open.spotify.com/playlist/3joPhu3z43URQ4y15n7rWj",
      title: "Preston Judd recordings on Spotify",
      height: 352,
    },
    // Add more players here, for example:
    // { type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Live at Venue" },
    // { type: "soundcloud", url: "https://soundcloud.com/user/sets/playlist-name", title: "SoundCloud playlist" },
  ] satisfies Embed[],
};

/* ---------- 03 · Compositions ---------- */

export const compositions = {
  navLabel: "Compositions",
  title: "Compositions",
  intro: "Original works for small ensembles featuring electronic instruments",
  // A SoundCloud link opens a pop-up player; any other link opens in a new tab.
  works: [
    {
      title: "Dillon",
      year: 2021,
      instrumentation: "Bass Trombone, Piano, Synth, Drums",
      description:
        "During the pandemic I learned DnD and my first character was a Necromancer named Dillon. This composition depicted him.",
      link: { label: "Listen on SoundCloud", href: "https://soundcloud.com/prestonedwardjudd/dillon" },
    },
    {
      title: "The Moth",
      year: 2017,
      instrumentation: "Piano, Strings, Bass, Synthesizer",
      description:
        "I wrote this piece for a MOTH competition and I took it very literally not knowing that company featured space exploration, not metamorphosis.",
      link: { label: "Listen on SoundCloud", href: "https://soundcloud.com/prestonedwardjudd/the-moth" },
    },
    {
      title: "POW",
      year: 2016,
      instrumentation: "Voice, Synthesizer, Bass, Drums",
      description:
        "I have a lot of respect for those who have sacrificed so much for our freedom. This piece depicts the sacrifice and tenacity of American prisoners of war throughout the ages.",
      link: { label: "Listen on SoundCloud", href: "https://soundcloud.com/prestonedwardjudd/pow" },
    },
    {
      title: "Capture the Flag",
      year: 2016,
      instrumentation: "Cello, Bass, Synth, Piano, Electric Bass, Drums",
      description:
        "As a kid, I loved me a good game of capture the flag and this was the theme I always played in my head as I attempted to sneak my opponent's flag.",
      link: { label: "Listen on SoundCloud", href: "https://soundcloud.com/prestonedwardjudd/capture-the-flag" },
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
