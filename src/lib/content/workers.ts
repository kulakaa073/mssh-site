import { getCollection } from 'astro:content';
import { COLLECTIONS } from './collections';
import { buildCategoryGroupedMap, buildCategoryMap } from './indexes';
import type { ContentWarning, NormalizedWorker } from './types';

type WorkerEntryData = {
  Name?: string;
  name?: string;
  title?: string;
  slug?: string;
  category?: string;
  photo?: string;
  order?: number | string;
};

function normalizeWorker(
  entry: { id: string; data: WorkerEntryData },
  categoryMap: Record<string, unknown>
): NormalizedWorker {
  const warnings: ContentWarning[] = [];
  const name = entry.data.name ?? entry.data.Name;
  const categoryResolved = entry.data.category ? categoryMap[entry.data.category] : undefined;

  if (!name) {
    warnings.push({
      code: 'worker_missing_name',
      message: 'Worker entry is missing name/Name.',
      entryId: entry.id
    });
  }

  if (!entry.data.title) {
    warnings.push({
      code: 'worker_missing_title',
      message: 'Worker entry is missing title.',
      entryId: entry.id
    });
  }

  if (!entry.data.slug) {
    warnings.push({
      code: 'worker_missing_slug',
      message: 'Worker entry is missing slug.',
      entryId: entry.id
    });
  }

  if (!entry.data.category) {
    warnings.push({
      code: 'worker_missing_category',
      message: 'Worker entry is missing category.',
      entryId: entry.id
    });
  }
  if (entry.data.category && !categoryResolved) {
    warnings.push({
      code: 'worker_category_not_found',
      message: 'Worker category could not be resolved.',
      entryId: entry.id
    });
  }

  return {
    id: entry.id,
    name,
    slug: entry.data.slug,
    title: entry.data.title,
    category: entry.data.category,
    categoryResolved,
    photo: entry.data.photo,
    order: entry.data.order,
    raw: entry,
    warnings
  };
}

export async function getAllWorkers(): Promise<NormalizedWorker[]> {
  const entries = await getCollection(COLLECTIONS.workers);
  const categoryEntries = await getCollection(COLLECTIONS.workerCategories);
  const categoryMap = buildCategoryMap(
    categoryEntries.map((entry) => ({
      slug: (entry.data as { slug?: string }).slug,
      raw: entry
    }))
  );
  return entries.map((entry) => normalizeWorker(entry, categoryMap));
}

export async function getWorkersByCategory(categorySlug: string): Promise<NormalizedWorker[]> {
  const workers = await getAllWorkers();
  const grouped = buildCategoryGroupedMap(workers);
  return grouped[categorySlug] ?? [];
}

export async function getWorkerByCategoryAndSlug(
  categorySlug: string,
  slug: string
): Promise<NormalizedWorker | undefined> {
  const workers = await getWorkersByCategory(categorySlug);
  return workers.find((worker) => worker.slug === slug);
}
