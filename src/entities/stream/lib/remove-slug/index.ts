export function removeSlugFromList(list: string[] | null, slug: string): string[] | null {
  if (!list) return list;
  return list.filter((s) => s !== slug);
}
