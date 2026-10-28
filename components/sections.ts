import { bio, compositions, futureProjects, listen } from "@/content/site";

/** Section order, URL hashes, nav labels, and full titles. */
export const sections = [
  { id: "bio", label: bio.navLabel, title: bio.title },
  { id: "listen", label: listen.navLabel, title: listen.title },
  { id: "compositions", label: compositions.navLabel, title: compositions.title },
  { id: "future-projects", label: futureProjects.navLabel, title: futureProjects.title },
] as const;

export function indexFromHash(hash: string): number {
  const id = hash.replace(/^#/, "");
  return sections.findIndex((s) => s.id === id);
}
