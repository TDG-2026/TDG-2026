import { pricing, genie } from './config.js';

export const MAIN_CHIPS = ['features', 'pricing', 'install', 'demo', 'support'];
export const GDS_LABELS = { '1A': 'Amadeus (1A)', '1G': 'Travelport (1G)', '1S': 'Sabre (1S)' };
export const GDS_ALIASES = {
  '1A': ['amadeus', '1a', 'altea'],
  '1G': ['travelport', 'galileo', 'apollo', 'worldspan', 'smartpoint', '1g', '1p', '1v'],
  '1S': ['sabre', 'abacus', '1s'],
};

// Synthetic examples mirrored from the website demo. Verify against your GDS before use.
export const gdsEntries = {
  docs: {
    '1A': 'SRDOCS YY HK1-P-PAK-AB1234567-PAK-01JAN90-M-31DEC30-KHAN-AHMED/P1',
    '1G': 'SI.P1/SSRDOCSYYHK1/P/PAK/AB1234567/PAK/01JAN90/M/31DEC30/KHAN/AHMED',
    '1S': '3DOCS/P/PAK/AB1234567/PAK/01JAN90/M/31DEC30/KHAN/AHMED-1.1',
  },
  ctcm: {
    '1A': 'SR CTCM YY HK1-923000000000/P1',
    '1G': 'SI.P1/SSRCTCMYYHK1/923000000000',
    '1S': '3CTCM/923000000000-1.1',
  },
  ctce: {
    '1A': 'SR CTCE YY HK1-AHMED.KHAN//EXAMPLE.COM/P1',
    '1G': 'SI.P1/SSRCTCEYYHK1/AHMED.KHAN//EXAMPLE.COM',
    '1S': '3CTCE/AHMED.KHAN//EXAMPLE.COM-1.1',
  },
};

const CODE_NOTE = { en: 'Illustrative synthetic examples. Verify formats against your GDS before use.' };
const usd = (n) => `$${n}`;
// Values filled into {placeholders}; the sentences around them are translated through the website catalog.
const PRICE_VARS = { monthly: usd(pricing.monthly), yearly: usd(pricing.yearly), regular: usd(pricing.yearlyRegular), save: usd(pricing.yearlyRegular - pricing.yearly) };

// Order matters: on equal scores, the earlier (more specific) intent wins.
// To hand-translate an answer, add e.g. answer: { en: '…', ur: '…' }. Otherwise the website catalog translation is used.
export const intents = [
  {
    id: 'visaPhoto', label: { en: 'Visa photo tool' }, handoff: 'Visa photo tool', followUps: ['features', 'demo', 'pricing'],
    keywords: ['photo', 'picture', 'visa photo', 'passport photo', 'headshot', '35x45', 'photo quality', 'enhance', 'enhancer', 'rotate', 'align', 'foto', 'bild', '照片', '写真', '사진', 'รูป', 'ảnh', 'फोटो', 'ছবি', 'фото', 'zdjęcie', 'صورة', 'تصویر', 'عکس', 'انځور', 'surat'],
    answer: { en: `**Visa & passport photo tool**
• Drag guides to the crown and chin, or fit the head to 75% in one click.
• Straighten in 0.5° steps or rotate 90° to align a tilted photo.
• Improve a dull or soft photo with the quality enhancer.
• A checklist measures the final JPEG: pixel size, 35:45 ratio, file size, head height, centring and background.
• Problems are explained in plain words.

It measures against the configured specification but can't guarantee acceptance, so always confirm the issuing authority's current rules.` },
  },
  {
    id: 'ctcm', label: { en: 'CTCM (mobile)' }, entryType: 'ctcm', codeNote: CODE_NOTE, followUps: ['ctce', 'docs', 'demo'],
    keywords: ['ctcm', 'mobile', 'mobile number', 'phone number', 'contact number', 'cell', 'mobiel', 'handy', 'portable', 'móvil', 'celular', 'cellulare', 'telefon', '手机', '携帯', '휴대폰', 'ponsel', 'มือถือ', 'điện thoại', 'मोबाइल', 'মোবাইল', 'мобильн', 'جوال', 'موبايل', 'موبائل', 'موبایل', 'ګرځنده'],
    answer: { en: `**CTCM: passenger mobile**
CTCM carries the passenger's own mobile number (country code + digits) so the airline can reach them about schedule changes. Magic Toolbar formats it per GDS and warns when the country code is missing.

Examples:` },
  },
  {
    id: 'ctce', label: { en: 'CTCE (email)' }, entryType: 'ctce', codeNote: CODE_NOTE, followUps: ['ctcm', 'docs', 'demo'],
    keywords: ['ctce', 'email', 'e-mail', 'email address', 'correo', 'courriel', '邮箱', '郵箱', 'メール', '이메일', 'อีเมล', 'ईमेल', 'ইমেইল', 'почта', 'электронн', 'البريد', 'ای میل', 'ایمیل', 'برېښنالیک'],
    answer: { en: `**CTCE: passenger email**
CTCE carries the passenger's email address. Special characters are encoded the way GDS entries expect, e.g. @ is written as //.

Examples:` },
  },
  {
    id: 'docs', label: { en: 'Passport → DOCS' }, entryType: 'docs', codeNote: CODE_NOTE, followUps: ['ctcm', 'ctce', 'demo'],
    keywords: ['docs', 'passport', 'mrz', 'ocr', 'apis', 'travel document', 'name entry', 'paspoort', 'reisepass', 'passeport', 'pasaporte', 'passaporte', 'passaporto', 'pasaport', '护照', '護照', 'パスポート', '여권', 'paspor', 'pasport', 'หนังสือเดินทาง', 'hộ chiếu', 'पासपोर्ट', 'পাসপোর্ট', 'ਪਾਸਪੋਰਟ', 'паспорт', 'paszport', 'جواز', 'پاسپورٹ', 'پاسپورت', 'پاسپورټ'],
    answer: { en: `**Passport → DOCS**
Paste or read the passport and Magic Toolbar fills the passenger fields, verifies the MRZ check digits and expiry, works out passenger type and title, and prepares NAME, DOCS, CTCM and CTCE entries for Amadeus, Travelport and Sabre side by side.
Passport OCR runs on your PC. Unclear details stay blank until you confirm them, so always review before use.

DOCS examples:` },
  },
  {
    id: 'shortcuts', label: { en: 'F1–F12 shortcuts' }, followUps: ['containers', 'demo', 'install'],
    keywords: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'f1-f12', 'shortcut', 'shortcuts', 'hotkey', 'hotkeys', 'function key', 'sneltoets', 'tastenkürzel', 'raccourci', 'atajo', 'atalho', 'scorciatoia', 'kısayol', '快捷键', '快捷鍵', 'ショートカット', '단축키', 'pintasan', 'ทางลัด', 'phím tắt', 'शॉर्टकट', 'শর্টকাট', 'горяч', 'skrót', 'اختصار', 'شارٹ کٹ', 'میانبر'],
    answer: { en: `**F1–F12 shortcuts**
Container Manager lets you assign your standard text to F1–F12 and Shift+F-keys, so remarks, policies and greetings are one key away. Organise slots by category, mark favourites, see which slots are free, and export/import a backup.
Review each saved message before you paste it into a customer or booking workflow.` },
  },
  {
    id: 'containers', label: { en: 'Container Manager' }, followUps: ['shortcuts', 'demo', 'pricing'],
    keywords: ['container', 'containers', 'template', 'templates', 'standard text', 'canned', 'remark', 'remarks', 'snippet', 'sjabloon', 'vorlage', 'modèle', 'plantilla', 'modello', 'şablon', '模板', 'テンプレート', '템플릿', 'templat', 'แม่แบบ', 'mẫu', 'टेम्पलेट', 'টেমপ্লেট', 'шаблон', 'szablon', 'قالب', 'ٹیمپلیٹ'],
    answer: { en: `**Container Manager**
• Save standard text (fares, baggage, ticket policy, visa notes, greetings) in categories.
• Assign each container to F1–F12 or Shift+F-keys.
• Mark favourites and see which slots are free.
• Export and import a backup of all containers.` },
  },
  {
    id: 'magnifier', label: { en: 'Magnifier' }, followUps: ['translate', 'features'],
    keywords: ['magnifier', 'magnify', 'zoom in', 'enlarge', 'small text', 'vergrootglas', 'lupe', 'loupe', 'lupa', 'lente', 'büyüteç', '放大', '拡大', '돋보기', 'kaca pembesar', 'แว่นขยาย', 'kính lúp', 'आवर्धक', 'ম্যাগনিফায়ার', 'лупа', 'szkło powiększające', 'مكبر', 'میگنیفائر', 'ذره بین'],
    answer: { en: `**Magnifier**
Select any area on screen to read small text clearly. The same magnifier feeds Travel Genie Translate: select a customer's message and translate it in one step.` },
  },
  {
    id: 'translate', label: { en: 'Translate' }, followUps: ['magnifier', 'privacy', 'demo'],
    keywords: ['translate', 'translation', 'translator', 'vertalen', 'übersetzen', 'übersetzung', 'traduire', 'traduction', 'traducir', 'traducción', 'traduzir', 'tradução', 'tradurre', 'traduzione', 'çeviri', '翻译', '翻譯', '翻訳', '번역', 'terjemah', 'แปล', 'dịch', 'अनुवाद', 'অনুবাদ', 'ਅਨੁਵਾਦ', 'перев', 'tłumacz', 'переклад', 'ترجمة', 'ترجمہ', 'ترجمه', 'ژباړه', 'tarjima'],
    answer: { en: `**Travel Genie Translate**
• Select text anywhere on screen with the magnifier.
• The language is detected and translated into English.
• Fix anything misread and translate again.
• Type your reply in English and translate it into the customer's language.

Note: translation uses an online service (Google, as shown in the app), so the selected text leaves your PC.` },
  },
  {
    id: 'decode', label: { en: 'GDS decode' }, followUps: ['gds', 'docs', 'demo'],
    keywords: ['decode', 'decoding', 'encode', 'city code', 'airline code', 'airport code', 'aircraft', 'iata code', 'decodeer', 'dekodieren', 'décoder', 'decodificar', 'decodificare', '解码', 'デコード', '디코드', 'ถอดรหัส', 'giải mã', 'डिकोड', 'ডিকোড', 'расшифр', 'dekoduj', 'فك الترميز', 'ڈی کوڈ', 'رمزگشایی'],
    answer: { en: `**GDS Decode**
City, airline, country, car company, hotel company and aircraft-type decodes. Each task is shown for Travelport, Amadeus and Sabre in one row, with one-click copy and three text sizes.` },
  },
  {
    id: 'directory', label: { en: 'Phone directory' }, followUps: ['families', 'features'],
    keywords: ['directory', 'phone directory', 'phone book', 'address book', 'contacts list'],
    answer: { en: `**Instant Phone Directory**
Clients, agents and family members in one searchable list. Search by name, code, phone or note; copy a number, email or the whole record; group families; and import/export the list.` },
  },
  {
    id: 'reminders', label: { en: 'Reminders & notes' }, followUps: ['features', 'demo'],
    keywords: ['reminder', 'reminders', 'alarm', 'alarms', 'follow up', 'follow-up', 'task', 'tasks', 'sticky', 'note', 'notes', 'herinnering', 'erinnerung', 'rappel', 'recordatorio', 'lembrete', 'promemoria', 'hatırlatıcı', '提醒', 'リマインダー', '알림', 'pengingat', 'เตือน', 'nhắc', 'रिमाइंडर', 'অনুস্মারক', 'напомин', 'przypomnienie', 'تذكير', 'یاد دہانی', 'یادآوری'],
    answer: { en: `**Reminders & sticky notes**
• Today, Upcoming, Overdue, Recurring, Completed and Missed views.
• Each reminder has a category and priority; mark done, snooze, edit or copy from the same row.
• An alert appears when a reminder is due.
• Sticky notes stay on top, can carry a reminder and save automatically.` },
  },
  {
    id: 'families', label: { en: 'Passenger families' }, followUps: ['privacy', 'directory'],
    keywords: ['family', 'families', 'repeat traveller', 'repeat traveler', 'passenger profile', 'saved passengers', 'familie', 'famille', 'familia', 'família', 'famiglia', 'aile', '家庭', '家族', '가족', 'keluarga', 'ครอบครัว', 'gia đình', 'परिवार', 'পরিবার', 'семья', 'rodzina', 'родина', 'عائلة', 'خاندان', 'خانواده', 'کورنۍ'],
    answer: { en: `**Passenger families**
Keep repeat travellers and their families together. Saved records are protected with Windows DPAPI for your Windows account; use the built-in Export/Import to move them to another account or PC.` },
  },
  {
    id: 'products', label: { en: 'More products' }, handoff: 'More Travel Genie products', followUps: ['features', 'human'],
    keywords: ['crm', 'nadra', 'proposal', 'whatsapp extractor', 'extractor', 'observation desk', 'emirates', 'sales report', 'other products', 'more products', 'specialist'],
    answer: { en: `**More Travel Genie products**
Separate applications, not included with Magic Toolbar: NADRA Visa Cross-Check, WhatsApp Contact Number Extractor, WhatsApp Customer Observation Desk, CRM for All GDS, Amadeus Proposal Generator and Emirates Portal Sales Report Automation.
Full details are still being prepared. Ask us on WhatsApp for early information.` },
  },
  {
    id: 'booking', label: { en: 'Flight booking?' }, followUps: ['features', 'demo'],
    keywords: ['book a flight', 'book flight', 'flight booking', 'ticket', 'tickets', 'fare', 'fares', 'cheap flight', 'reservation', 'booking', 'vlucht', 'flug', 'vuelo', 'voo', 'volo', 'uçuş', 'bilet', '机票', '航班', '機票', '航空券', '항공권', 'tiket', 'penerbangan', 'ตั๋ว', 'vé máy bay', 'टिकट', 'उड़ान', 'টিকিট', 'билет', 'квиток', 'تذكرة', 'حجز', 'ٹکٹ', 'بلیط', 'ټکټ'],
    answer: { en: `I can't book flights or issue tickets, and neither does Magic Toolbar. It isn't a GDS: it prepares entries (DOCS, CTCM, CTCE and more) for you to review and use in your own Amadeus, Travelport or Sabre session. It isn't affiliated with any GDS or airline.
Want to see how it speeds up your desk?` },
  },
  {
    id: 'pricing', label: { en: 'Pricing' }, handoff: 'Pricing & licensing', followUps: ['demo', 'install', 'human'],
    keywords: ['price', 'prices', 'pricing', 'cost', 'costs', 'how much', 'subscription', 'subscribe', 'plan', 'plans', 'license', 'licence', 'licensing', 'monthly', 'yearly', 'annual', 'lifetime', 'buy', 'purchase', 'payment', 'pay', 'usd', 'dollar', 'qeemat', 'qimat', 'kimat', 'keemat', 'kitne', 'kitna', 'prijs', 'kosten', 'abonnement', 'preis', 'preise', 'lizenz', 'prix', 'tarif', 'tarifs', 'precio', 'precios', 'preço', 'preços', 'prezzo', 'prezzi', 'fiyat', 'ücret', '价格', '價格', '费用', '費用', '価格', '料金', '가격', '요금', 'harga', 'biaya', 'ราคา', 'giá', 'कीमत', 'दाम', 'मूल्य', 'কতি', 'কত', 'दर', 'কীমত', 'দাম', 'মূল্য', 'ਕੀਮਤ', 'цена', 'стоимость', 'cena', 'ціна', 'вартість', 'سعر', 'أسعار', 'اشتراك', 'قیمت', 'فیس', 'بیه', 'بیې', 'narx', 'narxi', 'qancha', 'कति'],
    vars: PRICE_VARS,
    answer: { en: `**Magic Toolbar plans (USD)**
• Monthly: {monthly} per month
• Yearly: {yearly} per year (regular {regular}, you save {save})
• Lifetime: contact us for pricing

Each PC is activated on your subscription. Message us on WhatsApp to get started or to ask about licensing.` },
  },
  {
    id: 'install', label: { en: 'Installation' }, handoff: 'Installation help', followUps: ['pricing', 'support', 'demo'],
    keywords: ['install', 'installation', 'installer', 'setup', 'set up', 'download', 'windows', 'requirement', 'requirements', 'system requirements', 'activate', 'activation', 'exe', 'installeren', 'installatie', 'downloaden', 'installieren', 'herunterladen', 'télécharger', 'instalar', 'descargar', 'baixar', 'installare', 'scaricare', 'kurulum', 'indir', '安装', '下载', '安裝', '下載', 'インストール', 'ダウンロード', '설치', '다운로드', 'instal', 'unduh', 'pasang', 'ติดตั้ง', 'ดาวน์โหลด', 'cài đặt', 'इंस्टॉल', 'डाउनलोड', 'ইনস্টল', 'ডাউনলোড', 'установ', 'скачать', 'instalacja', 'pobierz', 'встанов', 'завантаж', 'تثبيت', 'تحميل', 'انسٹال', 'ڈاؤن لوڈ', 'نصب', 'ډاونلوډ', 'ornatish', 'yuklab'],
    answer: { en: `**Installation**
Magic Toolbar is a Windows desktop application.
1. Get the official installer from this website. Each release lists its version, date and requirements.
2. Run it and activate your PC on your subscription (steps come with the release).
3. Open the toolbar, review passenger details and copy prepared entries into your GDS.` },
    appendix: genie.storeUrl
      ? { en: 'Official download: {url}', vars: { url: genie.storeUrl } }
      : { en: "The public download link isn't live yet, and we won't send unverified files. Message us on WhatsApp for the release or installation help." },
  },
  {
    id: 'demo', label: { en: 'Book a demo' }, handoff: 'Product demo', followUps: ['pricing', 'features'],
    keywords: ['demo', 'demonstration', 'presentation', 'show me', 'walkthrough', 'trial', 'meeting', 'video', 'presentatie', 'vorführung', 'demostración', 'demonstração', 'dimostrazione', 'sunum', '演示', '示範', 'デモ', '데모', 'สาธิต', 'डेमो', 'ডেমো', 'демо', 'prezentacja', 'демонстрац', 'عرض توضيحي', 'ڈیمو', 'نمایش', 'ډیمو'],
    answer: { en: `**Book a live demo**
We'll walk you through passport → DOCS, CTCM/CTCE, F1–F12 containers, translation and the visa-photo tool over a WhatsApp call or screen share, at a time that suits you.
Tap below; your language and topic are already filled in.` },
  },
  {
    id: 'gds', label: { en: 'Supported GDS' }, followUps: ['docs', 'decode', 'demo'],
    keywords: ['gds', 'amadeus', 'sabre', 'travelport', 'galileo', 'worldspan', 'apollo', 'smartpoint', 'abacus', '1a', '1g', '1s', 'which gds', 'supported gds'],
    answer: { en: `**Supported GDS formats**
Magic Toolbar prepares entries in Amadeus (1A), Travelport (1G) and Sabre (1S) formats, side by side. Exact supported versions and workflows are published with each release. It prepares entries only; it doesn't connect to or replace your GDS.` },
  },
  {
    id: 'privacy', label: { en: 'Your data' }, followUps: ['families', 'translate'],
    keywords: ['privacy', 'private', 'data', 'secure', 'security', 'safe', 'gdpr', 'stored', 'storage', 'dpapi', 'upload', 'encrypt', 'gegevens', 'datenschutz', 'daten', 'confidentialité', 'données', 'privacidad', 'datos', 'privacidade', 'dados', 'dati', 'gizlilik', 'veri', '隐私', '隱私', 'プライバシー', '개인정보', 'privasi', 'ความเป็นส่วนตัว', 'bảo mật', 'गोपनीयता', 'डेटा', 'গোপনীয়তা', 'конфиденц', 'данные', 'prywatność', 'dane', 'конфіденц', 'дані', 'خصوصية', 'بيانات', 'رازداری', 'ڈیٹا', 'حریم خصوصی'],
    answer: { en: `**Your data**
• Passport OCR and image editing run locally on your PC.
• Passenger families you save are protected with Windows DPAPI for your Windows account.
• Travel Genie Translate sends the text you select to an online service (Google).
• This website chat doesn't need passport data, so please don't type any here.` },
  },
  {
    id: 'features', label: { en: 'Features' }, followUps: ['docs', 'shortcuts', 'visaPhoto', 'translate', 'pricing'],
    keywords: ['feature', 'features', 'what is', 'what does', 'toolbar', 'magic toolbar', 'tools', 'overview', 'capabilities', 'functies', 'funktionen', 'fonctionnalités', 'funciones', 'recursos', 'funcionalidades', 'funzioni', 'özellikler', '功能', '機能', '기능', 'fitur', 'ciri', 'ฟีเจอร์', 'tính năng', 'फ़ीचर', 'फीचर', 'ফিচার', 'ਫ਼ੀਚਰ', 'функци', 'funkcje', 'الميزات', 'ميزات', 'فیچر', 'ویژگی', 'ځانګړتیا', 'imkoniyat'],
    answer: { en: `**Magic Toolbar: one Windows workspace for travel desks**
• Passport → NAME, DOCS, CTCM, CTCE for Amadeus, Travelport & Sabre
• F1–F12 shortcuts and Container Manager
• Visa photo fixer with quality enhancer and rotate/align
• GDS decode search
• Translate & magnifier
• Phone directory and passenger families
• Reminders, sticky notes, snip & screenshot

What would you like to explore?` },
  },
  {
    id: 'support', label: { en: 'Technical support' }, handoff: 'Technical support', weight: 0.75, followUps: ['install', 'human'],
    keywords: ['support', 'help', 'problem', 'issue', 'error', 'bug', 'not working', 'doesnt work', 'crash', 'fix', 'broken', 'stuck', 'technical', 'troubleshoot', 'hulp', 'storing', 'fout', 'hilfe', 'fehler', 'aide', 'erreur', 'problème', 'ayuda', 'soporte', 'ajuda', 'suporte', 'erro', 'aiuto', 'errore', 'assistenza', 'destek', 'hata', 'yardım', '支持', '帮助', '错误', '錯誤', 'サポート', 'エラー', '지원', '오류', 'bantuan', 'masalah', 'sokongan', 'ช่วย', 'ปัญหา', 'lỗi', 'hỗ trợ', 'मदद', 'समस्या', 'सहयोग', 'सहायता', 'সাহায্য', 'সমস্যা', 'ਮਦਦ', 'помощ', 'ошибк', 'проблем', 'pomoc', 'błąd', 'допомог', 'помилк', 'مساعدة', 'دعم', 'مشكلة', 'مدد', 'مسئلہ', 'مسئله', 'مرسته', 'ستونزه', 'yordam', 'muammo', 'xato'],
    answer: { en: `**Technical support**
Send us on WhatsApp:
1. Your Magic Toolbar version and Windows version
2. Which tool you were using and what you expected
3. The exact error message
4. A screenshot with passenger data hidden

Quick checks: restart the toolbar, confirm your PC is activated, and make sure Translate has internet access.` },
  },
  {
    id: 'human', label: { en: 'Talk to the team' }, handoff: 'Talk to the team', webOnly: true, followUps: ['pricing', 'demo'],
    keywords: ['human', 'agent', 'person', 'someone', 'talk to', 'speak to', 'whatsapp', 'call me', 'contact', 'representative', 'medewerker', 'mensch', 'mitarbeiter', 'humain', 'conseiller', 'humano', 'agente', 'persona', 'pessoa', 'operatore', 'temsilci', '人工', '客服', '担当者', '상담원', 'manusia', 'เจ้าหน้าที่', 'nhân viên', 'इंसान', 'एजेंट', 'মানুষ', 'оператор', 'человек', 'konsultant', 'людина', 'موظف', 'انسان', 'نمائندہ', 'کارمند', 'استازی'],
    answer: { en: `Our team is available on WhatsApp. Tap below; your topic, language and country are filled in so you don't have to repeat yourself.
Genie stays here 24/7 for instant answers, and the team replies on WhatsApp as soon as possible.` },
  },
  {
    id: 'thanks', label: { en: 'Thanks' }, weight: 0.6, followUps: MAIN_CHIPS,
    keywords: ['thanks', 'thank you', 'thx', 'shukriya', 'dank', 'danke', 'merci', 'gracias', 'obrigad', 'grazie', 'teşekkür', '谢谢', '謝謝', 'ありがとう', '감사', 'terima kasih', 'ขอบคุณ', 'cảm ơn', 'धन्यवाद', 'ধন্যবাদ', 'спасибо', 'dziękuję', 'дякую', 'شكرا', 'شکریہ', 'تشکر', 'مننه', 'rahmat'],
    answer: { en: "You're welcome! Anything else I can help with?" },
  },
  {
    id: 'greeting', label: { en: 'Hello' }, weight: 0.5, followUps: MAIN_CHIPS,
    keywords: ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa', 'hola', 'bonjour', 'hallo', 'ciao', 'merhaba', 'olá', 'namaste', '你好', '您好', 'こんにちは', '안녕', 'halo', 'สวัสดี', 'xin chào', 'नमस्ते', 'नमस्कार', 'নমস্কার', 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'привет', 'здравств', 'cześć', 'вітаю', 'привіт', 'مرحبا', 'السلام', 'سلام', 'salom'],
    answer: { en: 'Hello! How can I help today?' },
  },
];