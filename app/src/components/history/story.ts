/*
 * Content for the history story page (/historie/, "Cesta časem").
 *
 * Sources: "Z historie škol a školství v našem městě Kostelci nad Orlicí"
 * (Dr. V. Fidler, Zpravodaj města; public/soubory/historie/histskol.pdf),
 * the seminar paper on J. S. Guth-Jarkovský (J. Pavlatová, 9.A, 2003;
 * jguthjark.pdf) and web research (see GUTH facts' comments). Photos in
 * public/soubory/historie/foto/ come from the school's own PDF.
 */

export type Photo = {
  src: string
  alt: string
  caption: string
  /** Required attribution for CC-licensed images (show it next to the photo). */
  credit?: string
}

export type Chapter = {
  id: string
  /** Year (or era) shown big. */
  year: string
  /** Numeric year for timelines/odometers; eras use their start. */
  sortYear: number
  title: string
  /** 1-3 short paragraphs, kid-friendly but faithful to the sources. */
  text: string[]
  /** Optional one-liner "did you know" bubble. */
  fun?: string
  photo?: Photo
  /** Which drawn scene element this chapter introduces (variant 1). */
  scene?: SceneKey
  /** True for chapters from Guth-Jarkovský's own life. */
  guth?: boolean
}

export type SceneKey =
  | 'church'
  | 'brethren'
  | 'cantor'
  | 'firstSchool'
  | 'lhota'
  | 'mainSchool'
  | 'boy'
  | 'square45'
  | 'olympics'
  | 'realka'
  | 'skala'
  | 'castle'
  | 'trail'
  | 'masaryk'
  | 'dream'
  | 'today'

const FOTO = '/soubory/historie/foto'
/** Wikimedia Commons images, see public/soubory/historie/obrazky/CREDITS.md. */
const COMMONS = '/soubory/historie/obrazky'

export const PHOTOS = {
  rytina: { src: `${FOTO}/kostelec-rytina.jpg`, alt: 'Stará rytina Kostelce nad Orlicí s věžemi kostelů', caption: 'Kostelec na staré rytině' },
  dekanstvi: {
    src: `${FOTO}/dekanstvi-nejstarsi-skola.jpg`,
    alt: 'Budova u děkanství, místo nejstarší školy',
    caption: 'Místo patrně nejstarší školy – při děkanství, vedle bývalé konírny a chléva'
  },
  prvniBudova: {
    src: `${FOTO}/prvni-skolni-budova.jpg`,
    alt: 'Patrová budova vedle kostela sv. Jiří',
    caption: 'První školní budova z konce 18. století, později dívčí škola, dnes Klub důchodců'
  },
  namesti45: {
    src: `${FOTO}/namesti-45-skola.jpg`,
    alt: 'Budova školy na Palackého náměstí',
    caption: 'Škola na náměstí (č. 45 a 46) – přestavěná roku 1875 za 36 000 zlatých'
  },
  skolaPrace: {
    src: `${FOTO}/masarykova-skola-prace-1931.jpg`,
    alt: 'Funkcionalistická budova Masarykovy školy práce',
    caption: 'Masarykova škola práce, otevřená 1931'
  },
  rolnicka: { src: `${FOTO}/rolnicka-skola-1897.jpg`, alt: 'Budova rolnické školy', caption: 'Rolnická škola – výuka v nové budově od roku 1897' },
  skala: { src: `${FOTO}/skola-na-skale-1901.jpg`, alt: 'Pohlednice školy Na Skále', caption: 'Škola Na Skále, otevřená 1. listopadu 1901' },
  lhota: { src: `${FOTO}/kostelecka-lhota-skola.jpg`, alt: 'Škola v Kostelecké Lhotě', caption: 'Škola v Kostelecké Lhotě – vznikla přestavbou sýpky' },
  realka: {
    src: `${FOTO}/realka-komenskeho-1897.jpg`,
    alt: 'Stará pohlednice Komenského třídy s budovou reálky',
    caption: 'Reálka (dnes Obchodní akademie) – podle plánů arch. V. Pasovského, otevřená 19. 9. 1897'
  },
  masaryk: {
    src: `${FOTO}/masaryk-navsteva.jpg`,
    alt: 'Prezident Masaryk na náměstí v Kostelci mezi lidmi',
    caption: 'Prezident T. G. Masaryk v Kostelci (navštívil město 1926 a 1929)'
  },
  veduta1821: {
    src: `${COMMONS}/kostelec-veduta-1821.jpg`,
    alt: 'Malovaný pohled na Kostelec z roku 1821 s kostelem a domy',
    caption: 'Kostelec na malbě Joanna Venuta z roku 1821'
  },
  mov1896: {
    src: `${COMMONS}/mov-atheny-1896.jpg`,
    alt: 'Skupinová fotografie sedmi pánů – Mezinárodní olympijský výbor v Athénách 1896',
    caption: 'Mezinárodní olympijský výbor v Athénách 1896 – Jiří Guth stojí druhý zleva, sedící vlevo je Coubertin'
  },
  coubertin1925: {
    src: `${COMMONS}/coubertin-guth-1925.jpg`,
    alt: 'Pierre de Coubertin a Jiří Guth-Jarkovský',
    caption: 'S kamarádem Coubertinem na olympijském kongresu v Praze 1925 (Guth vlevo)'
  },
  guth1919: {
    src: `${COMMONS}/guth-jarkovsky-vavrousek-1919.jpg`,
    alt: 'Sépiový portrét Jiřího Gutha s podpisem',
    caption: 'Dr. Jiří Guth v roce 1919 (foto Bohumil Vavroušek)'
  },
  deska: {
    src: `${COMMONS}/pametni-deska-guth-jarkovsky.jpg`,
    alt: 'Pamětní deska s bronzovým reliéfem Gutha-Jarkovského na domě na Palackého náměstí',
    caption: 'Pamětní deska na Palackého náměstí, odhalená 3. 6. 2006',
    credit: 'Foto: Ben Skála, CC BY-SA 3.0, Wikimedia Commons'
  },
  guth: {
    src: `${FOTO}/guth-jarkovsky-portret.jpg`,
    alt: 'Portrét Jiřího Gutha-Jarkovského s brýlemi a knírem',
    caption: 'Jiří Stanislav Guth-Jarkovský'
  }
} satisfies Record<string, Photo>

export const CHAPTERS: Chapter[] = [
  {
    id: 'dekanstvi',
    year: '14. stol.',
    sortYear: 1300,
    title: 'Škola u fary',
    text: [
      'Kdysi se o vzdělání staraly kláštery a fary. Kostelec se ve 14. století stal sídlem jednoho ze dvou podorlických děkanství – patřilo k němu 36 farností od Chocně po Vamberk.',
      'Při každé třetí faře bývala škola, a tak se tu nejspíš učilo dávno předtím, než to někdo zapsal. Učilo se přímo v prostorách fary.'
    ],
    fun: 'Druhé podorlické děkanství bylo v Dobrušce.',
    photo: PHOTOS.dekanstvi,
    scene: 'church'
  },
  {
    id: 'bratrska',
    year: '1519',
    sortYear: 1519,
    title: 'Kdo se k nim dá, hned čísti umí',
    text: [
      'Z roku 1519 pochází nejstarší písemná zmínka o kostelecké škole. Byla to škola bratrská a zápis o ní chválí: „Kdož se mezi ně dá, hned čísti umí.“'
    ],
    scene: 'brethren'
  },
  {
    id: 'kantori',
    year: 'Kantoři',
    sortYear: 1600,
    title: 'Plat? Dřevo, louky a sobotáles',
    text: [
      'Učitelům se říkalo kantoři – z latinského cantare, zpívat. Často nedostali peníze, ale „sobotáles“: sobotní odměnu v naturáliích, kterou jim nosili žáci.',
      'Kantor v Kostelecké Lhotě měl ročně 81 zlatých 15 krejcarů, 13 sáhů dřeva, dvě louky a kus pole – a musel zvonit poledne a klekání. Penze nebyly.'
    ],
    fun: 'Znamenitý kostelecký pedagog Jan Ladislav Mašek pobíral 100 zlatých ročně.',
    scene: 'cantor'
  },
  {
    id: 'prvni-budova',
    year: '1773',
    sortYear: 1773,
    title: 'Konečně vlastní školní budova',
    text: [
      'Roku 1773 přestavěli děkanský kostel sv. Jiří. Krátce nato vyrostla na místě zrušeného hřbitova u kostela první budova postavená jen pro vyučování.',
      'Později v ní sídlila dívčí škola. Stojí dodnes – je v ní Klub důchodců.'
    ],
    photo: PHOTOS.prvniBudova,
    scene: 'firstSchool'
  },
  {
    id: 'lhota',
    year: '1833',
    sortYear: 1833,
    title: 'Jednotřídka v Kostelecké Lhotě',
    text: [
      'V Kostelecké Lhotě se začalo učit v roce 1833 v obyčejných domcích – a do jediné třídy chodilo 50 až 60 dětí!',
      'Roku 1836 začala stavba školy, materiál daroval hrabě Josef Kinský. Prvním učitelem byl František Stránský z Voděrad, který ve škole i bydlel.'
    ],
    photo: PHOTOS.lhota,
    scene: 'lhota'
  },
  {
    id: 'hlavni-skola',
    year: '1853',
    sortYear: 1853,
    title: 'Hlavní škola a škola pro dívky',
    text: [
      '28. září 1853 dostalo město povolení zřídit „hlavní školu“ s vyšším vzděláním než dosavadní triviálka. Brzy přibyla i dívčí obecná škola – zčásti u kostela, zčásti na radnici.',
      'Někteří páni chtěli ve městě založit soukromou německou dívčí školu. Nevyšlo to – a zásluhu na tom měl tehdy mladý Jiří Guth.'
    ],
    scene: 'mainSchool'
  },
  {
    id: 'jiri-kluk',
    year: '1868',
    sortYear: 1868,
    title: 'Do Kostelce přijíždí kluk s brýlemi',
    text: [
      'Sedmiletý Jiří Guth se s rodiči stěhuje do Kostelce – odsud pocházeli tatínek Karel i maminka Barbora, dcera kosteleckého perníkáře.',
      'Jiří byl bojácný, nosil brýle a koktal. Koktání se zbavil až po letech usilovného cvičení – ve čtyřiceti.'
    ],
    fun: 'Narodil se v lednu 1861 v Heřmanově Městci jako šesté z osmi dětí.',
    photo: PHOTOS.guth,
    scene: 'boy',
    guth: true
  },
  {
    id: 'stesk',
    year: '1870',
    sortYear: 1870,
    title: 'Stýskání po Kostelci',
    text: [
      'V letech 1870–1878 studoval Jiří gymnázium v Rychnově nad Kněžnou. Vlak tehdy nejezdil, tak bydlel v Rychnově na bytě.',
      'Když se mu stýskalo, chodil s knihou v ruce polem ke Kostelci – až uviděl věže kostela sv. Anny. A někdy došel až domů, nakoukl dírkou do dvora… a rychle zase zpátky, aby se maminka nezlobila.'
    ],
    scene: 'boy',
    guth: true
  },
  {
    id: 'namesti',
    year: '1875',
    sortYear: 1875,
    title: 'Škola na náměstí',
    text: [
      'Domy č. 45 na náměstí a č. 46 v ulici Na Lávkách postavili pro hraběcí odborníky na stavbě cukrovaru a železnice.',
      'Roku 1875 je obec za 36 000 zlatých přestavěla na chlapeckou školu obecnou a měšťanskou. Škola v nich je dodnes – to je naše budova na Palackého náměstí!'
    ],
    photo: PHOTOS.namesti45,
    scene: 'square45'
  },
  {
    id: 'olympiada',
    year: '1894',
    sortYear: 1894,
    title: 'Kostelecký kluk u zrodu olympiády',
    text: [
      'Z bojácného kluka se stal doktor matematiky a fyziky – v roce 1882 vůbec první absolvent nové české univerzity v Praze. Když se nikdo nehlásil na stipendium do Paříže pro učitele tělocviku, přihlásil se on (1891).',
      'V Paříži se spřátelil s baronem Pierrem de Coubertinem, zakladatelem novodobých olympijských her. Když Coubertin roku 1894 zakládal Mezinárodní olympijský výbor, jmenoval Jiřího jedním z prvních členů – i když na kongres nemohl přijet, neměl peníze ani volno.',
      'V roce 1896 už byl na prvních novodobých olympijských hrách v Athénách.'
    ],
    fun: 'Roku 1899 založil Český olympijský výbor – v pražské restauraci U Černého koně – a vedl ho 30 let.',
    photo: PHOTOS.mov1896,
    scene: 'olympics',
    guth: true
  },
  {
    id: 'realka',
    year: '1897',
    sortYear: 1897,
    title: 'Krásná nová reálka',
    text: [
      '19. září 1897 se otevřela reálka podle plánů architekta Vratislava Pasovského, kosteleckého rodáka – dnešní Obchodní akademie. V jejích prostorách se učily i děti ze základní školy, a to až do 90. let 20. století.',
      'Ve stejném roce se začalo učit i v nové budově rolnické školy.'
    ],
    fun: 'Architekt Pasovský navrhl i pražskou rozhlednu na Petříně.',
    photo: PHOTOS.realka,
    scene: 'realka'
  },
  {
    id: 'skala',
    year: '1901',
    sortYear: 1901,
    title: 'Konec vyučování v hospodě',
    text: [
      'Na Skále se dlouho učilo provizorně – třeba v hostinci u Hofmanů. 1. listopadu 1901 se konečně otevřela škola Na Skále.'
    ],
    photo: PHOTOS.skala,
    scene: 'skala'
  },
  {
    id: 'hrad',
    year: '1919',
    sortYear: 1919,
    title: 'Ceremoniář prezidenta',
    text: [
      'Jako mladý vychovatel princů Schaumburg-Lippe na zámku v Náchodě se Jiří naučil dvorské etiketě. V roce 1919 nastoupil na Pražský hrad jako ceremoniář prezidenta T. G. Masaryka a vydržel tam tři roky.',
      'Ke jménu si přidal „Jarkovský“ – Guth znělo německy a on se cítil především Čechem.'
    ],
    photo: PHOTOS.guth1919,
    fun: 'Napsal Společenský katechismus a Pravidla slušnosti pro mládež.',
    scene: 'castle',
    guth: true
  },
  {
    id: 'stezka',
    year: '1921',
    sortYear: 1921,
    title: 'Stezka Dr. Gutha-Jarkovského',
    text: [
      'Jiří miloval turistiku a vedl Klub českých turistů. V lednu 1919 byl u založení jeho odboru v Kostelci a začátkem 20. let se otevřela turistická stezka nesoucí jeho jméno.',
      'Červená značka vedla z Kostelce přes hrad Potštejn, Litice, Českou Rybnou a hrad Žampach až do Letohradu – 40 kilometrů. Dnes pokračuje až do Ústí nad Orlicí.'
    ],
    fun: 'V roce 1933 zapečetil v Národním muzeu balíček, který se smí otevřít až v lednu 2093!',
    scene: 'trail',
    guth: true
  },
  {
    id: 'masaryk',
    year: '1926',
    sortYear: 1926,
    title: 'Prezident v Kostelci',
    text: [
      'Prezident T. G. Masaryk navštívil Kostelec v letech 1926 a 1929. Na jeho počest pak vznikla jména Masarykova škola práce (otevřená 1931) a Masarykovo reálné gymnasium.'
    ],
    photo: PHOTOS.masaryk,
    scene: 'masaryk'
  },
  {
    id: 'nova-skola',
    year: '1929',
    sortYear: 1929,
    title: 'Nová škola, která se nikdy nepostavila',
    text: [
      'Tříd bylo málo, a tak se od roku 1929 jednalo o nové škole. Hledaly se pozemky, roku 1935 jela delegace města obhlédnout nové školy až do Zlína a architekt Liška kreslil plány.',
      'Pak přišla zpráva, že na stavbu nejsou peníze, a válka. V zápisu z 11. září 1939 stojí: „bude se stavět, jakmile to poměry dovolí.“ Nová budova ale nevznikla nikdy.'
    ],
    fun: 'Roku 1935 se kvůli nedostatku místa učily dvě třídy v Seykorově vile v parku.',
    scene: 'dream'
  },
  {
    id: 'dnes',
    year: 'Dnes',
    sortYear: 2006,
    title: 'Jedna škola, čtyři budovy',
    text: [
      'Od 1. 1. 2006 jsou kostelecké základní školy sloučené pod jedno ředitelství. Učíme se na Palackého náměstí, v Komenského a Drtinově ulici a družina sídlí i v Erbenově.',
      'Od roku 2008 nese škola jméno Gutha-Jarkovského. Na Palackého náměstí, na domě čp. 27, kde kdysi bydlel, visí od roku 2006 jeho pamětní deska – kluk s brýlemi, co se kdysi plížil polem domů do Kostelce, se vrátil natrvalo.'
    ],
    photo: PHOTOS.deska,
    scene: 'today'
  }
]

/**
 * Rules from Guth-Jarkovský's Společenský katechismus, checked word for
 * word against the public-domain e-book (Městská knihovna v Praze, 2015).
 * Present them as exact quotes; don't add others without checking.
 */
export const ETIQUETTE_RULES = [
  'První pozdravuje osoba mladší, ale osoba dobře vychovaná nečeká na pozdrav.',
  'Nejezte hlučně, příliš rychle a nemluvte majíce plná ústa.',
  'K chybě své se přiznati není nikdy hanbou.'
]

/** More verified quotes (same source), for variants that want more. */
export const ETIQUETTE_MORE = [
  'Chceš-li býti zdvořilým, buď dobrým.',
  'S pořádkem souvisí i dochvilnost, která je korunou pořádku.',
  'Nedostatek slušného úboru svědčí nejen o nedostatku úcty k osobám, jež potkáváme, ale také k sobě samým.'
]
