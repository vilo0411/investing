import { defineCollection, z } from "astro:content";

const brokerSchema = z.object({
  name: z.string(),
  slug: z.string(),
  rating: z.number().min(0).max(5),
  best_for: z.string(),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  verdict: z.string().optional(),
  fee_rate: z.string().optional(),
  margin_rate: z.string().optional(),
  app_rating: z.string().optional(),
  min_deposit: z.string().optional(),
  logo: z.string().optional(),
  ctaUrl: z.string().optional(),
});

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    readingTime: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    tags: z.array(z.string()).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    sources: z.array(z.string()).default([]),
    citations: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      publisher: z.string().optional(),
      date: z.string().optional(),
    })).default([]),
    keyTakeaways: z.array(z.string()).default([]),
    // Optional, no default — resolves to undefined when not set. Type is Date | undefined; Phase 3 consumers must handle the undefined case explicitly.
    factCheckedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    // Review-specific fields
    layoutType: z.enum(["article", "review"]).default("article"),
    brokers: z.array(brokerSchema).optional(),
    reviewSummary: z.string().optional(),
    reviewType: z.enum(["company", "comparison", "listicle"]).optional(),
    companyInfo: z.object({
      founded: z.string().optional(),
      hq: z.string().optional(),
      license: z.string().optional(),
      website: z.string().optional(),
      products: z.array(z.string()).default([]),
    }).optional(),
    accountSteps: z.array(z.object({
      title: z.string(),
      desc: z.string(),
    })).default([]),
    comparisonCriteria: z.array(z.object({
      label: z.string(),
      key: z.string(),
    })).default([]),
    winnerByCriteria: z.record(z.string(), z.string()).default({}),
    bestForScenarios: z.array(z.object({
      scenario: z.string(),
      winnerSlug: z.string(),
      reason: z.string(),
    })).default([]),
    rankings: z.array(z.object({
      slug: z.string(),
      rank: z.number(),
      badge: z.string(),
    })).default([]),
  }),
});

export const collections = { articles };
