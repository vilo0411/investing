export {};
const status = document.querySelector('#admin-status');
const save = document.querySelector('#save-all');
const form = document.querySelector('#entry-form');
const list = document.querySelector('#entry-list');
const search = document.querySelector('#entry-search');
const raw = document.querySelector('#raw-json');
const note = document.querySelector('#save-note');
const newEntry = document.querySelector('#new-entry');
const token = location.hash.slice(1) || sessionStorage.getItem('review-admin-token') || '';
if (location.hash) { sessionStorage.setItem('review-admin-token', token); history.replaceState(null, '', location.pathname); }
let catalog;
let revision;
let section = 'policies';
let selected = null;
let dirty = false;
let busy = false;
const metricOptions = [['stocks', 'Phí cổ phiếu'], ['margin', 'Lãi margin'], ['derivatives', 'Phí phái sinh'], ['advance', 'Ứng trước']];
const titles = { policies: 'Biểu phí & lãi suất', sources: 'Nguồn dữ liệu', offers: 'Ưu đãi', links: 'Liên kết', history: 'Lịch sử chỉnh sửa' };
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const fields = {
  policies: [
    ['id', 'ID duy nhất', 'text'], ['broker', 'Công ty', 'broker'], ['metric', 'Loại dữ liệu', metricOptions],
    ['label', 'Tên gói / kênh', 'text'], ['value', 'Giá trị (dấu chấm thập phân)', 'number'], ['maxValue', 'Giá trị tối đa (nếu là khoảng)', 'nullable-number'],
    ['qualifier', 'Cách hiển thị', [['fixed', 'Cố định'], ['from', 'Từ mức'], ['range', 'Khoảng giá trị']]],
    ['unit', 'Đơn vị', [['percent', '% giá trị giao dịch'], ['percent-year', '%/năm'], ['percent-day', '%/ngày'], ['vnd-contract', 'đ/HĐ']]],
    ['exchangeFee', 'Phí Sở', [['included', 'Đã gồm'], ['excluded', 'Chưa gồm'], ['unknown', 'Chưa xác định'], ['not-applicable', 'Không áp dụng']]],
    ['sourceId', 'Nguồn', 'source'], ['conditions', 'Điều kiện và cách tính', 'textarea'],
    ['checkedAt', 'Ngày đối chiếu nguồn', 'date'], ['validFrom', 'Hiệu lực từ (có thể trống)', 'nullable-date'], ['validUntil', 'Hiệu lực đến (có thể trống)', 'nullable-date'],
    ['status', 'Trạng thái', [['draft', 'Nháp'], ['published', 'Xuất bản']]], ['primary', 'Dùng làm mức chuẩn trong bảng', 'checkbox'],
  ],
  sources: [['id', 'ID nguồn', 'text'], ['publisher', 'Đơn vị công bố', 'text'], ['title', 'Tên tài liệu', 'text'], ['url', 'URL HTTPS tới tài liệu gốc', 'url']],
  offers: [
    ['id', 'ID ưu đãi', 'text'], ['broker', 'Công ty', 'broker'], ['metric', 'Loại ưu đãi', metricOptions],
    ['title', 'Tên chương trình', 'text'], ['benefit', 'Quyền lợi', 'text'], ['conditions', 'Đối tượng, hạn mức và điều kiện', 'textarea'],
    ['sourceId', 'Nguồn thể lệ', 'source'], ['checkedAt', 'Ngày đối chiếu', 'date'],
    ['startsAt', 'Bắt đầu nhận đăng ký (có thể trống)', 'nullable-date'], ['endsAt', 'Hạn đăng ký (có thể trống)', 'nullable-date'],
    ['benefitDuration', 'Thời gian được hưởng (khác hạn đăng ký)', 'textarea'],
    ['status', 'Trạng thái', [['draft', 'Nháp'], ['published', 'Xuất bản'], ['ended', 'Đã dừng']]],
  ],
  links: [['broker', 'Công ty', 'broker'], ['url', 'URL đích HTTPS', 'url'], ['kind', 'Loại liên kết', [['official', 'Website chính thức'], ['partner', 'Liên kết đối tác']]], ['disclosure', 'Công khai quan hệ đối tác', 'textarea']],
};

async function request(method = 'GET', body) {
  const response = await fetch('/api/catalog', {
    method, headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json', 'If-Match': revision } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Không thể xử lý yêu cầu.');
  return result;
}
function syncRaw() { raw.value = JSON.stringify(catalog, null, 2); }
function changed() { dirty = true; save.disabled = busy; syncRaw(); status.textContent = 'Có thay đổi chưa lưu. Chọn “Lưu dữ liệu” sau khi kiểm tra nguồn và trạng thái.'; }
function renderList() {
  list.replaceChildren();
  const entries = catalog[section];
  const query = search.value.toLowerCase().trim();
  const pairs = entries.map((entry, index) => ({ entry, index }));
  if (section === 'history') pairs.reverse();
  for (const { entry, index } of pairs) {
    if (query && !JSON.stringify(entry).toLowerCase().includes(query)) continue;
    const button = document.createElement('button'); button.type = 'button';
    button.setAttribute('aria-pressed', String(index === selected));
    const title = document.createElement('strong'); title.textContent = entry.label || entry.title || entry.note || entry.broker || '(Mục mới)';
    const meta = document.createElement('small'); meta.textContent = [entry.id, entry.broker, entry.metric, entry.status, entry.at].filter(Boolean).join(' · ');
    button.append(title, meta); button.addEventListener('click', () => { selected = index; render(); }); list.append(button);
  }
  if (!list.childElementCount) { const p = document.createElement('p'); p.textContent = 'Chưa có mục phù hợp.'; list.append(p); }
}
function render() {
  document.querySelectorAll('[data-section]').forEach((button) => {
    if (button.dataset.section === section) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  renderList(); form.replaceChildren(); newEntry.disabled = section === 'history';
  document.querySelector('#editor-title').textContent = selected === null ? `Chọn một mục trong ${titles[section].toLowerCase()}` : titles[section];
  if (selected === null) return;
  const entry = catalog[section][selected];
  if (section === 'history') {
    const p = document.createElement('p'); p.className = 'full-width'; p.textContent = `${entry.at}\n${entry.note}\n${entry.changes.join('\n')}`; form.append(p); return;
  }
  for (const [key, labelText, type] of fields[section]) {
    const label = document.createElement('label'); label.textContent = labelText;
    let control;
    let options = Array.isArray(type) ? type : type === 'broker' ? catalog.brokers.map((slug) => [slug, slug.toUpperCase()]) : type === 'source' ? catalog.sources.map((source) => [source.id, `${source.publisher}: ${source.title}`]) : null;
    if (options) {
      control = document.createElement('select');
      for (const [value, text] of options) { const option = document.createElement('option'); option.value = value; option.textContent = text; control.append(option); }
    } else if (type === 'textarea') { control = document.createElement('textarea'); label.className = 'full-width'; }
    else {
      control = document.createElement('input');
      control.type = type === 'nullable-date' ? 'date' : type === 'nullable-number' ? 'number' : type;
      if (control.type === 'number') { control.min = '0'; control.step = 'any'; }
      if (control.type === 'date' && key === 'checkedAt') control.max = today();
    }
    control.name = key;
    if (type === 'checkbox') { label.className = 'checkbox-label'; control.checked = entry[key]; }
    else control.value = entry[key] ?? '';
    control.required = !['nullable-date', 'nullable-number', 'checkbox'].includes(type);
    control.addEventListener('input', () => {
      if (type === 'checkbox') entry[key] = control.checked;
      else if (type === 'nullable-number') entry[key] = control.value === '' ? null : Number(control.value);
      else if (type === 'number') entry[key] = control.value === '' ? null : Number(control.value);
      else if (type === 'nullable-date') entry[key] = control.value || null;
      else entry[key] = control.value;
      changed(); renderList();
    });
    label.append(control); form.append(label);
  }
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'btn-secondary full-width'; remove.textContent = 'Xóa mục khỏi bản làm việc';
  remove.addEventListener('click', () => { if (!confirm('Xóa mục này? Thay đổi chỉ ghi vào tệp sau khi bạn lưu dữ liệu.')) return; catalog[section].splice(selected, 1); selected = null; changed(); render(); });
  form.append(remove);
}
async function load() {
  if (busy) return;
  if (dirty && !confirm('Bỏ thay đổi chưa lưu và tải lại dữ liệu từ tệp?')) return;
  busy = true; save.disabled = true;
  try { const result = await request(); catalog = result.catalog; revision = result.revision; dirty = false; selected = null; syncRaw(); render(); status.textContent = 'Đã tải dữ liệu. Thay đổi chỉ được lưu khi bạn bấm “Lưu dữ liệu”.'; }
  catch (error) { status.textContent = error.message; }
  finally { busy = false; save.disabled = !catalog; }
}
document.querySelectorAll('[data-section]').forEach((button) => button.addEventListener('click', () => { if (!catalog) return; section = button.dataset.section; selected = null; search.value = ''; render(); }));
search.addEventListener('input', () => { if (catalog) renderList(); });
newEntry.addEventListener('click', () => {
  if (!catalog || section === 'history') return;
  const broker = catalog.brokers[0]; const sourceId = catalog.sources[0]?.id ?? '';
  const defaults = {
    policies: { id: '', broker, metric: 'stocks', label: '', value: 0, maxValue: null, qualifier: 'fixed', unit: 'percent', exchangeFee: 'unknown', conditions: '', sourceId, checkedAt: today(), validFrom: null, validUntil: null, status: 'draft', primary: false },
    sources: { id: '', title: '', url: '', publisher: '' },
    offers: { id: '', broker, metric: 'margin', title: '', benefit: '', conditions: '', sourceId, checkedAt: today(), startsAt: null, endsAt: null, benefitDuration: '', status: 'draft' },
    links: { broker, url: '', kind: 'official', disclosure: 'Website chính thức, không phải liên kết đối tác.' },
  };
  catalog[section].push(defaults[section]); selected = catalog[section].length - 1; changed(); render();
});
form.addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#reload-data').addEventListener('click', load);
save.addEventListener('click', async () => {
  if (busy || !catalog) return;
  if (note.value.trim().length < 3) { status.textContent = 'Nhập lý do chỉnh sửa trước khi lưu.'; note.focus(); return; }
  busy = true; save.disabled = true;
  try { const result = await request('PUT', { catalog, note: note.value.trim() }); catalog = result.catalog; revision = result.revision; dirty = false; note.value = ''; syncRaw(); render(); status.textContent = result.message; }
  catch (error) { status.textContent = error.message; }
  finally { busy = false; save.disabled = false; }
});
document.querySelector('#apply-json').addEventListener('click', () => {
  try {
    const parsed = JSON.parse(raw.value);
    if (parsed.version !== 1 || !['brokers', 'policies', 'sources', 'offers', 'links', 'history'].every((key) => Array.isArray(parsed[key]))) throw new Error('Thiếu nhóm dữ liệu bắt buộc.');
    catalog = parsed; selected = null; changed(); render();
  } catch (error) { status.textContent = `Không thể áp dụng JSON: ${error.message}`; }
});
window.addEventListener('beforeunload', (event) => { if (dirty) event.preventDefault(); });
if (token) load(); else status.textContent = 'Mở liên kết quản trị được in khi chạy npm run reviews:admin.';
