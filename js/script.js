// Translations (…)
const i18n = { /* … */ };

// language detection…
const lang = navigator.language.slice(0,2);
const locale = i18n[lang] ? lang : 'en';
document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  el.textContent = i18n[locale][key] || i18n.en[key] || el.textContent;
});

// tab logic
const tabs = document.querySelectorAll('.main-nav .tab');
const sections = document.querySelectorAll('.content, .inbox');

function showSection(id) {
  sections.forEach(s => s.classList.add('hidden'));
  if (id === 'mailbox-area') {
    document.querySelector('#mailbox-area .inbox').classList.remove('hidden');
  } else {
    const sec = document.getElementById(id);
    if (sec) sec.classList.remove('hidden');
  }
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
}

tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const target = tab.dataset.target;
    history.replaceState(null, '', `#${target}`);
    showSection(target);
  });
});

// on load, respect hash or default to mailbox
const initial = location.hash.slice(1) || 'mailbox-area';
showSection(initial);

// dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// placeholder for API integration…
document.getElementById('btn-create').addEventListener('click', async () => {
  // TODO: implement /api/create & polling…
});
