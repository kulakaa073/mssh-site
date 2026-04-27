type MaybeSlug = { slug?: string };
type MaybeCategory = { category?: string };

export function buildSlugMap<T extends MaybeSlug>(items: T[]): Record<string, T> {
  const map: Record<string, T> = {};
  for (const item of items) {
    if (!item.slug) continue;
    map[item.slug] = item;
  }
  return map;
}

export function buildCategoryMap<T extends MaybeSlug>(items: T[]): Record<string, T> {
  return buildSlugMap(items);
}

export function buildCategoryGroupedMap<T extends MaybeCategory>(items: T[]): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (const item of items) {
    if (!item.category) continue;
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  return grouped;
}
