// Traduções (preencha conforme necessário)
const i18n = {
  en: { /* ... */ },
  pt: { /* ... */ },
  es: { /* ... */ },
  fr: { /* ... */ },
  de: { /* ... */ },
  ru: { /* ... */ }
};

// Detectar idioma
const lang = navigator.language.slice(0,2);
const locale = i18n[lang] ? lang : 'en';

// Aplicar traduções
document.querySelectorAll('[data-i18n]').forEach(el => {
  const key = el.getAttribute('data-i18n');
  el.textContent = i18n[locale][key] || i18n['en'][key] || el.textContent;
});

// Navegação entre abas
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.content, .inbox').forEach(sec => sec.classList.add('hidden'));
    if (btn.dataset.target === 'mailbox-area') {
      document.querySelector('#mailbox-area .inbox').classList.remove('hidden');
    } else {
      document.getElementById(btn.dataset.target).classList.remove('hidden');
    }
  });
});

// Ano dinâmico
document.getElementById('year').textContent = new Date().getFullYear();

// Placeholder para integração com API
document.getElementById('btn-create').addEventListener('click', async () => {
  // TODO: implementar chamada a /api/create e polling em /api/messages/:id
});