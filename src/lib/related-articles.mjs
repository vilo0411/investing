import categoryLinks from '../data/internal-links.json' with { type: 'json' };
import topicGroups from '../data/link-topics.json' with { type: 'json' };

const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().trim();
const stopWords = new Set('la gi cach cho cua va voi trong nhung nguoi moi dau tu co phieu chung khoan phan tich viet nam huong dan'.split(' '));
const tokens = (text) => new Set(normalize(text).split(/[^a-z0-9]+/).filter((word) => word.length > 1 && !stopWords.has(word)));
const overlap = (a, b) => [...a].filter((value) => b.has(value)).length;
const topics = new Map();
for (const [topic, slugs] of Object.entries(topicGroups)) {
  for (const slug of slugs) topics.set(slug, new Set([...(topics.get(slug) ?? []), topic]));
}

/** Stable tie break varies with the source, so equally relevant articles rotate. */
function tieBreak(source, target) {
  let hash = 2166136261;
  for (const char of `${source}:${target}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}

/**
 * Keep one foundation article, then recommend relevant next reads. All choices
 * come from the published collection; no random/time-dependent output or self links.
 * @template {{slug: string, body?: string, data: {category: string, title: string, tags?: string[], brokers?: {slug: string}[]}}} T
 * @param {T[]} articles
 * @param {string} currentSlug
 * @returns {T[]}
 */
export function selectRelatedArticles(articles, currentSlug) {
  const current = articles.find((article) => article.slug === currentSlug);
  if (!current) return [];
  const config = categoryLinks[current.data.category];
  const foundationSlug = currentSlug === config?.hub ? config?.action : config?.hub;
  const foundation = articles.find((article) => article.slug === foundationSlug && article.slug !== currentSlug);
  const sourceTags = new Set((current.data.tags ?? []).map(normalize));
  const sourceTokens = tokens(`${current.data.title} ${(current.data.tags ?? []).join(' ')}`);
  const sourceBrokers = new Set((current.data.brokers ?? []).map((broker) => broker.slug));
  const sourceTopics = topics.get(currentSlug) ?? new Set();
  const candidates = articles.filter((article) => article.slug !== currentSlug && article.slug !== foundation?.slug);
  const ranked = candidates.map((article) => {
    const sharedTopics = overlap(sourceTopics, topics.get(article.slug) ?? new Set());
    const sharedTags = overlap(sourceTags, new Set((article.data.tags ?? []).map(normalize)));
    const sharedTokens = overlap(sourceTokens, tokens(`${article.data.title} ${(article.data.tags ?? []).join(' ')}`));
    const sharedBrokers = overlap(sourceBrokers, new Set((article.data.brokers ?? []).map((broker) => broker.slug)));
    const sameCategory = article.data.category === current.data.category;
    const alreadyLinked = (current.body ?? '').includes(`/${article.slug}/`);
    // An unrelated low-inbound page must never outrank a relevant next read.
    const score = sharedBrokers * 30 + sharedTopics * 12 + sharedTags * 6 + sharedTokens * 2 + (sameCategory ? 4 : 0);
    return { article, score, alreadyLinked, sameCategory, sharedBrokers, sharedTopics, sharedTags, sharedTokens };
  }).filter((item) => item.sameCategory || item.sharedBrokers > 0 || (item.sharedTopics > 0 && item.sharedTokens > 0));
  ranked.sort((a, b) => b.score - a.score || Number(a.alreadyLinked) - Number(b.alreadyLinked)
    || tieBreak(currentSlug, a.article.slug) - tieBreak(currentSlug, b.article.slug) || a.article.slug.localeCompare(b.article.slug));
  return [...(foundation ? [foundation] : []), ...ranked.slice(0, foundation ? 2 : 3).map((item) => item.article)];
}
