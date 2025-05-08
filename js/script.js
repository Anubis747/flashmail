/* ==========================================================
   FlashMail – client script                                  
   (full file – nothing omitted)                              
   ========================================================== */

/* ----------------------------------------------------------
   0.  Global configuration                                  
   ---------------------------------------------------------- */
const CONFIG = {
  idPrefix      : 'flash',             // random inbox id prefix
  idLength      : 5,                   // # of random digits
  pollInterval  : 5_000,               // ms between API polls
  autoStopAfter : 20 * 60 * 1_000,     // inbox lifetime (20 min)
  apiBase       : 'https://api.flashmail.win',
  inboxDomain   : 'mg.flashmail.win'
};

/* ----------------------------------------------------------
   1.  Translations                                          
   (full object – ALL languages)                            
   ---------------------------------------------------------- */
const i18n = {
  en: {
    title: 'FlashMail',
    'header.title': 'Your easiest temporary email service.',
    'nav.mailbox': 'Inbox',
    'nav.faq': 'FAQ',
    'nav.about': 'About',
    'copied': 'Copied to clipboard',
    'nav.privacy': 'Privacy',
    'inbox.startHint': 'Click the button below to start',
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

  /* ---------- Portuguese --------------------------------- */
  pt: {
    title: 'FlashMail',
    'header.title': 'Seu serviço de e‑mail temporário mais fácil.',
    'nav.mailbox': 'Principal',
    'nav.faq': 'FAQ',
    'nav.about': 'Sobre',
    'copied': 'Copiado para a área de transferência',
    'nav.privacy': 'Privacidade',
    'inbox.startHint': 'Clique no botão abaixo para iniciar',
    'btn.create': 'Criar Email',
    'inbox.label': 'Seu e‑mail:',
    'inbox.expires': 'Expira em 20 minutos.',
    'support.title': 'Gostou do nosso serviço?',
    'support.text': 'Considere nos apoiar pelo botão abaixo.',
    'faq.title': 'FAQ',
    'faq.q1': 'Quanto tempo o e‑mail dura?',
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
    'about.text': 'FlashMail é um serviço de e‑mail descartável. Sem login, sem rastreio. Só privacidade.',
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

  /* ---------- Spanish ------------------------------------ */
  es: {
    title: 'FlashMail',
    'header.title': 'Tu servicio de correo temporal más sencillo.',
    'nav.mailbox': 'Bandeja',
    'nav.faq': 'Preguntas',
    'nav.about': 'Acerca de',
    'nav.privacy': 'Privacidad',
    'inbox.startHint': 'Haz clic en el botón de abajo para comenzar',
    'btn.create': 'Crear bandeja',
    'inbox.label': 'Tu correo:',
    'inbox.expires': 'Expira en 20 minutos.',
    'copied': 'Copiado al portapapeles',
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

  /* ---------- French ------------------------------------- */
  fr: {
    title: 'FlashMail',
    'header.title': 'Votre service d’e‑mail temporaire le plus simple.',
    'nav.mailbox': 'Boîte de réception',
    'nav.faq': 'FAQ',
    'nav.about': 'À propos',
    'nav.privacy': 'Confidentialité',
    'inbox.startHint': 'Cliquez sur le bouton ci-dessous pour démarrer',
    'btn.create': 'Créer une boîte',
    'inbox.label': 'Votre e‑mail :',
    'inbox.expires': 'Expire dans 20 minutes.',
    'support.title': 'Vous aimez notre service ?',
    'copied': 'Copié dans le presse-papiers',
    'support.text': 'Merci de nous soutenir en cliquant sur le bouton ci‑dessous.',
    'faq.title': 'Foire aux questions',
    'faq.q1': 'Combien de temps la boîte de réception reste‑t‑elle active ?',
    'faq.a1': 'Chaque boîte est active pendant 20 minutes, puis les messages sont supprimés.',
    'faq.q2': 'Puis‑je prolonger la durée ?',
    'faq.a2': 'Oui — cliquez sur « Créer une boîte » avant l’expiration.',
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
      <p><strong>Date d’effet :</strong> 7 mai 2025</p>
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

  /* ---------- German ------------------------------------- */
  de: {
    title: 'FlashMail',
    'header.title': 'Ihr einfachster temporärer E‑Mail‑Dienst.',
    'nav.mailbox': 'Posteingang',
    'nav.faq': 'FAQ',
    'nav.about': 'Über uns',
    'nav.privacy': 'Datenschutz',
    'inbox.startHint': 'Klicken Sie auf die Schaltfläche unten, um zu starten',
    'btn.create': 'Postfach erstellen',
    'inbox.label': 'Ihre E‑Mail:',
    'inbox.expires': 'Läuft in 20 Minuten ab.',
    'support.title': 'Hat Ihnen unser Service gefallen?',
    'support.text': 'Bitte unterstützen Sie uns über den Button unten.',
    'faq.title': 'Häufig gestellte Fragen',
    'faq.q1': 'Wie lange ist das Postfach aktiv?',
    'toast.copied': 'Adresse kopiert!',
    'faq.a1': 'Jedes Postfach ist 20 Minuten aktiv, dann werden alle Nachrichten gelöscht.',
    'faq.q2': 'Kann ich die Zeit verlängern?',
    'faq.a2': 'Ja – klicken Sie vor Ablauf erneut auf „Postfach erstellen“. ',
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
      <p><strong>Gültig ab:</strong> 7. Mai 2025</p>
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
    'copied': 'In die Zwischenablage kopiert',
    'btn.close': 'Postfach schließen',
    'inbox.closed': 'Postfach geschlossen. Alle Nachrichten wurden gelöscht.',
    'confirm.close': 'Postfach wirklich schließen und alle Nachrichten löschen?'
  },

  /* ---------- Russian ------------------------------------ */
  ru: {
    title: 'FlashMail',
    'header.title': 'Самый простой сервис временной электронной почты.',
    'nav.mailbox': 'Входящие',
    'nav.faq': 'FAQ',
    'nav.about': 'О нас',
    'nav.privacy': 'Конфиденциальность',
    'inbox.startHint': 'Нажмите кнопку ниже, чтобы начать',
    'btn.create': 'Создать ящик',
    'inbox.label': 'Ваш e‑mail:',
    'inbox.expires': 'Срок действия — 20 минут.',
    'support.title': 'Понравился наш сервис?',
    'support.text': 'Поддержите нас, нажав на кнопку ниже.',
    'faq.title': 'Часто задаваемые вопросы',
    'toast.copied': 'Адрес скопирован!',
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
      <p><strong>Дата вступления в силу:</strong> 7 мая 2025 г.</p>
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
    'copied': 'Скопировано в буфер обмена',
    'btn.close': 'Закрыть ящик',
    'inbox.closed': 'Ящик закрыт. Все сообщения удалены.',
    'confirm.close': 'Закрыть ящик и удалить все сообщения?'
  }
};

/* ==========================================================
   2.  Pure helper functions (no DOM access)                 
   ========================================================== */
function getLocale(code){ return i18n[code] ? code : 'en'; }
let savedLang = localStorage.getItem('flashmail-lang') || 'en';
let locale    = getLocale(savedLang);

function t(key){ return i18n[locale]?.[key] || i18n.en[key] || ''; }

function makeInboxId(){
  const n = Math.floor(Math.random() * 10**CONFIG.idLength);
  return CONFIG.idPrefix + String(n).padStart(CONFIG.idLength,'0');
}

function escapeHTML(s){
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
function formatTime(sec){
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec%60).padStart(2,'0');
  return `${m}:${s}`;
}

/* ==========================================================
   3.  Runtime state                                        
   ========================================================== */
let inboxActive   = false;     // prevents concurrent inboxes
let currentId     = null;      // currently active inbox ID
let lastCount     = 0;         // # msgs already displayed
let timerInterval = null;      // countdown setInterval
let _poller = null, _stopPoll = null;  // polling timers

function resetTimers(){
  if(_poller)   clearInterval(_poller);
  if(_stopPoll) clearTimeout(_stopPoll);
  if(timerInterval) clearInterval(timerInterval);
  _poller = _stopPoll = timerInterval = null;
}

/* ==========================================================
   4.  DOM‑dependent helpers                                
   ========================================================== */
function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const txt = t(el.getAttribute('data-i18n'));
    if(txt) el.innerHTML = txt;
  });
}

/* ------------------ toast ------------------------------- */
function toast(textKey){
  const el = document.getElementById('toast');
  if(!el) return;
  el.textContent = t(textKey);
  el.classList.remove('hidden'); el.classList.add('show');
  el.onclick = ()=>{ el.classList.remove('show'); el.classList.add('hidden'); el.onclick=null; };
}

function copyEmail() {
  const addr = document.getElementById('email-address').textContent;
  if (!addr) return;
  navigator.clipboard.writeText(addr).then(() => {
    toast('copied');  // see translations for 'copied'
  });
}
// attach listener after rendering the inbox
document.getElementById('btn-copy').addEventListener('click', copyEmail);

/* ------------------ message list ------------------------ */
function renderMessages(msgs){
  const box = document.getElementById('messages');
  box.innerHTML='';
  msgs.forEach(m=>{
    const line=document.createElement('div');
    line.className='message-summary';
    line.innerHTML=`<span><strong>${escapeHTML(m.subject||'(no subject)')}</strong> — ${escapeHTML(m.sender)}</span><span>▼</span>`;
    line.onclick=()=>{
      const det=document.createElement('div');
      det.className='message-detail';
      det.innerHTML=`<h3>${escapeHTML(m.subject||'(no subject)')}</h3><p><em>${escapeHTML(m.sender)}</em></p><p>${escapeHTML(m.body).replace(/\n/g,'<br>')}</p>`;
      line.replaceWith(det);
      det.scrollIntoView({behavior:'smooth',block:'start'});
    };
    box.appendChild(line);
  });
}

/* ------------------ countdown timer --------------------- */
function startTimer(){
  const tEl=document.getElementById('timer');
  let remain=CONFIG.autoStopAfter/1_000;
  tEl.classList.remove('hidden');
  tEl.textContent=formatTime(remain);
  timerInterval=setInterval(()=>{
    remain--;
    if(remain<=0) clearInbox();
    tEl.textContent=formatTime(remain);
  },1_000);
}

/* ==========================================================
   5.  API polling                                          
   ========================================================== */
async function fetchMessages(){
  if(!currentId)return;
  try{
    const r=await fetch(`${CONFIG.apiBase}/messages/${currentId}`);
    if(!r.ok) throw new Error(r.status);
    const msgs=await r.json();
    if(msgs.length>lastCount){ toast('toast.newMessage'); lastCount=msgs.length;}
    renderMessages(msgs);
  }catch(e){ console.warn('poll error',e); }
}

/* ==========================================================
   6.  UI state transitions                                 
   ========================================================== */
function clearInbox(){
  resetTimers();
  inboxActive=false; currentId=null;
  document.getElementById('btn-create').classList.remove('hidden');
  document.getElementById('btn-close' ).classList.add   ('hidden');
  document.getElementById('inbox'     ).classList.add   ('hidden');
  document.getElementById('timer'     ).classList.add   ('hidden');
  document.getElementById('messages'  ).innerHTML='';
  document.getElementById('closed-msg').classList.remove('hidden');
}

function createInbox(){
  if(inboxActive) return;
  inboxActive=true; resetTimers();

  document.getElementById('btn-create').classList.add   ('hidden');
  document.getElementById('btn-close' ).classList.remove('hidden');
  document.getElementById('closed-msg').classList.add   ('hidden');
  document.getElementById('messages'  ).innerHTML='';

  currentId=makeInboxId();
  document.getElementById('email-address').textContent=`${currentId}@${CONFIG.inboxDomain}`;
  document.getElementById('inbox').classList.remove('hidden');

  startTimer(); lastCount=0; fetchMessages();
  _poller=setInterval(fetchMessages,CONFIG.pollInterval);
  _stopPoll=setTimeout(clearInbox,CONFIG.autoStopAfter);
}

/* ==========================================================
   7.  Navigation / section helpers                         
   ========================================================== */
function showSection(id,scroll=false){
  document.querySelectorAll('.content, .inbox').forEach(s=>s.classList.add('hidden'));
    if (inboxActive) {
    inboxDiv.classList.remove('hidden');
  } else {
    inboxDiv.classList.add('hidden');
  }
  const sec=document.getElementById(id);
  if(sec){
    sec.classList.remove('hidden');
    if(scroll){ setTimeout(()=>sec.scrollIntoView({behavior:'smooth',block:'start'}),50);}
  }
  document.querySelectorAll('.main-nav .tab').forEach(t=>t.classList.toggle('active',t.dataset.target===id));
}

/* ==========================================================
   8.  DOMContentLoaded – single entry point                
   ========================================================== */
window.addEventListener('DOMContentLoaded',()=>{
  /* translations + static text */
  applyTranslations();
  document.getElementById('year').textContent=new Date().getFullYear();

  /* language switcher */
  const langSel=document.getElementById('lang-select');
  langSel.value=savedLang;
  langSel.addEventListener('change',()=>{
    localStorage.setItem('flashmail-lang',langSel.value);
    locale=getLocale(langSel.value); applyTranslations();
  });

  /* buttons */
  document.getElementById('btn-copy').addEventListener('click', copyEmail);
  document.getElementById('btn-create').addEventListener('click',createInbox);
  document.getElementById('btn-close' ).addEventListener('click',()=>{ if(confirm(t('confirm.close'))) clearInbox(); });

  /* nav tabs */
  document.querySelectorAll('.main-nav .tab').forEach(tab=>tab.addEventListener('click',e=>{
    e.preventDefault(); const tgt=e.currentTarget.dataset.target; history.replaceState(null,'',`#${tgt}`); showSection(tgt,true);
  }));

  /* open right section on load */
  showSection(location.hash.slice(1)||'mailbox-area');
});
