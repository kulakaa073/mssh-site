import { getCollection } from 'astro:content';
import { COLLECTIONS } from './collections';
import { buildCategoryGroupedMap, buildCategoryMap } from './indexes';
import type { ContentWarning, NormalizedEvent } from './types';

type EventEntryData = {
  title?: string;
  slug?: string;
  date?: string | Date;
  category?: string;
  thumbnail?: string;
  image?: string;
  isArchived?: boolean;
};

function normalizeEvent(
  entry: { id: string; data: EventEntryData },
  categoryMap: Record<string, unknown>
): NormalizedEvent {
  const warnings: ContentWarning[] = [];
  const categoryResolved = entry.data.category ? categoryMap[entry.data.category] : undefined;

  if (!entry.data.title) {
    warnings.push({
      code: 'event_missing_title',
      message: 'Event entry is missing title.',
      entryId: entry.id
    });
  }

  if (!entry.data.slug) {
    warnings.push({
      code: 'event_missing_slug',
      message: 'Event entry is missing slug.',
      entryId: entry.id
    });
  }

  if (!entry.data.category) {
    warnings.push({
      code: 'event_missing_category',
      message: 'Event entry is missing category.',
      entryId: entry.id
    });
  }
  if (entry.data.category && !categoryResolved) {
    warnings.push({
      code: 'event_category_not_found',
      message: 'Event category could not be resolved.',
      entryId: entry.id
    });
  }

  return {
    id: entry.id,
    title: entry.data.title,
    slug: entry.data.slug,
    date: entry.data.date,
    category: entry.data.category,
    categoryResolved,
    thumbnail: entry.data.thumbnail ?? entry.data.image,
    isArchived: entry.data.isArchived,
    raw: entry,
    warnings
  };
}

export async function getAllEvents(): Promise<NormalizedEvent[]> {
  const entries = await getCollection(COLLECTIONS.events);
  const categoryEntries = await getCollection(COLLECTIONS.eventCategories);
  const categoryMap = buildCategoryMap(
    categoryEntries.map((entry) => ({
      slug: (entry.data as { slug?: string }).slug,
      raw: entry
    }))
  );
  return entries.map((entry) => normalizeEvent(entry, categoryMap));
}

export async function getEventsByCategory(categorySlug: string): Promise<NormalizedEvent[]> {
  const events = await getAllEvents();
  const grouped = buildCategoryGroupedMap(events);
  return grouped[categorySlug] ?? [];
}

export async function getEventByCategoryAndSlug(
  categorySlug: string,
  slug: string
): Promise<NormalizedEvent | undefined> {
  const events = await getEventsByCategory(categorySlug);
  return events.find((event) => event.slug === slug);
}
