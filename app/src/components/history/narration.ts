/*
 * Spoken narration of the history story (the "Přehrát příběh" player on
 * /historie/). Written for the ear, from the same facts as story.ts: no
 * abbreviations, dates spelled out, short sentences. One segment per
 * chapter (ids match CHAPTERS) plus an intro and an outro.
 *
 * After editing, regenerate the audio: `node scripts/generate-narration.mjs`
 * (see that script for voices/providers).
 */

export type NarrationSegment = {
  /** `intro`, a chapter id from story.ts, or `outro`. */
  id: string
  text: string
}

export const NARRATION: NarrationSegment[] = [
  {
    id: 'intro',
    text: 'Posaďte se, zavřete na chvilku oči… a pojďte se mnou na cestu časem. Budu vám vyprávět příběh kosteleckých škol. Je dlouhý skoro sedm set let. A potkáme v něm i jednoho kluka s brýlemi, po kterém se dnes jmenuje naše škola.'
  },
  {
    id: 'dekanstvi',
    text: 'Začneme ve čtrnáctém století. Tehdy se o vzdělání staraly kláštery a fary. Kostelec se stal sídlem jednoho ze dvou podorlických děkanství a patřilo k němu třicet šest farností – od Chocně až po Vamberk. Při každé třetí faře bývala škola. A tak se tu nejspíš učilo dávno předtím, než to kdokoli zapsal. Vyučovalo se přímo v prostorách fary.'
  },
  {
    id: 'bratrska',
    text: 'Rok tisíc pět set devatenáct. Z něj pochází nejstarší písemná zmínka o kostelecké škole. Byla to škola bratrská – a zápis o ní ji chválí slovy: Kdož se mezi ně dá, hned čísti umí.'
  },
  {
    id: 'kantori',
    text: 'A jak se tehdy žilo učitelům? Říkalo se jim kantoři – z latinského slova cantare, zpívat. Peníze často nedostali. Místo nich dostávali sobotáles: sobotní odměnu v jídle a věcech, kterou jim nosili sami žáci. Kantor v Kostelecké Lhotě měl za rok osmdesát jedna zlatých, třináct sáhů dřeva, dvě louky a kus pole. K tomu musel každý den zvonit poledne a klekání. A penze? Ta žádná nebyla.'
  },
  {
    id: 'prvni-budova',
    text: 'Roku tisíc sedm set sedmdesát tři přestavěli děkanský kostel svatého Jiří. Krátce nato vyrostla vedle něj, na místě starého hřbitova, první budova postavená jen pro vyučování. Později v ní sídlila dívčí škola. A stojí dodnes – je v ní Klub důchodců.'
  },
  {
    id: 'lhota',
    text: 'O šedesát let později, roku tisíc osm set třicet tři, se začalo učit v Kostelecké Lhotě. V obyčejných domcích, v jediné třídě – a do ní se tlačilo padesát až šedesát dětí! Za tři roky začala stavba skutečné školy. Materiál daroval hrabě Josef Kinský. Prvním učitelem byl František Stránský z Voděrad, který ve škole i bydlel.'
  },
  {
    id: 'hlavni-skola',
    text: 'Dvacátého osmého září tisíc osm set padesát tři dostalo město povolení zřídit hlavní školu – s vyšším vzděláním, než měla dosavadní triviálka. Brzy přibyla i škola pro dívky. Někteří páni ve městě chtěli založit soukromou německou dívčí školu. Nevyšlo to. A víte, kdo se o to zasloužil? Tehdy mladý Jiří Guth. Toho si teď představíme.'
  },
  {
    id: 'jiri-kluk',
    text: 'Je rok tisíc osm set šedesát osm. Do Kostelce se stěhuje sedmiletý Jiří Guth. Odsud pocházel tatínek Karel i maminka Barbora, dcera kosteleckého perníkáře. Jiří byl bojácný kluk. Nosil brýle a koktal. Koktání se zbavil až po letech usilovného cvičení – když mu bylo čtyřicet.'
  },
  {
    id: 'stesk',
    text: 'Od roku tisíc osm set sedmdesát studoval Jiří gymnázium v Rychnově nad Kněžnou. Vlak tehdy nejezdil, a tak bydlel v Rychnově na bytě. A strašně se mu stýskalo. Chodil s knihou v ruce polem směrem ke Kostelci, dokud neuviděl věže kostela svaté Anny. Někdy došel až domů. Potichu se připlížil zahradou, nakoukl dírkou ve vratech do dvora… a honem zase zpátky, aby se maminka nezlobila.'
  },
  {
    id: 'namesti',
    text: 'Na náměstí a v ulici Na Lávkách stály dva domy. Postavili je pro odborníky, kteří tu stavěli cukrovar a železnici. Roku tisíc osm set sedmdesát pět je obec za třicet šest tisíc zlatých přestavěla na školu. A škola je v nich dodnes. Je to naše budova na Palackého náměstí!'
  },
  {
    id: 'olympiada',
    text: 'A co náš kluk s brýlemi? Stal se z něj doktor matematiky a fyziky – vůbec první absolvent nové české univerzity v Praze. Když se nikdo nehlásil na stipendium do Paříže pro učitele tělocviku, přihlásil se on. V Paříži se spřátelil s baronem Pierrem de Coubertinem, zakladatelem novodobých olympijských her. A když Coubertin roku tisíc osm set devadesát čtyři zakládal Mezinárodní olympijský výbor, jmenoval Jiřího jedním z jeho prvních členů. O dva roky později už byl na prvních novodobých olympijských hrách v Athénách. Kostelecký kluk u zrodu olympiády!'
  },
  {
    id: 'realka',
    text: 'Devatenáctého září tisíc osm set devadesát sedm se v Kostelci otevřela krásná nová reálka. Navrhl ji architekt Vratislav Pasovský, kostelecký rodák – ten, který navrhl i rozhlednu na pražském Petříně. Dnes je v budově Obchodní akademie.'
  },
  {
    id: 'skala',
    text: 'Na Skále se dlouho učilo jen provizorně. Třeba v hostinci u Hofmanů! Až prvního listopadu tisíc devět set jedna se tu otevřela opravdová škola.'
  },
  {
    id: 'hrad',
    text: 'Jako mladý vychovatel princů na zámku v Náchodě se Jiří naučil dvorské etiketě, tedy jak se správně chovat. A to se mu hodilo. Roku tisíc devět set devatenáct nastoupil na Pražský hrad jako ceremoniář prezidenta Tomáše Garrigua Masaryka. Ke jménu si přidal Jarkovský – protože Guth znělo německy a on se cítil především Čechem. A napsal slavnou knihu o slušném chování: Společenský katechismus.'
  },
  {
    id: 'stezka',
    text: 'Jiří Guth-Jarkovský miloval turistiku. Vedl Klub českých turistů a v Kostelci byl u založení jeho odboru. Začátkem dvacátých let se otevřela turistická stezka, která nese jeho jméno. Červená značka vedla z Kostelce přes hrad Potštejn, Litice a hrad Žampach až do Letohradu. Čtyřicet kilometrů! A víte, co je zvláštní? Roku tisíc devět set třicet tři zapečetil v Národním muzeu balíček, který se smí otevřít až v lednu roku dva tisíce devadesát tři.'
  },
  {
    id: 'masaryk',
    text: 'V letech tisíc devět set dvacet šest a tisíc devět set dvacet devět přijel do Kostelce sám prezident Masaryk. Na jeho počest pak dostaly jméno Masarykova škola práce a Masarykovo reálné gymnázium.'
  },
  {
    id: 'nova-skola',
    text: 'A teď příběh o škole, která se nikdy nepostavila. Tříd bylo málo. Od roku tisíc devět set dvacet devět se jednalo o nové budově. Hledaly se pozemky, městská delegace jela obhlédnout nové školy až do Zlína a architekt kreslil plány. Dvě třídy se mezitím učily ve vile v parku. Pak přišla zpráva, že nejsou peníze. A potom válka. V zápisu z roku tisíc devět set třicet devět stojí: bude se stavět, jakmile to poměry dovolí. Nová budova ale nevznikla nikdy.'
  },
  {
    id: 'dnes',
    text: 'A jsme v dnešních dnech. Kostelecké základní školy jsou od roku dva tisíce šest sloučené v jednu. Učíme se na Palackého náměstí, v Komenského a Drtinově ulici a družina sídlí i v Erbenově. Od roku dva tisíce osm nese škola jméno Gutha-Jarkovského. Na domě na náměstí, kde kdysi bydlel, visí jeho pamětní deska. Kluk s brýlemi, který se kdysi plížil polem domů do Kostelce, se tak vrátil natrvalo.'
  },
  {
    id: 'outro',
    text: 'A na úplný konec tři rady pana Gutha ze Společenského katechismu. První: První pozdravuje osoba mladší, ale osoba dobře vychovaná nečeká na pozdrav. Druhá: Nejezte hlučně, příliš rychle a nemluvte majíce plná ústa. A třetí: K chybě své se přiznati není nikdy hanbou. Děkuji, že jste se mnou cestovali časem.'
  }
]
