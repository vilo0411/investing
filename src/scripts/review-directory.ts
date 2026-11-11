const directory = document.querySelector<HTMLElement>('[data-review-directory]');
if (directory) {
  const search = directory.querySelector<HTMLInputElement>('#broker-search')!;
  const sort = directory.querySelector<HTMLSelectElement>('#broker-sort')!;
  const tbody = directory.querySelector<HTMLTableSectionElement>('tbody')!;
  const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('[data-broker-row]'));
  const count = directory.querySelector<HTMLElement>('#broker-count')!;
  const empty = directory.querySelector<HTMLElement>('[data-directory-empty]')!;
  const more = directory.querySelector<HTMLButtonElement>('[data-show-more]')!;
  const filters = Array.from(directory.querySelectorAll<HTMLInputElement>('.review-filters input'));
  const params = new URLSearchParams(location.search);
  const validSorts = Array.from(sort.options).map((option) => option.value);
  search.value = params.get('q')?.slice(0, 100) ?? '';
  sort.value = validSorts.includes(params.get('sort') ?? '') ? params.get('sort')! : 'coverage';
  let direction: 'asc' | 'desc' = params.get('dir') === 'desc' ? 'desc' : 'asc';
  filters.forEach((filter) => { filter.checked = params.get(filter.name) === '1'; });
  let visibleLimit = 8;

  const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
  const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const value = (row: HTMLElement, metric: string): number | undefined => {
    const policy = row.querySelector<HTMLElement>(`[data-policy-metric="${metric}"]`);
    if (!policy || !policy.dataset.policyValue || (policy.dataset.policyEnd && policy.dataset.policyEnd < today()) || (policy.dataset.policyStart && policy.dataset.policyStart > today())) return undefined;
    const number = Number(policy.dataset.policyValue);
    return Number.isFinite(number) ? number : undefined;
  };
  const has = (name: string) => filters.find((filter) => filter.name === name)?.checked;
  const coverage = (row: HTMLElement) => ['stocks', 'margin', 'derivatives', 'advance'].filter((metric) => value(row, metric) !== undefined).length;

  function render(syncUrl = true) {
    const query = normalize(search.value.trim());
    const filtered = rows.filter((row) => {
      const stocks = value(row, 'stocks');
      return normalize(`${row.dataset.name} ${row.dataset.shortName} ${row.dataset.broker}`).includes(query) &&
        (!has('sourced') || coverage(row) > 0) &&
        (!has('low-fee') || (stocks !== undefined && stocks <= .1 && row.querySelector<HTMLElement>('[data-policy-metric="stocks"]')?.dataset.policyQualifier === 'fixed')) &&
        (!has('zero-derivatives') || value(row, 'derivatives') === 0);
    });
    filtered.sort((a, b) => {
      const name = (a.dataset.shortName ?? '').localeCompare(b.dataset.shortName ?? '', 'vi');
      if (sort.value === 'coverage') return coverage(b) - coverage(a) || name;
      if (sort.value === 'name') return direction === 'asc' ? name : -name;
      if (sort.value === 'margin') {
        const unitRank = (row: HTMLElement) => {
          const unit = row.querySelector<HTMLElement>('[data-policy-metric="margin"]')?.dataset.policyUnit;
          return value(row, 'margin') === undefined ? 2 : unit === 'percent-year' ? 0 : 1;
        };
        const unitOrder = unitRank(a) - unitRank(b);
        if (unitOrder) return unitOrder;
      }
      const left = value(a, sort.value), right = value(b, sort.value);
      if (left === undefined && right === undefined) return name;
      if (left === undefined) return 1;
      if (right === undefined) return -1;
      return (direction === 'asc' ? left - right : right - left) || name;
    });
    rows.forEach((row) => { row.hidden = true; });
    filtered.forEach((row, index) => { row.hidden = index >= visibleLimit; tbody.append(row); });
    empty.hidden = filtered.length > 0;
    more.hidden = filtered.length <= visibleLimit;
    more.textContent = `Xem thêm ${Math.min(8, filtered.length - visibleLimit)} công ty`;
    count.textContent = `Hiển thị ${Math.min(visibleLimit, filtered.length)}/${filtered.length} công ty phù hợp · ${rows.length} công ty trong danh bạ`;
    directory!.querySelectorAll<HTMLElement>('[data-sort-column]').forEach((header) => {
      if (header.dataset.sortColumn === sort.value) header.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : 'descending');
      else header.removeAttribute('aria-sort');
      const indicator = header.querySelector<HTMLElement>('[data-sort-indicator]');
      if (indicator) indicator.textContent = header.dataset.sortColumn === sort.value ? (direction === 'asc' ? '↑' : '↓') : '↕';
      header.querySelector('button')?.setAttribute('title', header.dataset.sortColumn === sort.value ? `Bấm để sắp xếp ${direction === 'asc' ? 'giảm' : 'tăng'} dần` : 'Bấm để sắp xếp tăng dần');
    });
    if (syncUrl) {
      const next = new URL(location.href);
      for (const key of ['q', 'sort', 'dir', ...filters.map((filter) => filter.name)]) next.searchParams.delete(key);
      if (search.value.trim()) next.searchParams.set('q', search.value.trim());
      if (sort.value !== 'coverage') next.searchParams.set('sort', sort.value);
      if (direction === 'desc') next.searchParams.set('dir', direction);
      filters.filter((filter) => filter.checked).forEach((filter) => next.searchParams.set(filter.name, '1'));
      history.replaceState(null, '', next);
    }
  }
  search.addEventListener('input', () => { visibleLimit = 8; render(); });
  sort.addEventListener('change', () => { direction = 'asc'; visibleLimit = 8; render(); });
  filters.forEach((filter) => filter.addEventListener('change', () => { visibleLimit = 8; render(); }));
  directory.querySelectorAll<HTMLButtonElement>('[data-sort]').forEach((button) => button.addEventListener('click', () => {
    direction = sort.value === button.dataset.sort && direction === 'asc' ? 'desc' : 'asc';
    sort.value = button.dataset.sort!; visibleLimit = 8; render();
  }));
  directory.querySelectorAll<HTMLButtonElement>('[data-reset-filters]').forEach((button) => button.addEventListener('click', () => {
    search.value = ''; sort.value = 'coverage'; direction = 'asc'; filters.forEach((filter) => { filter.checked = false; }); visibleLimit = 8; render(); search.focus();
  }));
  more.addEventListener('click', () => { visibleLimit += 8; render(false); });
  window.addEventListener('pageshow', () => render(false));
  document.addEventListener('review:datechange', () => render(false));
  render(false);

  const selected = new Set<string>();
  const boxes = Array.from(directory.querySelectorAll<HTMLInputElement>('[data-compare]'));
  const tray = directory.querySelector<HTMLElement>('[data-compare-tray]')!;
  const link = directory.querySelector<HTMLAnchorElement>('[data-compare-link]')!;
  const compareBase = link.href;
  const editorialLink = directory.querySelector<HTMLAnchorElement>('[data-selected-editorial]')!;
  const editorialPairs = JSON.parse(directory.dataset.editorialPairs ?? '[]') as { slugs: string[]; href: string }[];
  const names = directory.querySelector<HTMLElement>('[data-compare-names]')!;
  const status = directory.querySelector<HTMLElement>('[data-compare-status]')!;
  const compareName = (slug: string) => rows.find((row) => row.dataset.broker === slug)?.dataset.shortName ?? slug;
  function updateSelection() {
    tray.hidden = selected.size === 0;
    directory!.classList.toggle('has-review-selection', selected.size > 0);
    names.textContent = Array.from(selected).map(compareName).join(' · ');
    status.textContent = selected.size < 2 ? 'Chọn thêm 1 công ty để bắt đầu so sánh.' : selected.size === 3 ? 'Đã chọn tối đa 3 công ty. Bỏ chọn để đổi công ty khác.' : 'Có thể chọn thêm 1 công ty.';
    const target = new URL(compareBase);
    target.searchParams.set('ctck', Array.from(selected).join(','));
    link.href = target.toString();
    link.setAttribute('aria-disabled', String(selected.size < 2));
    const editorial = selected.size === 2 ? editorialPairs.find((pair) => pair.slugs.length === 2 && pair.slugs.every((slug) => selected.has(slug))) : undefined;
    editorialLink.hidden = !editorial;
    if (editorial) { editorialLink.href = editorial.href; editorialLink.textContent = `Đọc so sánh ${Array.from(selected).map(compareName).join(' và ')} →`; }
    link.className = editorial ? 'btn-secondary' : 'btn-primary';
    link.textContent = editorial ? 'Đối chiếu số liệu' : 'Đối chiếu phí đã chọn →';
    boxes.forEach((box) => { box.checked = selected.has(box.dataset.compare!); box.disabled = selected.size === 3 && !box.checked; });
  }
  boxes.forEach((box) => box.addEventListener('change', () => {
    if (box.checked && selected.size < 3) selected.add(box.dataset.compare!);
    else selected.delete(box.dataset.compare!);
    updateSelection();
  }));
  directory.querySelector('[data-clear-compare]')!.addEventListener('click', () => { selected.clear(); updateSelection(); });
  link.addEventListener('click', (event) => { if (selected.size < 2) event.preventDefault(); });
  updateSelection();
}
