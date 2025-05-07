// script.js
const CONFIG = {
  idPrefix: 'flash',
  idLength: 5,
  pollInterval: 5000,
  autoStopAfter: 20 * 60 * 1000,
  apiBase: 'https://api.flashmail.win',
  inboxDomain: 'mg.flashmail.win'
};
let inboxActive = false;

// i18n translations (inclui privacy.text completo em cada idioma)
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
    'privacy.title': 'Privacy Policy',
    'privacy.text': `
      <p><strong>Effective Date:</strong> May 7, 2025</p>
      <ul>
        <li><strong>No cookies.</strong> We do not use cookies or any browser storage.</li>
        <li><strong>No personal data.</strong> We don’t collect or store any personal information.</li>
        <li><strong>Temporary messages.</strong> Emails live 20 minutes then self‑destruct.</li>
        <li><strong>Ads only.</strong> We show third‑party ads to keep FlashMail free—no trackers, no profiling.</li>
        <li><strong>No tracking.</strong> We do not log your activity beyond basic error/abuse logs.</li>
      </ul>
      <p>That’s it. Enjoy your privacy. 🚀</p>
    `,
    'toast.newMessage': 'New message received',
    'btn.close': 'Close Inbox',
    'inbox.closed': 'Inbox closed. All messages deleted.',
    'confirm.close': 'Close the inbox and delete all messages?'
  },
  pt: {
    title: 'FlashMail',
    'header.title': 'Seu serviço de e-mail temporário mais fácil.',
    'nav.mailbox': 'Principal',
    'nav.faq': 'FAQ',
    'nav.about': 'Sobre',
    'nav.privacy': 'Privacidade',
    'btn.create': 'Criar Email',
    'inbox.label': 'Seu e-mail:',
    'inbox.expires': 'Expira em 20 minutos.',
    'support.title': 'Gostou do nosso serviço?',
    'support.text': 'Considere nos apoiar pelo botão abaixo.',
    'faq.title': 'FAQ',
    'faq.q1': 'Quanto tempo o e-mail dura?',
    'faq.a1': 'Cada caixa de email é válida por 20 minutos e depois é apagada.',
    'faq.q2': 'Posso estender o tempo?',
    'faq.a2': 'Sim—clique em “Criar Email” antes de expirar.',
    'faq.q3': 'Vocês armazenam dados pessoais?',
    'faq.a3': 'Não. Nenhum cadastro ou dado pessoal é necessário.',
    'faq.q4': 'O serviço é gratuito?',
    'faq.a4': 'Sim, 100% gratuito e mantido por anúncios.',
    'faq.q5': 'Há limite de uso?',
    'faq.a5': 'Não. Crie quantas caixas quiser.',
    'about.title': 'Sobre Nós',
    'about.text': 'FlashMail é um serviço de e-mail descartável. Sem login, sem rastreio. Só privacidade.',
    'privacy.title': 'Política de Privacidade',
    'privacy.text': `
      <p><strong>Vigente a partir de:</strong> 7 de maio de 2025</p>
      <ul>
        <li><strong>Sem cookies.</strong> Não usamos cookies nem armazenamos nada no navegador.</li>
        <li><strong>Sem dados pessoais.</strong> Não coletamos ou armazenamos informações pessoais.</li>
        <li><strong>Mensagens temporárias.</strong> Os e‑mails duram 20 minutos e são autodestruídos.</li>
        <li><strong>Apenas anúncios.</strong> Mostramos anúncios de terceiros—sem rastreadores, sem perfilamento.</li>
        <li><strong>Sem rastreamento.</strong> Não registramos sua atividade além de logs de erro/abuso.</li>
      </ul>
      <p>É isso. Aproveite sua privacidade. 🚀</p>
    `,
    'toast.newMessage': 'Nova mensagem recebida',
    'btn.close': 'Encerrar Caixa',
    'inbox.closed': 'Caixa encerrada. Todas as mensagens foram apagadas.',
    'confirm.close': 'Encerrar a inbox e apagar todas as mensagens?'
  },
  es: {
    title: 'FlashMail',
    'header.title': 'Tu servicio de correo temporal más sencillo.',
    'nav.mailbox': 'Bandeja',
    'nav.faq': 'Preguntas',
    'nav.about': 'Acerca de',
    'nav.privacy': 'Privacidad',
    'btn.create': 'Crear bandeja',
    'inbox.label': 'Tu correo:',
    'inbox.expires': 'Expira en 20 minutos.',
    'support.title': '¿Te gustó nuestro servicio?',
    'support.text': 'Considera apoyarnos con el botón de abajo.',
    'faq.title': 'Preguntas Frecuentes',
    'faq.q1': '¿Cuánto tiempo está activa la bandeja de entrada?',
    'faq.a1': 'Cada bandeja está activa por 20 minutos y luego se elimina automáticamente.',
    'faq.q2': '¿Puedo extender el tiempo?',
    'faq.a2': 'Sí, haz clic en “Crear bandeja” antes de que expire.',
    'faq.q3': '¿Almacenan datos personales?',
    'faq.a3': 'No. No se requiere registro ni se almacenan datos personales.',
    'faq.q4': '¿El servicio es gratuito?',
    'faq.a4': 'Sí, completamente gratuito y financiado con anuncios.',
    'faq.q5': '¿Hay límites de uso?',
    'faq.a5': 'No. Puedes crear tantas bandejas como quieras.',
    'about.title': 'Acerca de Nosotros',
    'about.text': 'FlashMail es un servicio de correo desechable. Sin registros, sin seguimiento. Solo privacidad.',
    'privacy.title': 'Política de Privacidad',
    'privacy.text': `
      <p><strong>Fecha de vigencia:</strong> 7 de mayo de 2025</p>
      <ul>
        <li><strong>Sin cookies.</strong> No usamos cookies ni storage.</li>
        <li><strong>Sin datos personales.</strong> No recopilamos ni almacenamos información personal.</li>
        <li><strong>Mensajes temporales.</strong> Los correos duran 20 minutos y luego se eliminan.</li>
        <li><strong>Solo anuncios.</strong> Mostramos anuncios de terceros—sin rastreadores ni perfiles.</li>
        <li><strong>Sin seguimiento.</strong> No registramos tu actividad más allá de errores/abuso.</li>
      </ul>
      <p>Eso es todo. Disfruta tu privacidad. 🚀</p>
    `,
    'toast.newMessage': 'Nuevo mensaje recibido',
    'btn.close': 'Cerrar bandeja',
    'inbox.closed': 'Bandeja cerrada. Todos los mensajes fueron eliminados.',
    'confirm.close': '¿Cerrar la bandeja de entrada y eliminar todos los mensajes?'
  },
  fr: {
    title: 'FlashMail',
    'header.title': 'Votre service d’e-mail temporaire le plus simple.',
    'nav.mailbox': 'Boîte de réception',
    'nav.faq': 'FAQ',
    'nav.about': 'À propos',
    'nav.privacy': 'Confidentialité',    'btn.create': 'Créer une boîte',
    'inbox.label': 'Votre e-mail :',
    'inbox.expires': 'Expire dans 20 minutes.',
    'support.title': 'Vous aimez notre service ?',
    'support.text': 'Merci de nous soutenir en cliquant sur le bouton ci-dessous.',
    'faq.title': 'Foire aux questions',
    'faq.q1': 'Combien de temps la boîte de réception reste‑t‑elle active ?',
    'faq.a1': 'Chaque boîte est active pendant 20 minutes, puis les messages sont supprimés.',
    'faq.q2': 'Puis‑je prolonger la durée ?',
    'faq.a2': 'Oui — cliquez sur “Créer une boîte” avant l’expiration.',
    'faq.q3': 'Enregistrez‑vous des données personnelles ?',
    'faq.a3': 'Non. Aucune inscription ni collecte de données personnelles.',
    'faq.q4': 'Le service est‑il gratuit ?',
    'faq.a4': 'Oui, totalement gratuit et financé par la publicité.',
    'faq.q5': 'Y a‑t‑il une limite d’utilisation ?',
    'faq.a5': 'Non. Vous pouvez créer autant de boîtes que vous le souhaitez.',
    'about.title': 'À propos de nous',
    'about.text': 'FlashMail est un service de messagerie jetable. Pas d’inscription, pas de suivi. Juste de la confidentialité.',
    'privacy.title': 'Politique de confidentialité',
    'privacy.text': `
      <p><strong>Date d’effet :</strong> 7 mai 2025</p>
      <ul>
        <li><strong>Aucun cookie.</strong> Nous n’utilisons pas de cookies ni de stockage local.</li>
        <li><strong>Aucune donnée personnelle.</strong> Nous ne collectons ni ne stockons d’informations personnelles.</li>
        <li><strong>Messages temporaires.</strong> Les e‑mails durent 20 minutes puis sont supprimés.</li>
        <li><strong>Uniquement des pubs.</strong> Nous affichons des publicités de tiers—sans traceurs, sans profilage.</li>
        <li><strong>Aucun suivi.</strong> Nous n’enregistrons pas votre activité au‑delà des erreurs/abus.</li>
      </ul>
      <p>C’est tout. Profitez de votre confidentialité. 🚀</p>
    `,
    'toast.newMessage': 'Nouveau message reçu',
    'btn.close': 'Fermer la boîte',
    'inbox.closed': 'Boîte fermée. Tous les messages ont été supprimés.',
    'confirm.close': 'Fermer la boîte de réception et supprimer tous les messages ?'
  },
  de: {
    title: 'FlashMail',
    'header.title': 'Ihr einfachster temporärer E‑Mail‑Dienst.',
    'nav.mailbox': 'Posteingang',
    'nav.faq': 'FAQ',
    'nav.about': 'Über uns',
    'nav.privacy': 'Datenschutz',
    'btn.create': 'Postfach erstellen',
    'inbox.label': 'Ihre E‑Mail:',
    'inbox.expires': 'Läuft in 20 Minuten ab.',
    'support.title': 'Hat Ihnen unser Service gefallen?',
    'support.text': 'Bitte unterstützen Sie uns über den Button unten.',
    'faq.title': 'Häufig gestellte Fragen',
    'faq.q1': 'Wie lange ist das Postfach aktiv?',
    'faq.a1': 'Jedes Postfach ist 20 Minuten aktiv, dann werden alle Nachrichten gelöscht.',
    'faq.q2': 'Kann ich die Zeit verlängern?',
    'faq.a2': 'Ja – klicken Sie vor Ablauf erneut auf „Postfach erstellen“.',
    'faq.q3': 'Speichern Sie persönliche Daten?',
    'faq.a3': 'Nein. Keine Registrierung, keine Datenspeicherung.',
    'faq.q4': 'Ist der Service kostenlos?',
    'faq.a4': 'Ja, völlig kostenlos und werbefinanziert.',
    'faq.q5': 'Gibt es Einschränkungen?',
    'faq.a5': 'Nein. Sie können beliebig viele Postfächer erstellen.',
    'about.title': 'Über uns',
    'about.text': 'FlashMail ist ein temporärer E‑Mail‑Dienst. Kein Login, kein Tracking – nur Privatsphäre.',
    'privacy.title': 'Datenschutzerklärung',
    'privacy.text': `
      <p><strong>Gültig ab:</strong> 7. Mai 2025</p>
      <ul>
        <li><strong>Keine Cookies.</strong> Wir verwenden keine Cookies oder lokalen Speicher.</li>
        <li><strong>Keine persönlichen Daten.</strong> Wir erfassen oder speichern keine persönlichen Informationen.</li>
        <li><strong>Temporäre Nachrichten.</strong> E‑Mails leben 20 Minuten und werden dann gelöscht.</li>
        <li><strong>Nur Werbung.</strong> Wir zeigen Werbung von Drittanbietern—ohne Tracker oder Profiling.</li>
        <li><strong>Kein Tracking.</strong> Wir protokollieren Ihre Aktivitäten nicht außer bei Fehlern/Abuse.</li>
      </ul>
      <p>Das war’s. Genieße deine Privatsphäre. 🚀</p>
    `,
    'toast.newMessage': 'Neue Nachricht erhalten',
    'btn.close': 'Postfach schließen',
    'inbox.closed': 'Postfach geschlossen. Alle Nachrichten wurden gelöscht.',
    'confirm.close': 'Postfach wirklich schließen und alle Nachrichten löschen?'
  },
  ru: {
    title: 'FlashMail',
    'header.title': 'Самый простой сервис временной электронной почты.',
    'nav.mailbox': 'Входящие',
    'nav.faq': 'FAQ',
    'nav.about': 'О нас',
    'nav.privacy': 'Конфиденциальность',
    'btn.create': 'Создать ящик',
    'inbox.label': 'Ваш e‑mail:',
    'inbox.expires': 'Срок действия — 20 минут.',
    'support.title': 'Понравился наш сервис?',
    'support.text': 'Поддержите нас, нажав на кнопку ниже.',
    'faq.title': 'Часто задаваемые вопросы',
    'faq.q1': 'Сколько действует адрес электронной почты?',
    'faq.a1': 'Каждый ящик работает 20 минут, затем все сообщения удаляются.',
    'faq.q2': 'Можно ли продлить срок?',
    'faq.a2': 'Да – нажмите «Создать ящик» ещё раз до окончания срока.',
    'faq.q3': 'Вы сохраняете личные данные?',
    'faq.a3': 'Нет. Регистрация не требуется, данные не сохраняются.',
    'faq.q4': 'Сервис бесплатный?',
    'faq.a4': 'Да, полностью бесплатный и поддерживается рекламой.',
    'faq.q5': 'Есть ограничения?',
    'faq.a5': 'Нет. Можно создавать неограниченное количество ящиков.',
    'about.title': 'О нас',
    'about.text': 'FlashMail — это одноразовая электронная почта. Без регистрации, без слежки. Только конфиденциальность.',
    'privacy.title': 'Политика конфиденциальности',
    'privacy.text': `
      <p><strong>Дата вступления в силу:</strong> 7 мая 2025 г.</p>
      <ul>
        <li><strong>Без куки.</strong> Мы не используем куки и не храним данные в браузере.</li>
        <li><strong>Без личных данных.</strong> Мы не собираем и не храним личную информацию.</li>
        <li><strong>Временные сообщения.</strong> Сообщения удаляются через 20 минут.</li>
        <li><strong>Только реклама.</strong> Мы показываем рекламу без трекеров и профилирования.</li>
        <li><strong>Без отслеживания.</strong> Мы не ведём логи активности, кроме ошибок/злоупотреблений.</li>
      </ul>
      <p>Вот и всё. Наслаждайтесь конфиденциальностью. 🚀</p>
    `,
    'toast.newMessage': 'Получено новое сообщение',
    'btn.close': 'Закрыть ящик',
    'inbox.closed': 'Ящик закрыт. Все сообщения удалены.',
    'confirm.close': 'Закрыть ящик и удалить все сообщения?'
  }
};

// Locale helpers
function getLocale(code) {
  return i18n[code] ? code : 'en';
}
let savedLang = localStorage.getItem('flashmail-lang') || 'en';
let locale    = getLocale(savedLang);

function t(key) {
  return i18n[locale]?.[key] || i18n.en[key] || '';
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const txt = t(el.getAttribute('data-i18n'));
    if (txt) el.innerHTML = txt;
  });
}

// Language switcher
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.value = savedLang;
  langSelect.addEventListener('change', () => {
    localStorage.setItem('flashmail-lang', langSelect.value);
    locale = getLocale(langSelect.value);
    applyTranslations();
  });
}
applyTranslations();

// Tab navigation (sem alterações)

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Toast notification
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 3000);
}

// Tab navigation
const tabs     = document.querySelectorAll('.main-nav .tab');
const sections = document.querySelectorAll('.content, .inbox');
function showSection(id, scroll = false) {
  sections.forEach(s => s.classList.add('hidden'));
  if (id === 'mailbox-area') {
    document.querySelector('#mailbox-area .inbox').classList.remove('hidden');
  }
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('hidden');
    if (scroll) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
}
tabs.forEach(tab => {
  tab.addEventListener('click', e => {
    e.preventDefault();
    const tgt = tab.dataset.target;
    history.replaceState(null, '', `#${tgt}`);
    showSection(tgt, true);
  });
});
showSection(location.hash.slice(1) || 'mailbox-area');

// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Helpers for inbox
function makeInboxId() {
  const num = Math.floor(Math.random() * Math.pow(10, CONFIG.idLength));
  return CONFIG.idPrefix + String(num).padStart(CONFIG.idLength, '0');
}

// XSS-safe escape
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Toast notification
function showToast() {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = t('toast.newMessage');
  toast.classList.remove('hidden');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 3000);
}

// Timer
let remaining, timerInterval;
function startTimer() {
  remaining = CONFIG.autoStopAfter / 1000;
  const timerEl = document.getElementById('timer');
  timerEl.classList.remove('hidden');
  timerEl.textContent = formatTime(remaining);
  timerInterval = setInterval(() => {
    remaining--;
    if (remaining <= 0) clearInbox();
    timerEl.textContent = formatTime(remaining);
  }, 1000);
}
function formatTime(sec) {
  const m = String(Math.floor(sec/60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Close inbox
function clearInbox() {
  inboxActive = false;
  clearInterval(window._poller);
  clearTimeout(window._stopPoll);
  clearInterval(timerInterval);
  document.getElementById('inbox').classList.add('hidden');
  document.getElementById('btn-close').classList.add('hidden');
  document.getElementById('timer').classList.add('hidden');
  document.getElementById('messages').innerHTML = '';
  document.getElementById('closed-msg').classList.remove('hidden');
}

// Render messages with summary/detail toggle
function renderMessages(msgs, inboxId) {
  const container = document.getElementById('messages');
  container.innerHTML = '';
  msgs.forEach(msg => {
    const summary = document.createElement('div');
    summary.className = 'message-summary';
    summary.innerHTML = `
      <span><strong>${escapeHTML(msg.subject || '(no subject)')}</strong> — ${escapeHTML(msg.sender)}</span>
      <span>▼</span>
    `;
    summary.onclick = () => {
      const detail = document.createElement('div');
      detail.className = 'message-detail';
      detail.innerHTML = `
        <h3>${escapeHTML(msg.subject || '(no subject)')}</h3>
        <p><em>From: ${escapeHTML(msg.sender)}</em></p>
        <p>${escapeHTML(msg.body).replace(/\n/g,'<br>')}</p>
        <div class="msg-actions">
          <button class="btn-reply">Responder</button>
          <button class="btn-forward">Encaminhar</button>
          <button class="btn-delete">Excluir</button>
        </div>
      `;
      detail.querySelector('.btn-reply').onclick = () => {
        window.location.href =
          `mailto:${msg.sender}` +
          `?subject=${encodeURIComponent('Re: ' + (msg.subject||''))}` +
          `&body=${encodeURIComponent('\n\n---\n' + msg.body)}`;
      };
      detail.querySelector('.btn-forward').onclick = () => {
        const to = prompt('Encaminhar para:');
        if (!to) return;
        window.location.href =
          `mailto:${to}` +
          `?subject=${encodeURIComponent('Fwd: ' + (msg.subject||''))}` +
          `&body=${encodeURIComponent('De: '+msg.sender+'\n\n'+msg.body)}`;
      };
      detail.querySelector('.btn-delete').onclick = () => {
        detail.remove();
      };
      summary.replaceWith(detail);
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    container.appendChild(summary);
  });
}

// Create inbox & start polling
let lastCount = 0;
document.getElementById('btn-create').addEventListener('click', () => {
  if (inboxActive) return; // Evita múltiplas caixas
  inboxActive = true;

  document.getElementById('closed-msg').classList.add('hidden');
  document.getElementById('btn-close').classList.remove('hidden');
  document.getElementById('messages').innerHTML = '';

  const inboxId = makeInboxId();
  document.getElementById('email-address').textContent = `${inboxId}@${CONFIG.inboxDomain}`;
  document.getElementById('inbox').classList.remove('hidden');

  clearInbox();
  startTimer();
  lastCount = 0;

  window._poller = setInterval(async () => {
    try {
      const res = await fetch(`${CONFIG.apiBase}/messages/${inboxId}`);
      if (!res.ok) throw new Error(res.status);
      const msgs = await res.json();

      if (msgs.length > lastCount) {
        showToast();
        lastCount = msgs.length;
      }
      renderMessages(msgs, inboxId);
    } catch (err) {
      console.warn('Polling error (ignored):', err);
    }
  }, CONFIG.pollInterval);

  window._stopPoll = setTimeout(clearInbox, CONFIG.autoStopAfter);
});


document.getElementById('btn-close').addEventListener('click', () => {
  const msg = t('confirm.close');
  if (window.confirm(msg)) {
    clearInbox();
  }
});

