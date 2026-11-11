import './review-emphasis';
import './review-policy-dialog';

function updateReviewDates() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  document.querySelectorAll<HTMLElement>('[data-policy-checked]').forEach((element) => {
    const age = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${element.dataset.policyChecked}T00:00:00Z`)) / 86400000;
    const stale = element.querySelector<HTMLElement>('.policy-stale');
    if (stale) stale.hidden = age <= 30;
    if ((element.dataset.policyEnd && element.dataset.policyEnd < today) || (element.dataset.policyStart && element.dataset.policyStart > today)) {
      const number = element.querySelector('.policy-number');
      if (number) number.textContent = 'Cần kiểm tra lại';
      element.classList.add('policy-value--unknown');
      const label = element.querySelector('.policy-condition');
      if (label) label.textContent = 'Mức này không còn trong thời gian áp dụng.';
    }
  });
  document.querySelectorAll<HTMLElement>('[data-review-offers]').forEach((section) => {
    const offers = Array.from(section.querySelectorAll<HTMLElement>('[data-offer]'));
    offers.forEach((offer) => {
      offer.hidden = Boolean((offer.dataset.offerStart && offer.dataset.offerStart > today) || (offer.dataset.offerEnd && offer.dataset.offerEnd < today));
    });
    const empty = section.querySelector<HTMLElement>('[data-offers-empty]');
    if (empty) empty.hidden = offers.some((offer) => !offer.hidden);
  });
  document.dispatchEvent(new CustomEvent('review:datechange'));
}
updateReviewDates();
// Recheck when a tab is revisited, including across midnight in Vietnam.
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateReviewDates(); });
window.addEventListener('pageshow', updateReviewDates);
setInterval(updateReviewDates, 60_000);

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('[data-broker-outbound]') : null;
  if (!target) return;
  const analytics = window as Window & { dataLayer?: Record<string, unknown>[] };
  analytics.dataLayer ??= [];
  analytics.dataLayer.push({ event: 'review_outbound_click', broker: target.dataset.brokerOutbound, link_kind: target.dataset.linkKind, destination: target.hostname });
});
