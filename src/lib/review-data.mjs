import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => {
  const parsed = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(+parsed) && parsed.toISOString().slice(0, 10) === s;
}, 'Ngày không hợp lệ');
const webUrl = z.string().url().refine((s) => {
  try {
    const url = new URL(s);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}, 'Chỉ chấp nhận HTTPS không chứa thông tin đăng nhập');

export const metricLabels = {
  stocks: 'Phí cổ phiếu', margin: 'Lãi margin',
  derivatives: 'Phí phái sinh', advance: 'Ứng trước tiền bán',
};
export const metricKeys = /** @type {const} */ (['stocks', 'margin', 'derivatives', 'advance']);

const policySchema = z.object({
  id, broker: id, metric: z.enum(metricKeys), label: text,
  value: z.number().finite().nonnegative(), maxValue: z.number().finite().nonnegative().nullable(),
  qualifier: z.enum(['fixed', 'from', 'range']),
  unit: z.enum(['percent', 'percent-year', 'percent-day', 'vnd-contract']),
  exchangeFee: z.enum(['included', 'excluded', 'unknown', 'not-applicable']),
  conditions: text, sourceId: id, supportingSourceIds: z.array(id).optional(), checkedAt: date,
  validFrom: date.nullable(), validUntil: date.nullable(),
  status: z.enum(['draft', 'published']), primary: z.boolean(),
}).superRefine((p, ctx) => {
  if ((p.qualifier === 'range') !== (p.maxValue !== null) || (p.maxValue !== null && p.maxValue < p.value)) {
    ctx.addIssue({ code: 'custom', message: 'Khoảng giá trị không hợp lệ', path: ['maxValue'] });
  }
  const units = { stocks: ['percent'], margin: ['percent-year', 'percent-day'], derivatives: ['vnd-contract'], advance: ['percent-year', 'percent-day'] };
  if (!units[p.metric].includes(p.unit)) ctx.addIssue({ code: 'custom', message: 'Đơn vị không khớp loại phí', path: ['unit'] });
  if (p.validFrom && p.validUntil && p.validFrom > p.validUntil) ctx.addIssue({ code: 'custom', message: 'Ngày kết thúc trước ngày hiệu lực' });
});

export const reviewDataSchema = z.object({
  version: z.literal(1),
  brokers: z.array(id).min(1),
  sources: z.array(z.object({ id, title: text, url: webUrl, publisher: text })),
  policies: z.array(policySchema),
  offers: z.array(z.object({
    id, broker: id, metric: z.enum(metricKeys), title: text, benefit: text, conditions: text,
    sourceId: id, checkedAt: date, startsAt: date.nullable(), endsAt: date.nullable(),
    benefitDuration: text, status: z.enum(['draft', 'published', 'ended']),
    /** Short label shown inside the fee table cell, e.g. "0đ 90 ngày". */
    badge: text.optional(),
  })),
  links: z.array(z.object({ broker: id, url: webUrl, kind: z.enum(['official', 'partner']), disclosure: text })),
  history: z.array(z.object({ at: text, note: text, changes: z.array(text) })),
}).superRefine((data, ctx) => {
  const unique = (items, key, path) => {
    const seen = new Set();
    for (const item of items) {
      const value = key(item);
      if (seen.has(value)) ctx.addIssue({ code: 'custom', message: `Trùng ID: ${value}`, path: [path] });
      seen.add(value);
    }
  };
  unique(data.brokers, (b) => b, 'brokers');
  for (const key of ['sources', 'policies', 'offers']) unique(data[key], (item) => item.id, key);
  unique(data.links, (item) => item.broker, 'links');
  const sources = new Set(data.sources.map((s) => s.id));
  const brokers = new Set(data.brokers);
  for (const [key, entries] of [['policies', data.policies], ['offers', data.offers]]) {
    entries.forEach((entry, index) => {
      if (!sources.has(entry.sourceId)) ctx.addIssue({ code: 'custom', message: 'Nguồn không tồn tại', path: [key, index, 'sourceId'] });
      for (const sourceId of entry.supportingSourceIds ?? []) {
        if (!sources.has(sourceId)) ctx.addIssue({ code: 'custom', message: 'Nguồn đối chiếu không tồn tại', path: [key, index, 'supportingSourceIds'] });
      }
      if (!brokers.has(entry.broker)) ctx.addIssue({ code: 'custom', message: 'Công ty không tồn tại', path: [key, index, 'broker'] });
      if (entry.checkedAt > todayVN()) ctx.addIssue({ code: 'custom', message: 'Ngày kiểm tra nguồn không được ở tương lai', path: [key, index, 'checkedAt'] });
    });
  }
  data.offers.forEach((offer, index) => {
    if (offer.startsAt && offer.endsAt && offer.startsAt > offer.endsAt) ctx.addIssue({ code: 'custom', message: 'Hạn đăng ký trước ngày bắt đầu', path: ['offers', index, 'endsAt'] });
  });
  data.links.forEach((link, index) => {
    if (!brokers.has(link.broker)) ctx.addIssue({ code: 'custom', message: 'Công ty không tồn tại', path: ['links', index] });
  });
  // Prevent ambiguous baseline selection. Old policies must be retired or have
  // a non-overlapping validity window before a replacement can be published.
  const primary = data.policies.filter((p) => p.primary && p.status === 'published');
  primary.forEach((a, index) => {
    primary.slice(index + 1).forEach((b) => {
      if (a.broker === b.broker && a.metric === b.metric &&
          (a.validFrom ?? '') <= (b.validUntil ?? '9999-12-31') &&
          (b.validFrom ?? '') <= (a.validUntil ?? '9999-12-31')) {
        ctx.addIssue({ code: 'custom', message: `Hai mức chuẩn chồng thời hạn: ${a.id}, ${b.id}`, path: ['policies'] });
      }
    });
  });
});

export function todayVN(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function isPolicyActive(policy, today = todayVN()) {
  return policy.status === 'published' && (!policy.validFrom || policy.validFrom <= today) && (!policy.validUntil || policy.validUntil >= today);
}

export function isOfferActive(offer, today = todayVN()) {
  return offer.status === 'published' && (!offer.startsAt || offer.startsAt <= today) && (!offer.endsAt || offer.endsAt >= today);
}

export function isStale(checkedAt, today = todayVN()) {
  return (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${checkedAt}T00:00:00Z`)) / 86400000 > 30;
}

export function formatPolicy(policy) {
  if (!policy) return 'Chưa xác minh';
  // Daily rates are published with up to 8 decimals; 4 is enough to compare and stays readable.
  const number = (value) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: policy.unit === 'percent-day' ? 4 : 8 }).format(value);
  const suffix = { percent: '%', 'percent-year': '%/năm', 'percent-day': '%/ngày', 'vnd-contract': 'đ/HĐ' };
  return `${policy.qualifier === 'from' ? 'Từ ' : ''}${number(policy.value)}${policy.maxValue !== null ? `–${number(policy.maxValue)}` : ''}${suffix[policy.unit]}`;
}

/** Annual equivalent of a daily rate (365-day convention used in Vietnamese margin tables). */
export function annualizedRate(policy) {
  if (!policy || policy.unit !== 'percent-day') return null;
  const number = (value) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(value * 365);
  return `≈ ${number(policy.value)}${policy.maxValue !== null ? `–${number(policy.maxValue)}` : ''}%/năm`;
}
