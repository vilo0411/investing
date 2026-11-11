// Keep the full source in server-rendered HTML. With JS, open it in the top
// layer instead of expanding the table cell. Native details remains the no-JS fallback.
let dialog: HTMLDialogElement | undefined;
let returnFocus: HTMLElement | undefined;
if (typeof HTMLDialogElement !== 'undefined') document.documentElement.classList.add('review-has-dialog');
function ensureDialog() {
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = 'policy-dialog';
  dialog.setAttribute('aria-labelledby', 'policy-dialog-title');
  const header = document.createElement('div'); header.className = 'policy-dialog-header';
  const heading = document.createElement('h2'); heading.id = 'policy-dialog-title';
  const close = document.createElement('button'); close.type = 'button'; close.className = 'policy-dialog-close'; close.textContent = 'Đóng ×'; close.setAttribute('aria-label', 'Đóng điều kiện và nguồn');
  close.addEventListener('click', () => dialog!.close());
  header.append(heading, close);
  const body = document.createElement('div'); body.className = 'policy-dialog-body';
  dialog.append(header, body); document.body.append(dialog);
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('policy-dialog-open'); returnFocus?.focus({ preventScroll: true }); });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog!.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog!.close();
  });
  return dialog;
}
document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;
  const summary = event.target.closest<HTMLElement>('.policy-detail > summary');
  if (!summary || typeof HTMLDialogElement === 'undefined') return;
  event.preventDefault();
  const detail = summary.parentElement!;
  const policy = detail.closest<HTMLElement>('.policy-value')!;
  const row = policy.closest<HTMLElement>('[data-broker-row]');
  const metric = { stocks: 'Phí cổ phiếu', margin: 'Lãi margin', derivatives: 'Phí phái sinh', advance: 'Ứng trước tiền bán' }[policy.dataset.policyMetric ?? ''];
  const modal = ensureDialog();
  modal.querySelector('h2')!.textContent = `${row?.dataset.shortName ?? policy.dataset.policyBroker ?? ''} · ${metric ?? 'Điều kiện'} · ${policy.querySelector('.policy-number')?.textContent ?? ''}`;
  const body = modal.querySelector('.policy-dialog-body')!; body.replaceChildren();
  Array.from(detail.children).filter((child) => child.tagName !== 'SUMMARY').forEach((child) => body.append(child.cloneNode(true)));
  returnFocus = summary; document.documentElement.classList.add('policy-dialog-open'); modal.showModal();
});
