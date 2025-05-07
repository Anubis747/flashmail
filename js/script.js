// Translations (fill in as needed)
const i18n = {
  en: { /* ... */ },
  pt: { /* ... */ },
  es: { /* ... */ },
  fr: { /* ... */ },
  de: { /* ... */ },
  ru: { /* ... */ }
};

// Detect language
const lang = navigator.language.slice(0, 2);
const locale = i18n[lang] ? lang : 'en';

// Apply translations
document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  el.textContent = i18n[locale][key] || i18n.en[key] || el.textContent;
});

// Tab navigation
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.content, .inbox').forEach(sec => sec.classList.add('hidden'));
    if (tab.dataset.target === 'mailbox-area') {
      document.querySelector('#mailbox-area .inbox').classList.remove('hidden');
    } else {
      document.getElementById(tab.dataset.target).classList.remove('hidden');
    }
  });
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Placeholder for API integration
document.getElementById('btn-create').addEventListener('click', async () => {
  // TODO: implement call to /api/create and polling on /api/messages/:id
});
