// Traduções
const i18n = {
  en: {
    title: 'FlashMail',
    'header.title': 'Your easiest temporary email service.',
    'nav.mailbox': 'Inbox',
    'nav.faq': 'FAQ',
    'nav.about': 'About',
    'nav.privacy': 'Privacy',
    'btn.create': 'Create Inbox',
    'inbox.label': 'Your email:',
    'inbox.expires': 'Expires in 20 minutes.',
    'support.title': 'Did you enjoy our service?',
    'support.text': 'Please consider supporting us via the button below.',
    'faq.title': 'FAQ',
    'faq.q1': 'How long does the email address live?',
    'faq.a1': 'Each inbox is valid for 20 minutes by default and then all messages are purged.',
    'faq.q2': 'Can I extend the expiration?',
    'faq.a2': 'Yes—click “Create Inbox” again before it expires.',
    'faq.q3': 'Do you store any personal data?',
    'faq.a3': 'No registration is required. Messages are temporary and deleted.',
    'faq.q4': 'Is this service free?',
    'faq.a4': 'Yes, it’s 100% free and supported by ads.',
    'faq.q5': 'Are there usage limits?',
    'faq.a5': 'No. Create as many inboxes as you want.',
    'about.title': 'About Us',
    'about.text': 'FlashMail is a disposable email service. No login, no tracking. Just privacy.',
    'privacy.title': 'Privacy Policy'
  },
  pt: {
    title: 'FlashMail',
    'header.title': 'Seu serviço de e-mail temporário mais fácil.',
    'nav.mailbox': 'Caixa',
    'nav.faq': 'FAQ',
    'nav.about': 'Sobre',
    'nav.privacy': 'Privacidade',
    'btn.create': 'Criar Caixa',
    'inbox.label': 'Seu e-mail:',
    'inbox.expires': 'Expira em 20 minutos.',
    'support.title': 'Gostou do nosso serviço?',
    'support.text': 'Considere nos apoiar pelo botão abaixo.',
    'faq.title': 'FAQ',
    'faq.q1': 'Quanto tempo o e-mail dura?',
    'faq.a1': 'Cada caixa é válida por 20 minutos e depois é apagada.',
    'faq.q2': 'Posso estender o tempo?',
    'faq.a2': 'Sim—clique em “Criar Caixa” antes de expirar.',
    'faq.q3': 'Vocês armazenam dados pessoais?',
    'faq.a3': 'Não. Nenhum cadastro ou dado pessoal é necessário.',
    'faq.q4': 'O serviço é gratuito?',
    'faq.a4': 'Sim, 100% gratuito e mantido por anúncios.',
    'faq.q5': 'Há limite de uso?',
    'faq.a5': 'Não. Crie quantas caixas quiser.',
    'about.title': 'Sobre Nós',
    'about.text': 'FlashMail é um serviço de e-mail descartável. Sem login, sem rastreio. Só privacidade.',
    'privacy.title': 'Política de Privacidade'
  }
  // Adicione os outros idiomas aqui...
};

// Detectar idioma
let locale = localStorage.getItem('flashmail-lang') ||
             (navigator.language.slice(0,2) in i18n
              ? navigator.language.slice(0,2)
              : 'en');

// Função segura de tradução
function t(key) {
  return i18n[locale]?.[key] || i18n.en[key] || '';
}

// Aplicar traduções
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const txt = t(key);
    if (txt) el.textContent = txt;
  });
}

// Troca de idioma pelo dropdown
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.value = locale;
  langSelect.addEventListener('change', () => {
    locale = langSelect.value;
    localStorage.setItem('flashmail-lang', locale);
    applyTranslations();
  });
}

// Aplicar traduções ao carregar
applyTranslations();

// Navegação por abas
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

const initial = location.hash.slice(1) || 'mailbox-area';
showSection(initial);

// Ano dinâmico no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Simulação de integração com API
document.getElementById('btn-create').addEventListener('click', async () => {
  const email = `user${Math.floor(Math.random() * 10000)}@flashmail.win`;
  const emailEl = document.getElementById('email-address');
  const inboxEl = document.getElementById('inbox');
  const msgList = document.getElementById('messages');

  emailEl.textContent = email;
  inboxEl.classList.remove('hidden');

  // Simular mensagens recebidas
  msgList.innerHTML = `
    <li><strong>Welcome!</strong><br>This is a sample message in your temporary inbox.</li>
    <li><strong>Promo:</strong><br>50% off on nothing. This email will self-destruct in 20 minutes.</li>
  `;
});
