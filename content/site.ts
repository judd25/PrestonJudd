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
      /** Any YouTube video or playlist URL (watch?v=…, youtu.be/…, playlist?list=…) or just the video ID. */
      url: string;
      title: string;
      /** Optional track list shown under the player; clicking a track plays it. The player starts on the first one. */
      tracks?: Track[];
    };

/** One video in a track list. `url` is the video's YouTube link (watch?v=… or youtu.be/…). */
export type Track = { title: string; detail?: string; url: string; duration?: string };

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
  /**
   * "YYYY-MM-DD" for an exact day (shows "Dec 12, 2026"), "YYYY-MM" for a month (shows "Dec 2026"),
   * or any other text such as "TBD", shown as written. Dated projects sort first; others follow in list order.
   */
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
  headline: ["Utah-based", "Trombonist"],
  portraitAlt: "Portrait of Preston Judd", // [REPLACE] with a more specific description of the photo
};

/**
 * Social links shown as icons. Lines starting with // are hidden: to show one, remove the //
 * and replace its placeholder URL.
 */
export const socialLinks = {
  // youtube: "https://www.youtube.com/@REPLACE",
  // facebook: "https://www.facebook.com/REPLACE",
  soundcloud: "https://soundcloud.com/prestonedwardjudd",
  // instagram: "https://www.instagram.com/REPLACE",
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
  intro: "", // Optional line shown above the players; leave empty to hide it.
  embeds: [
    {
      type: "youtube",
      url: "https://youtube.com/playlist?list=PLGnyDDQC7yVA",
      title: "Preston Judd recordings on YouTube",
      // The list shown under the player, in this order. When you add a video to the YouTube
      // playlist, add a line here too.
      tracks: [
        { title: "Cilicians Attack", detail: "Joseph LoDuca · Spartacus: House of Ashur", url: "https://youtu.be/7ovr1mHGCvk", duration: "6:03" },
        { title: "Hail, Caesar", detail: "Joseph LoDuca · Spartacus: House of Ashur", url: "https://youtu.be/deHuuxdL0pM", duration: "5:15" },
        { title: "Flight of the Cinema Therapists", detail: "Caleb Blood · Cinema Therapy", url: "https://youtu.be/qgcU1r6m3lk", duration: "2:13" },
        { title: "Fiery Foes – Official Trailer", detail: "Minecraft Legends", url: "https://youtu.be/DsKj-1_fl60", duration: "1:36" },
        { title: "El Chocante (feat. Ray Vega)", detail: "Victor Rendon & Bronx Conexion Latin Jazz Big Band · Mambo Boulevard", url: "https://youtu.be/Fl_sXchv1aQ", duration: "6:39" },
        { title: "Chale", detail: "Victor Rendon & Bronx Conexion Latin Jazz Big Band · Mambo Boulevard", url: "https://youtu.be/oVUYcQbiAZs", duration: "5:38" },
        { title: "Mami Me Gusto (feat. Jorge Maldonado, Marco Bermudez & Hector Davila)", detail: "Victor Rendon & Bronx Conexion Latin Jazz Big Band · Mambo Boulevard", url: "https://youtu.be/8aqlK-kx4Ls", duration: "6:30" },
        { title: "Year of the Rabbit Theme & Skin Music", detail: "Honor of Kings", url: "https://youtu.be/atdq2EFsNCk", duration: "18:49" },
        { title: "Jiang Ziya Theme", detail: "Honor of Kings", url: "https://youtu.be/lZsyqro0yQQ", duration: "6:24" },
        { title: "Zhao Huaizhen Theme", detail: "Honor of Kings", url: "https://youtu.be/h_I-vOrReT8", duration: "6:26" },
        { title: "2023 Chinese New Year Intro Music", detail: "Honor of Kings", url: "https://youtu.be/XE3mIq-uvfc", duration: "2:56" },
      ],
    },
    // Add more players here, for example:
    // { type: "spotify", url: "https://open.spotify.com/playlist/3joPhu3z43URQ4y15n7rWj", title: "Preston Judd recordings on Spotify", height: 352 },
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
      link: { label: "Listen", href: "https://soundcloud.com/prestonedwardjudd/dillon" },
    },
    {
      title: "The Moth",
      year: 2017,
      instrumentation: "Piano, Strings, Bass, Synthesizer",
      description:
        "I wrote this piece for a MOTH competition and I took it very literally not knowing that company featured space exploration, not metamorphosis.",
      link: { label: "Listen", href: "https://soundcloud.com/prestonedwardjudd/the-moth" },
    },
    {
      title: "POW",
      year: 2016,
      instrumentation: "Voice, Synthesizer, Bass, Drums",
      description:
        "I have a lot of respect for those who have sacrificed so much for our freedom. This piece depicts the sacrifice and tenacity of American prisoners of war throughout the ages.",
      link: { label: "Listen", href: "https://soundcloud.com/prestonedwardjudd/pow" },
    },
    {
      title: "Capture the Flag",
      year: 2016,
      instrumentation: "Cello, Bass, Synth, Piano, Electric Bass, Drums",
      description:
        "As a kid, I loved me a good game of capture the flag and this was the theme I always played in my head as I attempted to sneak my opponent's flag.",
      link: { label: "Listen", href: "https://soundcloud.com/prestonedwardjudd/capture-the-flag" },
    },
  ] satisfies Composition[],
};

/* ---------- 04 · Future Projects ---------- */

export const futureProjects = {
  navLabel: "Upcoming",
  title: "Upcoming Projects",
  intro: "Upcoming concerts, recordings, and collaborations.",
  /** What to do with entries whose date has passed: "completed" shows them with a Completed tag, "hide" removes them. */
  pastProjects: "completed" as "completed" | "hide",
  emptyMessage: "New dates coming soon.",
  projects: [
    {
      title: "I Wonder as I Wander - Single",
      date: "2026-12",
      location: "Virtual Release",
      description: "Festive arrangement of a Christmas classic for Horn, Bass Trombone, Synth",
    },
    {
      title: "Batter My Heart - Single",
      date: "TBD",
      location: "Virtual Release",
      description:
        "An arrangement from John Adams's 'Doctor Atomic' by my amazing wife for Bass Trombone, Woodwind Quintet, and Piano",
    },
    {
      title: "Sweeney Todd: The Demon Posaune of Fleet Street",
      date: "TBD",
      location: "Venue - TBD",
      description: "An adaptation of the hit broadway musical for brass band",
    },
  ] satisfies FutureProject[],
};
