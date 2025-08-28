/* PWA install */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}

const i18n = {
  en: {
    title: 'India Govt Schemes Portal',
    subtitle: 'Find & apply to Central and State welfare schemes in one place.',
    state: 'State', language: 'Language', search: 'Search', category: 'Category', all_categories: 'All categories', footer: 'Open public information. Always verify on official sites before applying.', apply: 'Apply', details: 'Details', results_count: (n)=>`${n} schemes` },
  hi: {
    title: 'भारत सरकार योजनाएँ पोर्टल',
    subtitle: 'केंद्र और राज्य की योजनाएँ एक जगह खोजें और आवेदन करें।',
    state: 'राज्य', language: 'भाषा', search: 'खोजें', category: 'श्रेणी', all_categories: 'सभी श्रेणियाँ', footer: 'सार्वजनिक सूचना। आवेदन से पहले आधिकारिक साइट पर सत्यापित करें।', apply: 'आवेदन', details: 'विवरण', results_count: (n)=>`${n} योजनाएँ` },
  bn: {
    title: 'ভারত সরকারি প্রকল্প পোর্টাল',
    subtitle: 'কেন্দ্র ও রাজ্যের প্রকল্প এক জায়গায় খুঁজে আবেদন করুন।',
    state: 'রাজ্য', language: 'ভাষা', search: 'সার্চ', category: 'ক্যাটাগরি', all_categories: 'সব ক্যাটাগরি', footer: 'পাবলিক তথ্য। আবেদনের আগে অফিসিয়াল সাইট যাচাই করুন।', apply: 'আবেদন', details: 'বিস্তারিত', results_count: (n)=>`${n}টি প্রকল্প` },
  or: {
    title: 'ଭାରତ ସରକାର ଯୋଜନା ପୋର୍ଟାଲ',
    subtitle: 'କେନ୍ଦ୍ର ଓ ରାଜ୍ୟ ଯୋଜନାଗୁଡ଼ିକୁ ଏକ ସ୍ଥାନରେ ଖୋଜି ଆବେଦନ କରନ୍ତୁ।',
    state: 'ରାଜ୍ୟ', language: 'ଭାଷା', search: 'ସନ୍ଧାନ', category: 'ଶ୍ରେଣୀ', all_categories: 'ସମସ୍ତ ଶ୍ରେଣୀ', footer: 'ସାର୍ବଜନିକ ସୂଚନା। ଆବେଦନ ପୂର୍ବରୁ ଅଧିକୃତ ସାଇଟରେ ଯାଞ୍ଚ କରନ୍ତୁ।', apply: 'ଆବେଦନ', details: 'ବିବରଣୀ', results_count: (n)=>`${n} ଯୋଜନା` },
};

const el = (sel) => document.querySelector(sel);
const els = (sel) => document.querySelectorAll(sel);
const yearEl = el('#year'); yearEl.textContent = new Date().getFullYear();

let LANG = localStorage.getItem('lang') || 'en';
let STATE = localStorage.getItem('state') || 'All';
let SCHEMES = [];
let STATES_META = {};

const stateSelect = el('#stateSelect');
const langSelect  = el('#langSelect');
const searchInput = el('#searchInput');
const resultsEl   = el('#results');
const statsEl     = el('#stats');
const categorySelect = el('#categorySelect');

async function loadData() {
  const [statesRes, schemesRes] = await Promise.all([
    fetch('./data/states.json'),
    fetch('./data/schemes.json')
  ]);
  STATES_META = await statesRes.json();
  SCHEMES = await schemesRes.json();
  setupUI();
  render();
}

function setupUI() {
  // Lang init
  langSelect.value = LANG;
  applyI18n();
  langSelect.addEventListener('change', () => { LANG = langSelect.value; localStorage.setItem('lang', LANG); applyI18n(); render(); });

  // State options
  const states = ['All', ...Object.keys(STATES_META)];
  stateSelect.innerHTML = states.map(s => `<option value="${s}">${s}</option>`).join('');
  stateSelect.value = STATE;
  stateSelect.addEventListener('change', () => { STATE = stateSelect.value; localStorage.setItem('state', STATE); updateCMPhoto(); render(); });

  // Category options (from data)
  const cats = new Set(['all']);
  SCHEMES.forEach(s => cats.add(s.category));
  categorySelect.innerHTML = Array.from(cats).map(c => `<option value="${c}">${c === 'all' ? t('all_categories') : c}</option>`).join('');

  // Search
  searchInput.addEventListener('input', () => render());

  // First CM
  updateCMPhoto();
}

function t(key) {
  const pack = i18n[LANG] || i18n.en;
  const v = pack[key];
  return typeof v === 'function' ? v : (v || i18n.en[key] || key);
}

function applyI18n() {
  el('#title').textContent = t('title');
  el('[data-i18n="subtitle"]').textContent = t('subtitle');
  els('[data-i18n="state"]').forEach(n=> n.textContent = t('state'));
  els('[data-i18n="language"]').forEach(n=> n.textContent = t('language'));
  els('[data-i18n="category"]').forEach(n=> n.textContent = t('category'));
  els('[data-i18n="all_categories"]').forEach(n=> n.textContent = t('all_categories'));
  els('[data-i18n="footer"]').forEach(n=> n.textContent = t('footer'));
  searchInput.placeholder = t('search') + '…';
}

function translate(field) {
  if (!field) return '';
  return field[LANG] || field.en || Object.values(field)[0] || '';
}

function updateCMPhoto() {
  const cmImg = el('#cmPhoto');
  const meta = STATES_META[STATE];
  if (meta && meta.cm && meta.cm.image) {
    cmImg.src = meta.cm.image; cmImg.alt = meta.cm.name;
  } else { cmImg.src = './images/cm/default_cm.jpg'; cmImg.alt = 'Chief Minister'; }
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;

  let list = SCHEMES.filter(s => {
    const inState = (STATE === 'All') || s.states.includes(STATE);
    const inCat = (cat === 'all') || s.category === cat;
    if (!(inState && inCat)) return false;
    if (!q) return true;
    const name = translate(s.name).toLowerCase();
    const desc = translate(s.desc).toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  statsEl.textContent = `${t('results_count')(list.length)} · ${STATE === 'All' ? 'All States' : STATE}`;

  resultsEl.innerHTML = list.map(s => {
    const name = translate(s.name);
    const desc = translate(s.desc);
    const statesStr = s.states.join(', ');
    return `
      <article class="card">
        <span class="badge">${s.category}</span>
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="meta">
          <span>States: ${statesStr}</span>
        </div>
        <div class="actions">
          <a class="btn" href="${s.info}" target="_blank" rel="noopener">${t('details')}</a>
          <a class="btn primary" href="${s.link}" target="_blank" rel="noopener">${t('apply')}</a>
        </div>
      </article>`;
  }).join('');
}

loadData();/* PWA install */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}

const i18n = {
  en: {
    title: 'India Govt Schemes Portal',
    subtitle: 'Find & apply to Central and State welfare schemes in one place.',
    state: 'State', language: 'Language', search: 'Search', category: 'Category', all_categories: 'All categories', footer: 'Open public information. Always verify on official sites before applying.', apply: 'Apply', details: 'Details', results_count: (n)=>`${n} schemes` },
  hi: {
    title: 'भारत सरकार योजनाएँ पोर्टल',
    subtitle: 'केंद्र और राज्य की योजनाएँ एक जगह खोजें और आवेदन करें।',
    state: 'राज्य', language: 'भाषा', search: 'खोजें', category: 'श्रेणी', all_categories: 'सभी श्रेणियाँ', footer: 'सार्वजनिक सूचना। आवेदन से पहले आधिकारिक साइट पर सत्यापित करें।', apply: 'आवेदन', details: 'विवरण', results_count: (n)=>`${n} योजनाएँ` },
  bn: {
    title: 'ভারত সরকারি প্রকল্প পোর্টাল',
    subtitle: 'কেন্দ্র ও রাজ্যের প্রকল্প এক জায়গায় খুঁজে আবেদন করুন।',
    state: 'রাজ্য', language: 'ভাষা', search: 'সার্চ', category: 'ক্যাটাগরি', all_categories: 'সব ক্যাটাগরি', footer: 'পাবলিক তথ্য। আবেদনের আগে অফিসিয়াল সাইট যাচাই করুন।', apply: 'আবেদন', details: 'বিস্তারিত', results_count: (n)=>`${n}টি প্রকল্প` },
  or: {
    title: 'ଭାରତ ସରକାର ଯୋଜନା ପୋର୍ଟାଲ',
    subtitle: 'କେନ୍ଦ୍ର ଓ ରାଜ୍ୟ ଯୋଜନାଗୁଡ଼ିକୁ ଏକ ସ୍ଥାନରେ ଖୋଜି ଆବେଦନ କରନ୍ତୁ।',
    state: 'ରାଜ୍ୟ', language: 'ଭାଷା', search: 'ସନ୍ଧାନ', category: 'ଶ୍ରେଣୀ', all_categories: 'ସମସ୍ତ ଶ୍ରେଣୀ', footer: 'ସାର୍ବଜନିକ ସୂଚନା। ଆବେଦନ ପୂର୍ବରୁ ଅଧିକୃତ ସାଇଟରେ ଯାଞ୍ଚ କରନ୍ତୁ।', apply: 'ଆବେଦନ', details: 'ବିବରଣୀ', results_count: (n)=>`${n} ଯୋଜନା` },
};

const el = (sel) => document.querySelector(sel);
const els = (sel) => document.querySelectorAll(sel);
const yearEl = el('#year'); yearEl.textContent = new Date().getFullYear();

let LANG = localStorage.getItem('lang') || 'en';
let STATE = localStorage.getItem('state') || 'All';
let SCHEMES = [];
let STATES_META = {};

const stateSelect = el('#stateSelect');
const langSelect  = el('#langSelect');
const searchInput = el('#searchInput');
const resultsEl   = el('#results');
const statsEl     = el('#stats');
const categorySelect = el('#categorySelect');

async function loadData() {
  const [statesRes, schemesRes] = await Promise.all([
    fetch('./data/states.json'),
    fetch('./data/schemes.json')
  ]);
  STATES_META = await statesRes.json();
  SCHEMES = await schemesRes.json();
  setupUI();
  render();
}

function setupUI() {
  // Lang init
  langSelect.value = LANG;
  applyI18n();
  langSelect.addEventListener('change', () => { LANG = langSelect.value; localStorage.setItem('lang', LANG); applyI18n(); render(); });

  // State options
  const states = ['All', ...Object.keys(STATES_META)];
  stateSelect.innerHTML = states.map(s => `<option value="${s}">${s}</option>`).join('');
  stateSelect.value = STATE;
  stateSelect.addEventListener('change', () => { STATE = stateSelect.value; localStorage.setItem('state', STATE); updateCMPhoto(); render(); });

  // Category options (from data)
  const cats = new Set(['all']);
  SCHEMES.forEach(s => cats.add(s.category));
  categorySelect.innerHTML = Array.from(cats).map(c => `<option value="${c}">${c === 'all' ? t('all_categories') : c}</option>`).join('');

  // Search
  searchInput.addEventListener('input', () => render());

  // First CM
  updateCMPhoto();
}

function t(key) {
  const pack = i18n[LANG] || i18n.en;
  const v = pack[key];
  return typeof v === 'function' ? v : (v || i18n.en[key] || key);
}

function applyI18n() {
  el('#title').textContent = t('title');
  el('[data-i18n="subtitle"]').textContent = t('subtitle');
  els('[data-i18n="state"]').forEach(n=> n.textContent = t('state'));
  els('[data-i18n="language"]').forEach(n=> n.textContent = t('language'));
  els('[data-i18n="category"]').forEach(n=> n.textContent = t('category'));
  els('[data-i18n="all_categories"]').forEach(n=> n.textContent = t('all_categories'));
  els('[data-i18n="footer"]').forEach(n=> n.textContent = t('footer'));
  searchInput.placeholder = t('search') + '…';
}

function translate(field) {
  if (!field) return '';
  return field[LANG] || field.en || Object.values(field)[0] || '';
}

function updateCMPhoto() {
  const cmImg = el('#cmPhoto');
  const meta = STATES_META[STATE];
  if (meta && meta.cm && meta.cm.image) {
    cmImg.src = meta.cm.image; cmImg.alt = meta.cm.name;
  } else { cmImg.src = './images/cm/default_cm.jpg'; cmImg.alt = 'Chief Minister'; }
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const cat = categorySelect.value;

  let list = SCHEMES.filter(s => {
    const inState = (STATE === 'All') || s.states.includes(STATE);
    const inCat = (cat === 'all') || s.category === cat;
    if (!(inState && inCat)) return false;
    if (!q) return true;
    const name = translate(s.name).toLowerCase();
    const desc = translate(s.desc).toLowerCase();
    return name.includes(q) || desc.includes(q);
  });

  statsEl.textContent = `${t('results_count')(list.length)} · ${STATE === 'All' ? 'All States' : STATE}`;

  resultsEl.innerHTML = list.map(s => {
    const name = translate(s.name);
    const desc = translate(s.desc);
    const statesStr = s.states.join(', ');
    return `
      <article class="card">
        <span class="badge">${s.category}</span>
        <h3>${name}</h3>
        <p>${desc}</p>
        <div class="meta">
          <span>States: ${statesStr}</span>
        </div>
        <div class="actions">
          <a class="btn" href="${s.info}" target="_blank" rel="noopener">${t('details')}</a>
          <a class="btn primary" href="${s.link}" target="_blank" rel="noopener">${t('apply')}</a>
        </div>
      </article>`;
  }).join('');
}

loadData();
