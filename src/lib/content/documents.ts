import { getCollection } from 'astro:content';
import { COLLECTIONS } from './collections';
import { buildCategoryGroupedMap, buildCategoryMap } from './indexes';
import type { ContentWarning, NormalizedDocument } from './types';

type DocumentEntryData = {
  title?: string;
  slug?: string;
  date?: string | Date;
  category?: string;
  subcategory?: string;
  document?: string;
  thumbnail?: string;
  image?: string;
  isArchived?: boolean;
};

function normalizeDocument(
  entry: { id: string; data: DocumentEntryData },
  categoryMap: Record<string, unknown>,
  subcategoryMap: Record<string, unknown>
): NormalizedDocument {
  const warnings: ContentWarning[] = [];
  const categoryResolved = entry.data.category ? categoryMap[entry.data.category] : undefined;
  const subcategoryResolved = entry.data.subcategory
    ? subcategoryMap[entry.data.subcategory]
    : undefined;

  if (!entry.data.title) {
    warnings.push({
      code: 'document_missing_title',
      message: 'Document entry is missing title.',
      entryId: entry.id
    });
  }

  if (!entry.data.slug) {
    warnings.push({
      code: 'document_missing_slug',
      message: 'Document entry is missing slug.',
      entryId: entry.id
    });
  }

  if (!entry.data.category) {
    warnings.push({
      code: 'document_missing_category',
      message: 'Document entry is missing category.',
      entryId: entry.id
    });
  }

  if (!entry.data.document) {
    warnings.push({
      code: 'document_missing_file',
      message: 'Document entry is missing file path.',
      entryId: entry.id
    });
  }
  if (entry.data.category && !categoryResolved) {
    warnings.push({
      code: 'document_category_not_found',
      message: 'Document category could not be resolved.',
      entryId: entry.id
    });
  }
  if (entry.data.subcategory && !subcategoryResolved) {
    warnings.push({
      code: 'document_subcategory_not_found',
      message: 'Document subcategory could not be resolved.',
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
    subcategory: entry.data.subcategory,
    subcategoryResolved,
    document: entry.data.document,
    thumbnail: entry.data.thumbnail ?? entry.data.image,
    isArchived: entry.data.isArchived,
    raw: entry,
    warnings
  };
}

export async function getAllDocuments(): Promise<NormalizedDocument[]> {
  const entries = await getCollection(COLLECTIONS.documents);
  const categoryEntries = await getCollection(COLLECTIONS.documentCategories);
  const subcategoryEntries = await getCollection(COLLECTIONS.documentSubcategories);
  const categoryMap = buildCategoryMap(
    categoryEntries.map((entry) => ({
      slug: (entry.data as { slug?: string }).slug,
      raw: entry
    }))
  );
  const subcategoryMap = buildCategoryMap(
    subcategoryEntries.map((entry) => ({
      slug: (entry.data as { slug?: string }).slug,
      raw: entry
    }))
  );
  return entries.map((entry) => normalizeDocument(entry, categoryMap, subcategoryMap));
}

export async function getDocumentsByCategory(categorySlug: string): Promise<NormalizedDocument[]> {
  const documents = await getAllDocuments();
  const grouped = buildCategoryGroupedMap(documents);
  return grouped[categorySlug] ?? [];
}

export async function getDocumentByCategoryAndSlug(
  categorySlug: string,
  slug: string
): Promise<NormalizedDocument | undefined> {
  const documents = await getDocumentsByCategory(categorySlug);
  return documents.find((document) => document.slug === slug);
}
