import { getCollection } from 'astro:content';
import { COLLECTIONS } from './collections';

type SettingsEntryData = {
  slug?: string;
  schoolName?: string;
};

export async function getContacts() {
  const entries = await getCollection(COLLECTIONS.settings);
  const match =
    entries.find((entry) => entry.id === 'contacts' || entry.data.slug === 'contacts') ??
    entries.find((entry) => 'schoolName' in entry.data) ??
    entries[0];

  return match;
}

export async function getSiteSettings() {
  const entries = await getCollection(COLLECTIONS.settings);
  const match =
    entries.find((entry) => entry.id === 'site' || entry.data.slug === 'site') ??
    entries.find((entry) => {
      const data = entry.data as SettingsEntryData;
      return !data.schoolName;
    }) ??
    entries[0];

  return match;
}
