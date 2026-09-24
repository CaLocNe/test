// ---------------------------------------------------------------
// Điều khiển thanh menu trên cùng: mở/đóng menu trượt, mở rộng mục
// "Sách", đánh dấu mục đang active (chấm tròn tối màu), và liên kết
// việc chọn lớp với bộ lọc danh mục sẵn có trong app.js — không cần
// sửa app.js, chỉ set giá trị #category-filter rồi bắn sự kiện
// "change" mà app.js đã lắng nghe.
// ---------------------------------------------------------------

const menuButton = document.getElementById('menu-button');
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('drawer-backdrop');

const navHome = document.getElementById('nav-home');
const navSach = document.getElementById('nav-sach');
const sachWrapper = document.getElementById('sach-wrapper');
const navContact = document.getElementById('nav-contact');
const gradeChips = Array.from(document.querySelectorAll('.grade-chip'));

const categorySelect = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');

// ---------- Mở / đóng menu ----------

function openDrawer() {
  drawer.classList.add('is-open');
  backdrop.classList.add('is-open');
  drawer.removeAttribute('inert');
  menuButton.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  backdrop.classList.remove('is-open');
  drawer.setAttribute('inert', '');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleDrawer() {
  const isOpen = drawer.classList.contains('is-open');
  if (isOpen) {
    closeDrawer();
  } else {
    openDrawer();
  }
}

menuButton.addEventListener('click', toggleDrawer);
backdrop.addEventListener('click', closeDrawer);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && drawer.classList.contains('is-open')) {
    closeDrawer();
    menuButton.focus();
  }
});

// Menu đóng sẵn khi tải trang
closeDrawer();

// ---------- Mở rộng / thu gọn mục "Sách" ----------

function setSachExpanded(expanded) {
  navSach.setAttribute('aria-expanded', String(expanded));
  sachWrapper.classList.toggle('is-open', expanded);
}

navSach.addEventListener('click', () => {
  const expanded = navSach.getAttribute('aria-expanded') === 'true';
  setSachExpanded(!expanded);
});

// ---------- Đánh dấu mục đang active ----------

function clearActiveStates() {
  [navHome, navSach, navContact, ...gradeChips].forEach((el) => {
    el.classList.remove('is-active');
  });
}

function setActiveHome() {
  clearActiveStates();
  navHome.classList.add('is-active');
}

function setActiveGrade(chip) {
  clearActiveStates();
  navSach.classList.add('is-active');
  chip.classList.add('is-active');
}

function setActiveContact() {
  clearActiveStates();
  navContact.classList.add('is-active');
}

// ---------- Liên kết với bộ lọc danh mục trong app.js ----------

function applyCategoryFilter(value) {
  categorySelect.value = value;
  categorySelect.dispatchEvent(new Event('change'));
}

navHome.addEventListener('click', () => {
  setActiveHome();
  setSachExpanded(false);
  applyCategoryFilter('');
  searchInput.value = '';
  searchInput.dispatchEvent(new Event('input'));
  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

gradeChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    setActiveGrade(chip);
    applyCategoryFilter(chip.dataset.category);
    closeDrawer();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

navContact.addEventListener('click', () => {
  setActiveContact();
  setSachExpanded(false);
  closeDrawer();
  document.getElementById('lien-he').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Trạng thái ban đầu: Trang chủ đang active
setActiveHome();
