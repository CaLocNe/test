// ---------------------------------------------------------------
// Đọc danh sách tài liệu từ Firestore (collection "materials")
// và hiển thị theo danh mục, có tìm kiếm + lọc.
//
// Xem thư mục backend/ để biết cấu trúc dữ liệu mỗi tài liệu cần có.
// ---------------------------------------------------------------

const catalogEl = document.getElementById('catalog');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-filter');

let allDocs = [];

function stripDiacritics(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function matchesSearch(doc, query) {
  if (!query) return true;
  const haystack = stripDiacritics(`${doc.title || ''} ${doc.description || ''}`).toLowerCase();
  return haystack.includes(stripDiacritics(query).toLowerCase());
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showMessage(text) {
  catalogEl.innerHTML = `<p class="status-message">${escapeHtml(text)}</p>`;
}

function buildCard(doc) {
  const card = document.createElement('article');
  const type = (doc.fileType || '').toLowerCase() === 'doc' ? 'doc' : 'pdf';
  card.className = `doc-card doc-card--${type}`;

  const badge = document.createElement('span');
  badge.className = 'doc-type';
  badge.textContent = type.toUpperCase();
  card.appendChild(badge);

  const title = document.createElement('h3');
  title.className = 'doc-title';
  title.textContent = doc.title || 'Không có tiêu đề';
  card.appendChild(title);

  if (doc.description) {
    const desc = document.createElement('p');
    desc.className = 'doc-desc';
    desc.textContent = doc.description;
    card.appendChild(desc);
  }

  const link = document.createElement('a');
  link.className = 'doc-open';
  link.href = doc.fileURL || '#';
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Mở tài liệu';
  card.appendChild(link);

  return card;
}

function populateCategoryFilter() {
  const categories = Array.from(new Set(allDocs.map((d) => d.category).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b, 'vi'));

  const current = categorySelect.value;
  categorySelect.innerHTML = '<option value="">Tất cả danh mục</option>';
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
  categorySelect.value = current;
}

function render() {
  if (allDocs.length === 0) {
    showMessage('Thư viện chưa có tài liệu nào.');
    return;
  }

  const query = searchInput.value.trim();
  const category = categorySelect.value;

  const filtered = allDocs.filter((doc) => {
    const matchCategory = !category || doc.category === category;
    return matchCategory && matchesSearch(doc, query);
  });

  if (filtered.length === 0) {
    showMessage('Không tìm thấy tài liệu phù hợp.');
    return;
  }

  const groups = {};
  filtered.forEach((doc) => {
    const cat = doc.category || 'Khác';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(doc);
  });

  const categories = Object.keys(groups).sort((a, b) => a.localeCompare(b, 'vi'));

  catalogEl.innerHTML = '';
  categories.forEach((cat) => {
    const items = groups[cat].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'vi'));

    const section = document.createElement('section');
    section.className = 'category-section';

    const heading = document.createElement('div');
    heading.className = 'category-heading';
    const h2 = document.createElement('h2');
    h2.textContent = cat;
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = `${items.length} tài liệu`;
    heading.appendChild(h2);
    heading.appendChild(count);
    section.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'card-grid';
    items.forEach((doc) => grid.appendChild(buildCard(doc)));
    section.appendChild(grid);

    catalogEl.appendChild(section);
  });
}

// Lắng nghe collection "materials" theo thời gian thực — khi bạn
// thêm/sửa/xoá tài liệu trong Firebase Console, trang sẽ tự cập nhật
// mà không cần deploy lại.
db.collection('materials').onSnapshot(
  (snapshot) => {
    allDocs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    populateCategoryFilter();
    render();
  },
  (error) => {
    console.error(error);
    showMessage('Không thể tải danh sách tài liệu. Vui lòng kiểm tra lại cấu hình Firebase.');
  }
);

searchInput.addEventListener('input', render);
categorySelect.addEventListener('change', render);
