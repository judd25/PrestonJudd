import { bio, compositions, futureProjects, listen } from "@/content/site";

/** Section order, URL hashes, nav labels, and full titles. */
export const sections = [
  { id: "bio", label: bio.navLabel, title: bio.title },
  { id: "listen", label: listen.navLabel, title: listen.title },
  { id: "compositions", label: compositions.navLabel, title: compositions.title },
  { id: "upcoming-projects", label: futureProjects.navLabel, title: futureProjects.title },
] as const;

/** Old hashes that still open their section, so links shared before a rename keep working. */
const hashAliases: Record<string, string> = { "future-projects": "upcoming-projects" };

export function indexFromHash(hash: string): number {
  const raw = hash.replace(/^#/, "");
  const id = hashAliases[raw] ?? raw;
  return sections.findIndex((s) => s.id === id);
}
