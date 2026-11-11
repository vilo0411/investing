import { policyEmphasis } from '../lib/review-emphasis.mjs';

function updateEmphasis() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  document.querySelectorAll<HTMLElement>('[data-policy-comparison]').forEach((table) => {
    const elements = Array.from(table.querySelectorAll<HTMLElement>('[data-policy-id]'));
    const selectedOnly = table.dataset.policyComparison === 'selected';
    const candidates = elements.filter((element) => !selectedOnly || !element.closest('[data-compare-column][hidden]'));
    const asPolicy = (element: HTMLElement) => ({
      value: Number(element.dataset.policyValue), metric: element.dataset.policyMetric, unit: element.dataset.policyUnit,
      maxValue: element.dataset.policyMax ? Number(element.dataset.policyMax) : null, qualifier: element.dataset.policyQualifier,
      exchangeFee: element.dataset.policyExchange, checkedAt: element.dataset.policyChecked,
      validFrom: element.dataset.policyStart || null, validUntil: element.dataset.policyEnd || null,
      status: 'published', primary: true,
    });
    const peers = candidates.map(asPolicy);
    elements.forEach((element) => {
      const emphasis = policyEmphasis(asPolicy(element), peers, today);
      element.dataset.emphasis = emphasis.kind;
      element.style.setProperty('--policy-strength', String(emphasis.strength));
      const label = element.querySelector<HTMLElement>('.policy-extreme');
      if (label) { label.hidden = !emphasis.label; label.textContent = emphasis.label; }
    });
  });
}
updateEmphasis();
document.addEventListener('review:datechange', updateEmphasis);
document.addEventListener('review:comparisonchange', updateEmphasis);
