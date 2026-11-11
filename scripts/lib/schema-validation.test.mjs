import test from 'node:test';
import assert from 'node:assert/strict';
import { validateStructuredData } from './schema-validation.mjs';

const html = (value) => `<script type="application/ld+json">${JSON.stringify(value)}</script>`;
function graph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Person', '@id': 'https://example.com/#person', name: 'Author' },
      { '@type': 'Organization', '@id': 'https://example.com/#publisher', name: 'Publisher' },
      { '@type': 'Article', '@id': 'https://example.com/post/#article', headline: 'Title',
        author: { '@id': 'https://example.com/#person' },
        publisher: { '@id': 'https://example.com/#publisher' },
        image: 'https://example.com/image.jpg', datePublished: '2026-01-01', dateModified: '2026-01-02' },
    ],
  };
}
test('traverses @graph and resolves referenced authors and publishers', () => {
  const result = validateStructuredData(html(graph()));
  assert.equal(result.failed, 0);
  assert.equal(result.nodes, 3);
  assert.ok(result.passed > 10);
});
test('detects invalid articles inside @graph, rather than skipping them', () => {
  const value = graph();
  delete value['@graph'][2].headline;
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('headline')));
});
test('detects missing and incorrectly typed referenced authors', () => {
  const value = graph();
  value['@graph'].shift();
  let result = validateStructuredData(html(value));
  assert.ok(result.violations.some((v) => v.includes('Unresolved Reference')));
  assert.ok(result.violations.some((v) => v.includes('Author Invalid')));
  value['@graph'].push({ '@type': 'ImageObject', '@id': 'https://example.com/#person', name: 'Wrong type' });
  result = validateStructuredData(html(value));
  assert.ok(result.violations.some((v) => v.includes('Author Invalid')));
});
test('checks reviewedBy domain and requires a recorded review date', () => {
  const value = graph();
  value['@graph'][2].reviewedBy = { '@id': 'https://example.com/#person' };
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('Invalid Domain')));
  const page = { '@type': 'WebPage', reviewedBy: { '@id': 'https://example.com/#person' } };
  value['@graph'][2] = page;
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('Reviewer Missing Date')));
  page.lastReviewed = '2026-01-02';
  assert.equal(validateStructuredData(html(value)).failed, 0);
});
test('rejects ItemList as hasPart but accepts article WebPages', () => {
  const value = graph();
  value['@graph'].push({ '@type': 'ProfilePage', mainEntity: { '@id': 'https://example.com/#person' }, hasPart: { '@type': 'ItemList' } });
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('hasPart Invalid Type')));
  value['@graph'].at(-1).hasPart = [{ '@type': 'WebPage', url: 'https://example.com/post/' }];
  assert.equal(validateStructuredData(html(value)).failed, 0);
});
test('accepts an omitted item for the final breadcrumb only', () => {
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
    { '@type': 'ListItem', position: 2, name: 'Current page' },
  ] };
  assert.equal(validateStructuredData(html(crumbs)).failed, 0);
  delete crumbs.itemListElement[0].item;
  assert.equal(validateStructuredData(html(crumbs)).failed, 1);
});
test('handles arrays and entities split between multiple JSON-LD scripts', () => {
  const value = graph()['@graph'];
  assert.equal(validateStructuredData(html(value.slice(0, 2)) + html(value[2])).failed, 0);
});
test('reports malformed JSON and empty graphs', () => {
  assert.equal(validateStructuredData('<script type="application/ld+json">{</script>').failed, 1);
  assert.equal(validateStructuredData(html({ '@graph': [] })).failed, 1);
});
test('rejects modification dates earlier than publication', () => {
  const value = graph();
  value['@graph'][2].dateModified = '2025-12-31';
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('Date Order Invalid')));
});
test('resolves FAQ questions and validates their answers', () => {
  const value = { '@graph': [
    { '@type': 'FAQPage', mainEntity: [{ '@id': 'https://example.com/#question' }] },
    { '@type': 'Question', '@id': 'https://example.com/#question', name: 'Question?', acceptedAnswer: { '@type': 'Answer', text: 'Answer.' } },
  ] };
  assert.equal(validateStructuredData(html(value)).failed, 0);
  delete value['@graph'][1].acceptedAnswer.text;
  assert.ok(validateStructuredData(html(value)).violations.some((v) => v.includes('FAQ Question Invalid')));
});
