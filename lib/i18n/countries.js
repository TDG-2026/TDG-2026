// ISO 3166-1 alpha-2 directory, snapshot 2026-10-30; names: host ICU/CLDR via Intl.DisplayNames.
// XK is a separately configured travel-market entry; entries do not assert sovereignty.
export const countryCodes=["AD","AE","AF","AG","AI","AL","AM","AO","AQ","AR","AS","AT","AU","AW","AX","AZ","BA","BB","BD","BE","BF","BG","BH","BI","BJ","BL","BM","BN","BO","BQ","BR","BS","BT","BV","BW","BY","BZ","CA","CC","CD","CF","CG","CH","CI","CK","CL","CM","CN","CO","CR","CU","CV","CW","CX","CY","CZ","DE","DJ","DK","DM","DO","DZ","EC","EE","EG","EH","ER","ES","ET","FI","FJ","FK","FM","FO","FR","GA","GB","GD","GE","GF","GG","GH","GI","GL","GM","GN","GP","GQ","GR","GS","GT","GU","GW","GY","HK","HM","HN","HR","HT","HU","ID","IE","IL","IM","IN","IO","IQ","IR","IS","IT","JE","JM","JO","JP","KE","KG","KH","KI","KM","KN","KP","KR","KW","KY","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU","LV","LY","MA","MC","MD","ME","MF","MG","MH","MK","ML","MM","MN","MO","MP","MQ","MR","MS","MT","MU","MV","MW","MX","MY","MZ","NA","NC","NE","NF","NG","NI","NL","NO","NP","NR","NU","NZ","OM","PA","PE","PF","PG","PH","PK","PL","PM","PN","PR","PS","PT","PW","PY","QA","RE","RO","RS","RU","RW","SA","SB","SC","SD","SE","SG","SH","SI","SJ","SK","SL","SM","SN","SO","SR","SS","ST","SV","SX","SY","SZ","TC","TD","TF","TG","TH","TJ","TK","TL","TM","TN","TO","TR","TT","TV","TW","TZ","UA","UG","UM","US","UY","UZ","VA","VC","VE","VG","VI","VN","VU","WF","WS","YE","YT","ZA","ZM","ZW","XK"];

export const marketLanguages={
PK:['ur','en','pa','ps','sd'],IN:['hi','en','bn','ta','te','mr','gu','kn','ml','pa','ur'],BD:['bn','en'],LK:['si','ta','en'],NP:['ne','en'],AF:['fa','ps'],IR:['fa'],MV:['dv','en'],
AE:['ar','en','ur','hi'],SA:['ar','en'],QA:['ar','en'],KW:['ar','en'],OM:['ar','en'],BH:['ar','en'],EG:['ar','en'],IQ:['ar'],JO:['ar','en'],LB:['ar','fr','en'],PS:['ar'],SY:['ar'],YE:['ar'],DZ:['ar','fr'],MA:['ar','fr'],TN:['ar','fr'],SD:['ar','en'],LY:['ar'],IL:['he','ar','en'],
TR:['tr'],CY:['el','tr','en'],GR:['el'],CN:['zh-Hans','ug'],TW:['zh-Hant'],HK:['zh-Hant','en'],MO:['zh-Hant','pt-PT'],SG:['en','zh-Hans','ms','ta'],JP:['ja'],KR:['ko'],MN:['mn'],
ID:['id'],MY:['ms','en','zh-Hans','ta'],BN:['ms','en'],TH:['th'],VN:['vi'],PH:['tl','en'],MM:['my'],KH:['km'],LA:['lo'],TL:['pt-PT','id'],
RU:['ru'],BY:['ru'],KZ:['kk','ru'],KG:['ky','ru'],UZ:['uz','ru'],TJ:['tg','ru'],TM:['tk','ru'],AZ:['az'],GE:['ka'],AM:['hy'],UA:['uk'],MD:['ro','ru'],
PL:['pl'],CZ:['cs'],SK:['sk'],HU:['hu'],RO:['ro'],BG:['bg'],HR:['hr'],RS:['sr'],ME:['sr','en'],BA:['bs','hr','sr'],SI:['sl'],AL:['sq'],XK:['sq','sr'],MK:['mk','sq'],LT:['lt'],LV:['lv'],EE:['et'],
FI:['fi','sv'],SE:['sv'],DK:['da'],NO:['nb'],IS:['is'],IE:['en','ga'],GB:['en'],US:['en','es'],CA:['en','fr'],AU:['en'],NZ:['en'],
FR:['fr'],BE:['nl','fr','de'],LU:['fr','de'],MC:['fr'],CH:['de','fr','it'],DE:['de'],AT:['de'],LI:['de'],NL:['nl'],AW:['nl','en'],CW:['nl','en'],SR:['nl'],
ES:['es','ca'],AD:['ca','es','fr'],PT:['pt-PT'],IT:['it'],SM:['it'],VA:['it'],MT:['en','it'],
MX:['es'],AR:['es'],BO:['es'],CL:['es'],CO:['es'],CR:['es'],CU:['es'],DO:['es'],EC:['es'],GT:['es'],HN:['es'],NI:['es'],PA:['es'],PE:['es'],PR:['es','en'],PY:['es'],SV:['es'],UY:['es'],VE:['es'],BR:['pt-BR'],
AO:['pt-PT'],MZ:['pt-PT'],CV:['pt-PT'],GW:['pt-PT'],ST:['pt-PT'],
KE:['sw','en'],TZ:['sw','en'],UG:['en','sw'],RW:['en','fr','sw'],ET:['am','en'],SO:['so','ar'],DJ:['fr','ar','so'],NG:['en','ha','yo'],GH:['en'],ZA:['en','af','zu'],NA:['en','af'],MG:['mg','fr'],
SN:['fr'],CI:['fr'],CD:['fr','sw'],CG:['fr'],GA:['fr'],BJ:['fr'],BF:['fr'],NE:['fr','ha'],ML:['fr'],TG:['fr'],CM:['fr','en'],MU:['en','fr'],SC:['en','fr'],HT:['fr']
};

export function languagesForCountry(code){return marketLanguages[code]||['en'];}
export function countryName(code,locale='en'){try{return new Intl.DisplayNames([locale,'en'],{type:'region'}).of(code)||code;}catch{return code;}}
export const flag=code=>/^[A-Z]{2}$/.test(code)?String.fromCodePoint(...[...code].map(c=>127397+c.charCodeAt(0))):'🌐';