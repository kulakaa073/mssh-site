export type ContentWarning = {
  code: string;
  message: string;
  entryId?: string;
};

export type NormalizedEvent = {
  id: string;
  title?: string;
  slug?: string;
  date?: string | Date;
  category?: string;
  categoryResolved?: unknown;
  thumbnail?: string;
  isArchived?: boolean;
  raw: unknown;
  warnings: ContentWarning[];
};

export type NormalizedDocument = {
  id: string;
  title?: string;
  slug?: string;
  date?: string | Date;
  category?: string;
  categoryResolved?: unknown;
  subcategory?: string;
  subcategoryResolved?: unknown;
  document?: string;
  thumbnail?: string;
  isArchived?: boolean;
  raw: unknown;
  warnings: ContentWarning[];
};

export type NormalizedWorker = {
  id: string;
  name?: string;
  slug?: string;
  title?: string;
  category?: string;
  categoryResolved?: unknown;
  photo?: string;
  order?: number | string;
  raw: unknown;
  warnings: ContentWarning[];
};
