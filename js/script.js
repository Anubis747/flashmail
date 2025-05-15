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
  cooldownAfter : 15 * 60 * 1_000,     // cooldown for a new account
  apiBase       : 'https://api.flashmail.win',
  inboxDomain   : 'mg.flashmail.win'
};
const inboxDiv = document.querySelector('#mailbox-area .inbox');
const tabs     = document.querySelectorAll('.main-nav .tab');

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
    'about.title': 'About Us',
    'about.p1': 'FlashMail is a fast, privacy-friendly disposable email service designed to help you protect your real inbox from spam, tracking, and unnecessary clutter. We believe everyone deserves simple tools to stay safe online—without giving up convenience.',
    'about.p2': 'Unlike most platforms, we don’t ask for registration, passwords, or personal details. When you click “Create Inbox”, we generate a random address that stays active for 20 minutes. During that time, it can receive messages instantly and anonymously.',
    'about.p3': 'Our entire infrastructure is built to be lightweight, serverless, and secure. FlashMail does not use cookies, does not track your activity, and does not store messages beyond their lifespan. It’s free, open by design, and supported by minimal third-party ads.',
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
    'faq.q6': 'Is FlashMail safe to use?',
    'faq.a6': 'Yes. FlashMail is designed with privacy in mind—no cookies, no tracking, no sign-ups. However, it should not be used for sensitive or important information.',
    'faq.q7': 'Can I use this email to recover accounts or receive private messages?',
    'faq.a7': 'No. Anyone with access to the same inbox link can read incoming messages. Avoid using it for password resets or confidential data.',
    'faq.q8': 'Is there a cooldown between inboxes?',
    'faq.a8': 'Yes. You must wait 15 minutes before creating a new inbox after closing one.',
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
    'confirm.close': 'Close the inbox and delete all messages? Please note you will only be able to open a new inbox after 15 minutes.',
    'nav.terms': 'Terms',
    'nav.contact': 'Contact',
    'terms.title': 'Terms of Use',
    'terms.p1': 'By using FlashMail, you agree to use the service only for lawful purposes. This service is intended for personal use, such as testing websites or avoiding spam.',
    'terms.p2': 'You may not use FlashMail to send unsolicited messages, abuse other services, commit fraud, or engage in illegal activity. Any misuse may result in access being restricted.',
    'terms.p3': 'FlashMail is offered “as-is”, with no guarantees about uptime, email delivery, or long-term availability. We may block, limit, or discontinue access at any time without notice.',
    'footer.rights': '© <span id="year"></span> FlashMail — Privacy-first temporary email'
  },

  /* ---------- Portuguese --------------------------------- */
  pt: {
    title: 'FlashMail',
    'header.title': 'Seu serviço de e‑mail temporário mais fácil.',
    'nav.mailbox': 'Principal',
    'nav.faq': 'FAQ',
    'nav.about': 'Sobre',
    'about.title': 'Sobre Nós',
    'about.p1': 'O FlashMail é um serviço rápido e focado em privacidade que fornece e-mails temporários para ajudar você a proteger sua caixa principal contra spam, rastreamento e mensagens indesejadas. Acreditamos que todos merecem ferramentas simples para manter a segurança online — sem abrir mão da praticidade.',
    'about.p2': 'Diferente da maioria das plataformas, não pedimos cadastro, senhas ou dados pessoais. Ao clicar em “Criar Caixa”, geramos um endereço aleatório válido por 20 minutos. Durante esse tempo, ele pode receber mensagens instantaneamente e de forma anônima.',
    'about.p3': 'Nossa infraestrutura é leve, sem servidores dedicados e feita para ser segura. O FlashMail não usa cookies, não rastreia sua atividade e não armazena mensagens após o tempo expirar. É gratuito, aberto por natureza e sustentado por anúncios discretos de terceiros.',
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
    'faq.q6': 'O FlashMail é seguro de usar?',
    'faq.a6': 'Sim. O FlashMail foi criado com foco em privacidade — sem cookies, sem rastreamento, sem cadastro. No entanto, não deve ser usado para informações sensíveis ou importantes.',
    'faq.q7': 'Posso usar este e-mail para recuperar contas ou receber mensagens privadas?',
    'faq.a7': 'Não. Qualquer pessoa com acesso ao link da caixa pode ler as mensagens recebidas. Evite usar para senhas ou dados confidenciais.',
    'faq.q8': 'Existe um tempo de espera entre as caixas?',
    'faq.a8': 'Sim. É necessário esperar 15 minutos para criar uma nova caixa após fechar a anterior.', 
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
    'confirm.close': 'Encerrar a inbox e apagar todas as mensagens? Você só poderá abrir uma nova caixa após 15 minutos.',
    'nav.terms': 'Termos',
    'nav.contact': 'Contato',
    'terms.title': 'Termos de Uso',
    'terms.p1': 'Ao usar o FlashMail, você concorda em utilizá-lo apenas para fins legais. O serviço é destinado ao uso pessoal, como testar sites ou evitar spam.',
    'terms.p2': 'Você não pode usar o FlashMail para enviar mensagens indesejadas, abusar de outros serviços, cometer fraudes ou realizar atividades ilegais. Qualquer uso indevido pode resultar em restrição de acesso.',
    'terms.p3': 'O FlashMail é fornecido "como está", sem garantias quanto à disponibilidade, entrega de e-mails ou continuidade do serviço. Podemos bloquear, limitar ou encerrar o acesso a qualquer momento, sem aviso prévio.',
    'footer.rights': '© <span id="year"></span> FlashMail — E-mail temporário com foco em privacidade'
  },

  /* ---------- Spanish ------------------------------------ */
  es: {
    title: 'FlashMail',
    'header.title': 'Tu servicio de correo temporal más sencillo.',
    'nav.mailbox': 'Bandeja',
    'nav.faq': 'Preguntas',
    'nav.about': 'Acerca de',
    'about.p1': 'FlashMail es un servicio de correo electrónico temporal rápido y centrado en la privacidad, diseñado para ayudarte a proteger tu bandeja de entrada real del spam, el rastreo y el desorden innecesario. Creemos que todos merecen herramientas simples para mantenerse seguros en línea, sin sacrificar comodidad.',
    'about.p2': 'A diferencia de otras plataformas, no solicitamos registro, contraseñas ni datos personales. Al hacer clic en “Crear Buzón”, generamos una dirección aleatoria válida por 20 minutos. Durante ese tiempo, puede recibir mensajes instantáneamente y de forma anónima.',
    'about.p3': 'Toda nuestra infraestructura está diseñada para ser ligera, sin servidores dedicados y segura. FlashMail no utiliza cookies, no rastrea tu actividad y no almacena mensajes después de su expiración. Es gratuito, abierto por diseño y financiado por anuncios de terceros mínimos.',
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
    'faq.q6': '¿Es seguro usar FlashMail?',
    'faq.a6': 'Sí. FlashMail está diseñado con privacidad en mente: sin cookies, sin seguimiento, sin registros. Sin embargo, no debe usarse para información sensible o importante.',
    'faq.q7': '¿Puedo usar este correo para recuperar cuentas o recibir mensajes privados?',
    'faq.a7': 'No. Cualquier persona con el enlace del buzón puede leer los mensajes. Evita usarlo para contraseñas o información confidencial.',
    'faq.q8': '¿Existe un tiempo de espera entre buzones?',
    'faq.a8': 'Sí. Debes esperar 15 minutos antes de crear un nuevo buzón después de cerrar uno.',
    'about.title': 'Acerca de Nosotros',
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
    'confirm.close': '¿Cerrar la bandeja de entrada y eliminar todos los mensajes? Ten en cuenta que solo podrás abrir una nueva bandeja después de 15 minutos.',
    'nav.terms': 'Términos',
    'nav.contact': 'Contacto',
    'terms.title': 'Términos de Uso',
    'terms.p1': 'Al utilizar FlashMail, aceptas usar el servicio únicamente con fines legales. El servicio está destinado a uso personal, como probar sitios web o evitar el spam.',
    'terms.p2': 'No puedes usar FlashMail para enviar mensajes no solicitados, abusar de otros servicios, cometer fraudes o realizar actividades ilegales. Cualquier mal uso puede resultar en la restricción del acceso.',
    'terms.p3': 'FlashMail se ofrece "tal cual", sin garantías sobre disponibilidad, entrega de correos o continuidad del servicio. Podemos bloquear, limitar o finalizar el acceso en cualquier momento sin previo aviso.',
    'footer.rights': '© <span id="year"></span> FlashMail — Correo temporal centrado en la privacidad'
  },

  /* ---------- French ------------------------------------- */
  fr: {
    title: 'FlashMail',
    'header.title': 'Votre service d’e‑mail temporaire le plus simple.',
    'nav.mailbox': 'Boîte de réception',
    'nav.faq': 'FAQ',
    'nav.about': 'À propos',
    'about.p1': 'FlashMail est un service d’email temporaire rapide et respectueux de la vie privée, conçu pour protéger votre boîte mail principale du spam, du suivi et du désordre numérique. Nous pensons que chacun mérite des outils simples pour rester en sécurité en ligne, sans renoncer à la commodité.',
    'about.p2': 'Contrairement à d’autres plateformes, nous ne demandons ni inscription, ni mot de passe, ni données personnelles. Lorsque vous cliquez sur “Créer une boîte”, nous générons une adresse aléatoire valable pendant 20 minutes. Pendant ce temps, elle peut recevoir des messages instantanément et anonymement.',
    'about.p3': 'Notre infrastructure est légère, sans serveur dédié, et axée sur la sécurité. FlashMail n’utilise pas de cookies, ne suit pas votre activité, et ne stocke pas les messages au-delà de leur durée de vie. C’est gratuit, ouvert par principe, et soutenu par quelques publicités discrètes.',
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
    'faq.q6': 'Est-ce que FlashMail est sûr à utiliser ?',
    'faq.a6': 'Oui. FlashMail est conçu pour respecter la vie privée — pas de cookies, pas de suivi, pas d’inscription. Mais ne l’utilisez pas pour des informations sensibles ou importantes.',
    'faq.q7': 'Puis-je utiliser cet e-mail pour récupérer des comptes ou recevoir des messages privés ?',
    'faq.a7': 'Non. Toute personne ayant accès au lien de la boîte peut lire les messages. Évitez de l’utiliser pour des mots de passe ou données confidentielles.',
    'faq.q8': 'Y a-t-il un délai entre les boîtes ?',
    'faq.a8': 'Oui. Vous devez attendre 15 minutes avant de créer une nouvelle boîte après en avoir fermé une.',
    'about.title': 'À propos de nous',
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
    'confirm.close': 'Fermer la boîte de réception et supprimer tous les messages? Veuillez noter que vous ne pourrez rouvrir une nouvelle boîte qu’au bout de 15 minutes.',
    'nav.terms': 'Conditions',
    'nav.contact': 'Contact',
    'terms.title': 'Conditions d’Utilisation',
    'terms.p1': 'En utilisant FlashMail, vous acceptez de n’utiliser le service que dans un cadre légal. Ce service est destiné à un usage personnel, comme tester des sites ou éviter les spams.',
    'terms.p2': 'Vous ne pouvez pas utiliser FlashMail pour envoyer des messages non sollicités, abuser d’autres services, commettre des fraudes ou participer à des activités illégales. Tout usage abusif peut entraîner une restriction d’accès.',
    'terms.p3': 'FlashMail est fourni "en l’état", sans garantie de disponibilité, de livraison d’e-mails ou de continuité. Nous pouvons bloquer, limiter ou suspendre l’accès à tout moment, sans préavis.',
    'footer.rights': '© <span id="year"></span> FlashMail — E-mail temporaire axé sur la confidentialité'
  },

  /* ---------- German ------------------------------------- */
  de: {
    title: 'FlashMail',
    'header.title': 'Ihr einfachster temporärer E‑Mail‑Dienst.',
    'nav.mailbox': 'Posteingang',
    'nav.faq': 'FAQ',
    'nav.about': 'Über uns',
    'about.p1': 'FlashMail ist ein schneller, datenschutzfreundlicher Wegwerf-E-Mail-Dienst, der Ihnen hilft, Ihr echtes Postfach vor Spam, Tracking und unnötigem Durcheinander zu schützen. Wir glauben, dass jeder einfache Werkzeuge verdient, um sich online sicher zu bewegen — ohne auf Komfort zu verzichten.',
    'about.p2': 'Im Gegensatz zu anderen Plattformen verlangen wir keine Registrierung, kein Passwort und keine persönlichen Daten. Wenn Sie auf „Postfach erstellen“ klicken, generieren wir eine zufällige Adresse, die 20 Minuten lang aktiv bleibt. In dieser Zeit kann sie sofort und anonym Nachrichten empfangen.',
    'about.p3': 'Unsere gesamte Infrastruktur ist leichtgewichtig, serverlos und sicher konzipiert. FlashMail verwendet keine Cookies, verfolgt keine Aktivitäten und speichert keine Nachrichten über ihre Lebensdauer hinaus. Der Dienst ist kostenlos, offen gestaltet und wird durch minimale Drittanbieter-Werbung finanziert.',
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
    'faq.q6': 'Ist FlashMail sicher zu verwenden?',
    'faq.a6': 'Ja. FlashMail wurde mit Fokus auf Datenschutz entwickelt — keine Cookies, kein Tracking, keine Registrierung. Es sollte jedoch nicht für sensible oder wichtige Informationen verwendet werden.',
    'faq.q7': 'Kann ich diese E-Mail-Adresse zum Zurücksetzen von Konten oder für private Nachrichten verwenden?',
    'faq.a7': 'Nein. Jeder mit dem Link zum Postfach kann eingehende Nachrichten lesen. Verwenden Sie es nicht für Passwörter oder vertrauliche Daten.',
    'faq.q8': 'Gibt es eine Wartezeit zwischen Postfächern?',
    'faq.a8': 'Ja. Sie müssen 15 Minuten warten, bevor Sie nach dem Schließen ein neues Postfach erstellen können.',
    'about.title': 'Über uns',
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
    'confirm.close': 'Postfach wirklich schließen und alle Nachrichten löschen? Bitte beachten Sie, dass Sie erst nach 15 Minuten ein neues Postfach öffnen können.',
    'nav.terms': 'Nutzungsbedingungen',
    'nav.contact': 'Kontakt',
    'terms.title': 'Nutzungsbedingungen',
    'terms.p1': 'Durch die Nutzung von FlashMail erklären Sie sich damit einverstanden, den Dienst nur für rechtmäßige Zwecke zu verwenden. Der Dienst ist für den persönlichen Gebrauch gedacht, z. B. zum Testen von Websites oder zum Schutz vor Spam.',
    'terms.p2': 'Sie dürfen FlashMail nicht verwenden, um unerwünschte Nachrichten zu versenden, andere Dienste zu missbrauchen, Betrug zu begehen oder illegale Aktivitäten durchzuführen. Missbrauch kann zur Sperrung führen.',
    'terms.p3': 'FlashMail wird „wie besehen“ bereitgestellt – ohne Garantie für Verfügbarkeit, Zustellung von E-Mails oder langfristige Bereitstellung. Der Zugang kann jederzeit ohne Vorankündigung eingeschränkt oder beendet werden.',
    'footer.rights': '© <span id="year"></span> FlashMail — Temporäre E-Mail mit Fokus auf Datenschutz'
  },

  /* ---------- Russian ------------------------------------ */
  ru: {
    title: 'FlashMail',
    'header.title': 'Самый простой сервис временной электронной почты.',
    'nav.mailbox': 'Входящие',
    'nav.faq': 'FAQ',
    'nav.about': 'О нас',
   'about.p1': 'FlashMail — это быстрый и безопасный одноразовый почтовый сервис, созданный для защиты вашей настоящей почты от спама, слежки и лишнего мусора. Мы считаем, что каждый заслуживает простых инструментов для сохранения конфиденциальности — без жертв удобства.',
    'about.p2': 'В отличие от других платформ, мы не требуем регистрации, пароля или персональных данных. При нажатии на “Создать ящик” генерируется случайный адрес, активный в течение 20 минут. В это время он может анонимно и мгновенно принимать письма.',
    'about.p3': 'Наша инфраструктура легковесна, построена без традиционных серверов и с упором на безопасность. FlashMail не использует cookies, не отслеживает вашу активность и не хранит письма после истечения срока действия. Это бесплатный, открытый по сути сервис, поддерживаемый минимальной сторонней рекламой.',
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
    'faq.q6': 'Безопасно ли использовать FlashMail?',
    'faq.a6': 'Да. FlashMail создан с учетом конфиденциальности — без cookies, без трекинга, без регистрации. Однако не используйте его для важных или чувствительных данных.',
    'faq.q7': 'Можно ли использовать адрес для восстановления паролей или получения личных сообщений?',
    'faq.a7': 'Нет. Любой, у кого есть ссылка на ящик, может прочитать сообщения. Не используйте его для паролей или конфиденциальной информации.',
    'faq.q8': 'Есть ли задержка между созданием ящиков?',
    'faq.a8': 'Да. После закрытия ящика нужно подождать 15 минут, прежде чем создать новый.',
    'about.title': 'О нас',
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
    'confirm.close': 'Закрыть ящик и удалить все сообщения? Обратите внимание, что новый ящик можно будет открыть только через 15 минут.',
    'nav.terms': 'Условия',
    'nav.contact': 'Контакт',
    'terms.title': 'Условия Использования',
    'terms.p1': 'Используя FlashMail, вы соглашаетесь применять его только в законных целях. Сервис предназначен для личного использования, например, для тестирования сайтов или защиты от спама.',
    'terms.p2': 'Вы не можете использовать FlashMail для рассылки спама, злоупотребления другими сервисами, мошенничества или незаконной деятельности. Нарушение правил может привести к ограничению доступа.',
    'terms.p3': 'FlashMail предоставляется "как есть" — без каких-либо гарантий доступности, доставки писем или сохранности сервиса. Мы можем ограничить или прекратить доступ в любой момент без уведомления.',
    'footer.rights': '© <span id="year"></span> FlashMail — Временная почта с приоритетом конфиденциальности'
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
/**
 * Render a list of messages with manual open/close toggles.
 * @param {Array} msgs — array of { subject, sender, body }
 */
function renderMessages(msgs) {
  const box = document.getElementById('messages');
  box.innerHTML = '';

  msgs.forEach(m => {
    // 1. wrapper for summary + detail
    const wrapper = document.createElement('div');
    wrapper.className = 'message-item';

    // 2. summary row with "▼" button
    const summary = document.createElement('div');
    summary.className = 'message-summary';
    summary.innerHTML = `
      <span>
        <strong>${escapeHTML(m.subject || '(no subject)')}</strong> — ${escapeHTML(m.sender)}
      </span>
    `;
    const openBtn = document.createElement('button');
    openBtn.className = 'toggle-arrow';
    openBtn.setAttribute('aria-label', 'Open message');
    openBtn.textContent = '▼';
    summary.appendChild(openBtn);

    // 3. detail view (hidden by default) with "▲" button
    const detail = document.createElement('div');
    detail.className = 'message-detail hidden';
    detail.innerHTML = `
      <button class="toggle-arrow" aria-label="Close message">▲</button>
      <h3>${escapeHTML(m.subject || '(no subject)')}</h3>
      <p><em>From: ${escapeHTML(m.sender)}</em></p>
      <p>${escapeHTML(m.body).replace(/\n/g, '<br>')}</p>
    `;

    // 4. open handler: hide summary, show detail
    openBtn.addEventListener('click', () => {
      summary.classList.add('hidden');
      detail.classList.remove('hidden');
    });

    // 5. close handler: hide detail, show summary
    detail.querySelector('.toggle-arrow').addEventListener('click', () => {
      detail.classList.add('hidden');
      summary.classList.remove('hidden');
    });

    // 6. assemble and append
    wrapper.appendChild(summary);
    wrapper.appendChild(detail);
    box.appendChild(wrapper);
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
async function fetchMessages() {
  if (!currentId) return;
  try {
    const r = await fetch(`${CONFIG.apiBase}/messages/${currentId}`);
    if (!r.ok) throw new Error(r.status);
    const msgs = await r.json();

    // Only re-render when truly new messages arrive
    if (msgs.length > lastCount) {
      toast('toast.newMessage');
      lastCount = msgs.length;
      renderMessages(msgs);
    }
  } catch (e) {
    console.warn('poll error', e);
  }
}

/* ==========================================================
   6.  UI state transitions                                 
   ========================================================== */
/**
 * Clears the current inbox UI and starts the cooldown before
 * allowing the user to create a new inbox.
 */
function clearInbox() {
  resetTimers();            // stop any polling/timers
  inboxActive = false;      // mark inbox as inactive
  currentId   = null;       // clear stored inbox ID
  lastClear   = Date.now(); // record when we cleared

  // Show “Create Inbox” button and disable it for cooldown
  const createBtn = document.getElementById('btn-create');
  createBtn.classList.remove('hidden');
  createBtn.disabled = true;
  createBtn.classList.add('disabled'); // apply .disabled CSS style

  // Re-enable after CONFIG.cooldownAfter milliseconds
  setTimeout(() => {
    createBtn.disabled = false;
    createBtn.classList.remove('disabled');
  }, CONFIG.cooldownAfter);

  // Hide other controls and show closed message
  document.getElementById('btn-close'   ).classList.add('hidden');
  document.getElementById('inbox'       ).classList.add('hidden');
  document.getElementById('timer'       ).classList.add('hidden');
  document.getElementById('messages'    ).innerHTML = '';
  document.getElementById('closed-msg'  ).classList.remove('hidden');
}
/**
 * Starts a new inbox session:
 * - prevents creation if one is already active or if we’re in cooldown
 * - resets any existing timers/pollers
 * - updates the UI (hide “Create”, show “Close”, clear messages)
 * - generates a new inbox ID and displays it
 * - kicks off the countdown timer and message polling
 */
function createInbox() {
  const createBtn = document.getElementById('btn-create');

  // prevent double-click or creating during cooldown
  if (inboxActive || createBtn.disabled) return;

  inboxActive = true;
  resetTimers();  // stop any previous intervals/timeouts

  // hide “Create Inbox” button
  createBtn.classList.add('hidden');
  // show “Close Inbox” button
  document.getElementById('btn-close').classList.remove('hidden');
  // hide the “Inbox closed” message if visible
  document.getElementById('closed-msg').classList.add('hidden');
  // clear out any old messages
  document.getElementById('messages').innerHTML = '';

  // generate and display the new email address
  currentId = makeInboxId();
  document.getElementById('email-address').textContent =
    `${currentId}@${CONFIG.inboxDomain}`;
  // reveal the inbox container
  document.getElementById('inbox').classList.remove('hidden');

  // start the 20-minute countdown and reset message count
  startTimer();
  lastCount = 0;
  // fetch immediately, then poll at the configured interval
  fetchMessages();
  window._poller = setInterval(fetchMessages, CONFIG.pollInterval);
  // auto-close after CONFIG.autoStopAfter milliseconds
  window._stopPoll = setTimeout(clearInbox, CONFIG.autoStopAfter);
}

// Disables the Create button and re-enables after CONFIG.cooldownAfter
function disableCreateButton() {
  const btn = document.getElementById('btn-create');
  btn.disabled = true;
  btn.classList.add('disabled');
  setTimeout(() => {
    btn.disabled = false;
    btn.classList.remove('disabled');
  }, CONFIG.cooldownAfter);
}

/* ==========================================================
   7.  Navigation / section helpers                         
   ========================================================== */
function showSection(id, scroll = false) {
  // 1. hide all the standalone “content” sections (FAQ, About, Privacy)
  document.querySelectorAll('.content').forEach(el => el.classList.add('hidden'));

  // 2. show or hide the inbox panel depending on whether
  //    an inbox is active OR the user explicitly clicked “Inbox”
  if (inboxActive || id === 'mailbox-area') {
    inboxDiv.classList.remove('hidden');
  } else {
    inboxDiv.classList.add('hidden');
  }

  // 3. if the clicked tab is not “Inbox”, reveal that section
  if (id !== 'mailbox-area') {
    const sec = document.getElementById(id);
    if (sec) {
      sec.classList.remove('hidden');
      // optional smooth scroll
      if (scroll) {
        setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  }

  // 4. update the “active” state on your nav buttons
  tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
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
