// Local regression checks for the schema types this website emits. This is not
// a replacement for Google's Rich Results Test or the full Schema.org vocabulary.
const list = (value) => value == null ? [] : Array.isArray(value) ? value : [value];
const types = (node) => list(node?.['@type']);
const isType = (node, type) => types(node).includes(type);
const pageTypes = ['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'ProfilePage', 'FAQPage'];
const creativeTypes = [...pageTypes, 'CreativeWork', 'Article', 'Review', 'Question', 'Answer', 'ImageObject'];

export function validateStructuredData(html) {
  const documents = [];
  const violations = [];
  let passed = 0;
  const check = (condition, message) => {
    if (condition) passed++;
    else violations.push(message);
  };
  const scripts = html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    try { documents.push(JSON.parse(match[1])); }
    catch (error) { violations.push(`[Schema Parse Error] ${error.message}`); }
  }

  const nodes = [];
  const definitions = new Map();
  const references = [];
  function walk(value) {
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (!value || typeof value !== 'object') return;
    if (value['@type']) nodes.push(value);
    if (value['@id']) {
      if (Object.keys(value).length === 1) references.push(value['@id']);
      else definitions.set(value['@id'], { ...definitions.get(value['@id']), ...value });
    }
    Object.values(value).forEach(walk);
  }
  documents.forEach(walk);
  const resolve = (value) => value?.['@id'] ? { ...definitions.get(value['@id']), ...value } : value;
  for (const reference of references) {
    // Other documents may legitimately define external entities. Local fragment
    // references must resolve in this page's graph, as required by our builders.
    if (reference.includes('#')) check(definitions.has(reference), `[Schema Unresolved Reference] ${reference}`);
  }
  if (documents.length) check(nodes.length > 0, '[Schema Empty] JSON-LD contains no typed entities');

  for (const node of nodes) {
    const label = node['@id'] ?? types(node).join(', ');
    if ('reviewedBy' in node) {
      check(types(node).some((type) => pageTypes.includes(type)), `[Schema reviewedBy Invalid Domain] ${label}`);
      check(Boolean(node.lastReviewed), `[Schema Reviewer Missing Date] ${label}`);
      for (const reviewer of list(node.reviewedBy).map(resolve)) {
        check((isType(reviewer, 'Person') || isType(reviewer, 'Organization')) && Boolean(reviewer.name), `[Schema Reviewer Invalid] ${label}`);
      }
    }
    for (const part of list(node.hasPart).map(resolve)) {
      check(types(part).some((type) => creativeTypes.includes(type)), `[Schema hasPart Invalid Type] ${label}`);
    }
    if (isType(node, 'Article')) {
      for (const field of ['headline', 'author', 'publisher', 'datePublished', 'dateModified', 'image']) {
        check(Boolean(node[field]), `[Schema Article Missing Field] ${field} in ${label}`);
      }
      for (const author of list(node.author).map(resolve)) {
        check((isType(author, 'Person') || isType(author, 'Organization')) && Boolean(author.name), `[Schema Article Author Invalid] ${label}`);
      }
      const publisher = resolve(node.publisher);
      check(isType(publisher, 'Organization') && Boolean(publisher.name), `[Schema Article Publisher Invalid] ${label}`);
    }
    if (isType(node, 'Person') || isType(node, 'Organization') || isType(node, 'WebSite')) {
      check(Boolean(node.name), `[Schema Missing name] ${label}`);
    }
    if (isType(node, 'ProfilePage')) {
      const entity = resolve(node.mainEntity);
      check((isType(entity, 'Person') || isType(entity, 'Organization')) && Boolean(entity.name), `[Schema Profile Main Entity Invalid] ${label}`);
    }
    if (isType(node, 'BreadcrumbList')) {
      const entries = node.itemListElement;
      check(Array.isArray(entries) && entries.length > 0, `[Schema BreadcrumbList Empty] ${label}`);
      if (Array.isArray(entries)) entries.forEach((entry, index) => {
        const crumb = resolve(entry);
        check(crumb?.position === index + 1 && Boolean(crumb.name) && (index === entries.length - 1 || Boolean(crumb.item)), `[Schema BreadcrumbList Element Invalid] ${index + 1} in ${label}`);
      });
    }
    if (isType(node, 'FAQPage')) {
      check(list(node.mainEntity).length > 0, `[Schema FAQ Empty] ${label}`);
      for (const question of list(node.mainEntity).map(resolve)) {
        const answer = resolve(question?.acceptedAnswer);
        check(isType(question, 'Question') && Boolean(question.name) && isType(answer, 'Answer') && Boolean(answer.text), `[Schema FAQ Question Invalid] ${label}`);
      }
    }
    if (isType(node, 'Review')) {
      const rating = resolve(node.reviewRating);
      const value = rating?.ratingValue;
      check(Boolean(resolve(node.itemReviewed)?.name), `[Schema Review Item Missing] ${label}`);
      check(typeof value === 'number' && Number.isFinite(value) && value >= (rating.worstRating ?? 1) && value <= (rating.bestRating ?? 5), `[Schema Review Rating Invalid] ${label}`);
    }
    for (const field of ['datePublished', 'dateModified', 'lastReviewed']) {
      if (node[field]) check(Number.isFinite(Date.parse(node[field])), `[Schema Invalid Date] ${field} in ${label}`);
    }
    if (node.datePublished && node.dateModified) {
      check(Date.parse(node.dateModified) >= Date.parse(node.datePublished), `[Schema Date Order Invalid] ${label}`);
    }
  }
  return { passed, failed: violations.length, violations, documents: documents.length, nodes: nodes.length };
}
