import rawCatalog from './reviews/catalog.json';
import verificationGaps from './reviews/verification-gaps.json';
import { reviewDataSchema, isPolicyActive, isOfferActive, todayVN } from '../lib/review-data.mjs';
import type { z } from 'astro/zod';

export type ReviewCatalog = z.infer<typeof reviewDataSchema>;
export type BrokerPolicy = ReviewCatalog['policies'][number];
export type BrokerOffer = ReviewCatalog['offers'][number];
export type Metric = BrokerPolicy['metric'];

// Parse at build time so invalid edits fail the build, before any page is published.
export const reviewCatalog = reviewDataSchema.parse(rawCatalog);
export const reviewDate = todayVN();
export const sourceById = Object.fromEntries(reviewCatalog.sources.map((source) => [source.id, source]));

export function getVerificationGap(broker: string, metric: Metric) {
  return verificationGaps.find((gap) => gap.broker === broker && gap.metric === metric);
}

export function getPolicy(broker: string, metric: Metric, today = reviewDate): BrokerPolicy | undefined {
  return reviewCatalog.policies.find((policy) => policy.broker === broker && policy.metric === metric && policy.primary && isPolicyActive(policy, today));
}

export function getPolicies(broker: string, today = reviewDate) {
  return reviewCatalog.policies.filter((policy) => policy.broker === broker && isPolicyActive(policy, today));
}

export function getOffers(broker?: string, today = reviewDate) {
  return reviewCatalog.offers.filter((offer) => (!broker || offer.broker === broker) && isOfferActive(offer, today));
}

export function getOutboundLink(broker: string) {
  return reviewCatalog.links.find((link) => link.broker === broker);
}
