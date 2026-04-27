import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const markdownSection = z.object({
  type: z.literal('markdown'),
  content: z.string().optional()
});

const imageSection = z.object({
  type: z.literal('image'),
  image: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional()
});

const gallerySection = z.object({
  type: z.literal('gallery'),
  images: z.array(z.any()).optional(),
  caption: z.string().optional()
});

const videoSection = z.object({
  type: z.literal('video'),
  url: z.string().optional(),
  caption: z.string().optional()
});

const embedSection = z.object({
  type: z.literal('embed'),
  url: z.string().optional(),
  title: z.string().optional(),
  height: z.union([z.number(), z.string()]).optional(),
  allowFullscreen: z.boolean().optional()
});

const quoteSection = z.object({
  type: z.literal('quote'),
  text: z.string().optional(),
  author: z.string().optional(),
  source: z.string().optional()
});

const sectionSchema = z.discriminatedUnion('type', [
  markdownSection,
  imageSection,
  gallerySection,
  videoSection,
  embedSection,
  quoteSection
]);

const collections = {
  settings: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/settings' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      schoolName: z.string().optional(),
      address: z.string().optional(),
      phoneMain: z.string().optional(),
      phoneAdditional: z.array(z.string()).optional(),
      email: z.string().optional(),
      workingHours: z.string().optional(),
      map: z.string().optional(),
      socialLinks: z.array(
        z.object({
          label: z.string().optional(),
          url: z.string().optional()
        })
      ).optional()
    })
  }),

  staticPages: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/static-pages' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      section: z.string().optional()
    })
  }),

  educationalProcessEvents: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/educational-process/events' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      date: z.union([z.string(), z.date()]).optional(),
      category: z.string().optional(),
      sections: z.array(sectionSchema).optional(),
      thumbnail: z.string().optional(),
      image: z.string().optional(),
      isArchived: z.boolean().optional()
    })
  }),

  educationalProcessEventCategories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/educational-process/event-categories' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      order: z.union([z.number(), z.string()]).optional(),
      description: z.string().optional()
    })
  }),

  publicInfoDocumentCategories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/public-info/document-categories' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      order: z.union([z.number(), z.string()]).optional(),
      description: z.string().optional()
    })
  }),

  publicInfoDocumentSubcategories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/public-info/document-subcategories' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      parentCategory: z.string().optional(),
      order: z.union([z.number(), z.string()]).optional(),
      description: z.string().optional()
    })
  }),

  publicInfoDocuments: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/public-info/documents' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      date: z.union([z.string(), z.date()]).optional(),
      document: z.string().optional(),
      thumbnail: z.string().optional(),
      image: z.string().optional(),
      description: z.string().optional(),
      isArchived: z.boolean().optional()
    })
  }),

  aboutSchoolWorkers: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/about-school/workers' }),
    schema: z.object({
      Name: z.string().optional(),
      name: z.string().optional(),
      title: z.string().optional(),
      slug: z.string().optional(),
      education: z.string().optional(),
      description: z.string().optional(),
      photo: z.string().optional(),
      category: z.string().optional(),
      order: z.union([z.number(), z.string()]).optional()
    })
  }),

  aboutSchoolWorkerCategories: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/about-school/worker-categories' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      order: z.union([z.number(), z.string()]).optional(),
      description: z.string().optional()
    })
  }),

  aboutSchoolHistory: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/about-school/history' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional()
    })
  }),

  scheduleMenu: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/schedule/menu' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      dateRange: z.string().optional(),
      description: z.string().optional()
    })
  }),

  scheduleWorkSchedule: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/schedule/work-schedule' }),
    schema: z.object({
      title: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional()
    })
  })
};

export { collections };
