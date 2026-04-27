export const COLLECTIONS = {
  events: 'educationalProcessEvents',
  eventCategories: 'educationalProcessEventCategories',
  documents: 'publicInfoDocuments',
  documentCategories: 'publicInfoDocumentCategories',
  documentSubcategories: 'publicInfoDocumentSubcategories',
  workers: 'aboutSchoolWorkers',
  workerCategories: 'aboutSchoolWorkerCategories',
  staticPages: 'staticPages',
  history: 'aboutSchoolHistory',
  settings: 'settings',
  scheduleMenu: 'scheduleMenu',
  scheduleWorkSchedule: 'scheduleWorkSchedule'
} as const;

export type CollectionAlias = keyof typeof COLLECTIONS;
export type CollectionName = (typeof COLLECTIONS)[CollectionAlias];
