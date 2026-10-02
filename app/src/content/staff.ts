/*
 * Staff list, positions and school buildings (shown on /zamestnanci/ and
 * used for the staff counts on /pracoviste/). Exported once from WordPress
 * (scripts/export-staff.ts); edit this file directly from now on.
 *
 * priority: lower = higher in the list (vedení školy first), default 50.
 */
import type { StaffBuilding, StaffMember, StaffPosition } from './staff-types'

export const BUILDINGS: StaffBuilding[] = [
  {
    id: '12',
    name: 'Komenského'
  },
  {
    id: '13',
    name: 'Palackého náměstí'
  },
  {
    id: '14',
    name: 'Drtinova (Skála)'
  },
  {
    id: '15',
    name: 'Pobytové středisko'
  },
  {
    id: '16',
    name: 'Školní družina - Erbenova'
  }
]

export const POSITIONS: StaffPosition[] = [
  {
    id: '17',
    name: 'Ředitel školy'
  },
  {
    id: '18',
    name: 'Vedoucí vychovatel ŠD'
  },
  {
    id: '19',
    name: 'Zástupce ředitele 1. stupeň'
  },
  {
    id: '20',
    name: 'Mzdová účetní'
  },
  {
    id: '21',
    name: 'Učitel'
  },
  {
    id: '22',
    name: 'Asistent'
  },
  {
    id: '23',
    name: 'Školník'
  },
  {
    id: '24',
    name: 'Ekonom'
  },
  {
    id: '25',
    name: 'Výchovný poradce'
  },
  {
    id: '26',
    name: 'Metodik prevence'
  },
  {
    id: '27',
    name: 'Vychovatel ŠD'
  },
  {
    id: '39',
    name: 'Zástupce ředitele 2. stupeň'
  },
  {
    id: '56',
    name: 'Kariérový poradce'
  },
  {
    id: '59',
    name: 'Sociální pedagog'
  },
  {
    id: '64',
    name: 'Speciální pedagog'
  },
  {
    id: '65',
    name: 'Koordinátor PP pro 1. stupeň'
  },
  {
    id: '72',
    name: 'Mateřská dovolená'
  }
]

export const STAFF: StaffMember[] = [
  {
    id: '10028',
    name: 'Adamcová Hana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'hana.adamcova@zskostelec.cz',
    phone: '773838405'
  },
  {
    id: '16096',
    name: 'Bábíčková Michaela, Mgr.',
    positionIds: ['21', '72'],
    buildingIds: ['13'],
    priority: 50,
    email: 'michaela.janebova@zskostelec.cz',
    phone: '774440828'
  },
  {
    id: '10027',
    name: 'Bártová Irena, Mgr.',
    positionIds: ['21', '26'],
    buildingIds: ['13'],
    priority: 50,
    email: 'irena.bartova@zskostelec.cz',
    phone: '773838406'
  },
  {
    id: '13868',
    name: 'Bělobrádková Marcela',
    positionIds: ['22', '27'],
    buildingIds: ['12', '16'],
    priority: 50,
    email: 'marcela.belobradkova@zskostelec.cz',
    phone: '773 838 402'
  },
  {
    id: '10058',
    name: 'Bezdíčková Jitka',
    positionIds: ['18'],
    buildingIds: ['16'],
    priority: 50,
    email: 'jitka.bezdickova@zskostelec.cz',
    phone: '773838440'
  },
  {
    id: '31028',
    name: 'Bobišová Lucie, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'lucie.bobisova@zskostelec.cz',
    phone: '773 838 433'
  },
  {
    id: '21470',
    name: 'Bydžovská Lucie',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'lucie.bydzovska@zskostelec.cz',
    phone: '778 974 441'
  },
  {
    id: '38895',
    name: 'Černá Yvona',
    positionIds: ['22'],
    buildingIds: ['13'],
    priority: 50,
    email: 'yvona.cerna@zskostelec.cz',
    phone: '774 125 230'
  },
  {
    id: '18728',
    name: 'Černý Oldřich Bc.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'oldrich.cerny@zskostelec.cz',
    phone: '774 973 372'
  },
  {
    id: '10029',
    name: 'Chadimová Iva, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'iva.chadimova@zskostelec.cz',
    phone: '773838410'
  },
  {
    id: '10015',
    name: 'Chmelařová Libuše, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'libuse.chmelarova@zskostelec.cz',
    phone: '774453440'
  },
  {
    id: '16098',
    name: 'Dohnalová Denisa, DiS.',
    positionIds: ['22'],
    buildingIds: ['13'],
    priority: 50,
    email: 'denisa.dohnalova@zskostelec.cz',
    phone: '774 237 695'
  },
  {
    id: '10048',
    name: 'Dosedlová Hana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'hana.dosedlova@zskostelec.cz',
    phone: '773838407'
  },
  {
    id: '10033',
    name: 'Drozdíková Hana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'hana.drozdikova@zskostelec.cz',
    phone: '773838413'
  },
  {
    id: '21471',
    name: 'Durmanová Lucie',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'lucie.durmanova@zskostelec.cz',
    phone: '776 449 421'
  },
  {
    id: '10049',
    name: 'Faltys Luboš',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'lubos.faltys@zskostelec.cz',
    phone: '773838408'
  },
  {
    id: '10014',
    name: 'Felcmanová Lucie, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'lucie.felcmanova@zskostelec.cz',
    phone: '773838424'
  },
  {
    id: '13862',
    name: 'Fričková Markéta, Mgr.',
    positionIds: ['21', '72'],
    buildingIds: ['13'],
    priority: 50,
    email: 'marketa.frickova@zskostelec.cz',
    phone: '773838450'
  },
  {
    id: '10018',
    name: 'Gabarová Martina, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'martina.gabarova@zskostelec.cz',
    phone: '608632951'
  },
  {
    id: '10030',
    name: 'Gajdová Alena, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'alena.gajdova@zskostelec.cz',
    phone: '773838417'
  },
  {
    id: '10013',
    name: 'Havlová Jana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'jana.havlova@zskostelec.cz',
    phone: '732 192 189'
  },
  {
    id: '10052',
    name: 'Hejčlová Jiřina, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'hejclova.j@zskostelec.cz',
    phone: '773838412'
  },
  {
    id: '31037',
    name: 'Hlaváčková Iva',
    positionIds: ['22'],
    buildingIds: ['12'],
    priority: 50,
    email: 'iva.hlavackova@zskostelec.cz',
    phone: '774440828'
  },
  {
    id: '10053',
    name: 'Jelínková Eva',
    positionIds: ['27'],
    buildingIds: ['14'],
    priority: 50,
    email: 'eva.langrova@zskostelec.cz',
    phone: '773838449'
  },
  {
    id: '16094',
    name: 'Jelínková Zuzana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'zuzana.jelinkova@zskostelec.cz',
    phone: '777794942'
  },
  {
    id: '10042',
    name: 'Kapuciánová Jana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'jana.kapucianova@zskostelec.cz',
    phone: '773838414'
  },
  {
    id: '10038',
    name: 'Karásková Markéta, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'marketa.karaskova@zskostelec.cz',
    phone: '773838425'
  },
  {
    id: '10031',
    name: 'Klícha Karel, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'karel.klicha@zskostelec.cz',
    phone: '773838415'
  },
  {
    id: '10041',
    name: 'Kolář Grundová Michaela, Mgr.',
    positionIds: ['21', '72'],
    buildingIds: ['13'],
    priority: 50,
    email: 'michaela.grundova@zskostelec.cz',
    phone: '608196129'
  },
  {
    id: '38896',
    name: 'Kolaříková Petra, Bc.',
    positionIds: ['22'],
    buildingIds: ['12'],
    priority: 50,
    email: 'petra.kolarikova@zskostelec.cz',
    phone: '773838401'
  },
  {
    id: '16099',
    name: 'Kovaříčková Monika, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'monika.kovarickova@zskostelec.cz',
    phone: '773838403'
  },
  {
    id: '13863',
    name: 'Kozel Miroslav, Mgr.',
    positionIds: ['21', '39'],
    buildingIds: ['13'],
    priority: 50,
    email: 'miroslav.kozel@zskostelec.cz',
    phone: '773838434'
  },
  {
    id: '10005',
    name: 'Kozlová Iva, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'iva.kozlova@zskostelec.cz',
    phone: '773838427'
  },
  {
    id: '10032',
    name: 'Krsková Iva, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'iva.krskova@zskostelec.cz',
    phone: '773838409'
  },
  {
    id: '18729',
    name: 'Kučerová Aneta, Bc.',
    positionIds: ['22'],
    buildingIds: ['13'],
    priority: 50,
    email: 'aneta.kucerova@zskostelec.cz',
    phone: '773 732 256'
  },
  {
    id: '10006',
    name: 'Kuncová Božena, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'bozena.kuncova@zskostelec.cz',
    phone: '773838428'
  },
  {
    id: '10007',
    name: 'Limml Vladimír, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'vladimir.limml@zskostelec.cz',
    phone: '773838429'
  },
  {
    id: '13864',
    name: 'Lukašenko Eleonora, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'eleonora.lukasenko@zskostelec.cz',
    phone: ''
  },
  {
    id: '10037',
    name: 'Málek Petr, Mgr.',
    positionIds: ['21', '56'],
    buildingIds: ['13'],
    priority: 50,
    email: 'petr.malek@zskostelec.cz',
    phone: '775902746'
  },
  {
    id: '10044',
    name: 'Malík Tomáš, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'tomas.malik@zskostelec.cz',
    phone: '774237341'
  },
  {
    id: '13865',
    name: 'Martinec Jan, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'jan.martinec@zskostelec.cz',
    phone: ''
  },
  {
    id: '37246',
    name: 'Marušáková Veronika, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12', '13'],
    priority: 50,
    email: 'veronika.marusakova@zskostelec.cz',
    phone: '773838411'
  },
  {
    id: '16093',
    name: 'Mazánková Jana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'jana.mazankova@zskostelec.cz',
    phone: '773089929'
  },
  {
    id: '10047',
    name: 'Minařík Libor',
    positionIds: ['23'],
    buildingIds: ['13'],
    priority: 50,
    email: 'libor.minarik@zskostelec.cz',
    phone: '773838438'
  },
  {
    id: '31026',
    name: 'Mucha Tomáš, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'tomas.mucha@zskostelec.cz',
    phone: '608196129'
  },
  {
    id: '10000',
    name: 'Němec Jiří, Mgr.',
    positionIds: ['17'],
    buildingIds: ['12', '13', '14', '16'],
    priority: 50,
    email: 'jiri.nemec@zskostelec.cz',
    phone: '775606361'
  },
  {
    id: '16100',
    name: 'Novotná Petra, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'petra.novotna@zskostelec.cz',
    phone: '773838435'
  },
  {
    id: '13156',
    name: 'Nývltová Kateřina, Bc.',
    positionIds: ['20'],
    buildingIds: ['12'],
    priority: 50,
    email: 'katerina.nyvltova@zskostelec.cz',
    phone: '775751229'
  },
  {
    id: '21469',
    name: 'Pakánová Nina, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'nina.pakanova@zskostelec.cz',
    phone: '774 037 355'
  },
  {
    id: '37247',
    name: 'Pavlata Jiří, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'jiri.pavlata@zskostelec.cz',
    phone: '773 838 450'
  },
  {
    id: '32091',
    name: 'Pavlatová Iva, Mgr.',
    positionIds: ['64'],
    buildingIds: ['12', '13', '14'],
    priority: 50,
    email: 'iva.pavlatova@zskostelec.cz',
    phone: '608463622'
  },
  {
    id: '16101',
    name: 'Pejchalová Vladimíra',
    positionIds: ['23'],
    buildingIds: ['14'],
    priority: 50,
    email: 'vladimira.pejchalova@zskostelec.cz',
    phone: '773838439'
  },
  {
    id: '25374',
    name: 'Řeháková Pavla, Mgr.',
    positionIds: ['59', '65'],
    buildingIds: ['12'],
    priority: 50,
    email: 'pavla.rehakova@zskostelec.cz',
    phone: '775177678'
  },
  {
    id: '10011',
    name: 'Ryšková Lucie, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'lucie.ryskova@zskostelec.cz',
    phone: '773838431'
  },
  {
    id: '10034',
    name: 'Šabartová Naděžda, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'nadezda.sabartova@zskostelec.cz',
    phone: '773838416'
  },
  {
    id: '10010',
    name: 'Špačková Šárka, Mgr.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'sarka.spackova@zskostelec.cz',
    phone: '773838432'
  },
  {
    id: '10060',
    name: 'Šveidlerová Jitka, Mgr.',
    positionIds: ['27'],
    buildingIds: ['16'],
    priority: 50,
    email: 'jitka.sveidlerova@zskostelec.cz',
    phone: '773838436'
  },
  {
    id: '10001',
    name: 'Tichá Vladislava, Mgr.',
    positionIds: ['19', '21'],
    buildingIds: ['12', '14'],
    priority: 20,
    email: 'vladislava.ticha@zskostelec.cz',
    phone: '773838418'
  },
  {
    id: '10026',
    name: 'Tomanová Romana, Mgr.',
    positionIds: ['21', '25', '72'],
    buildingIds: ['12', '13', '14'],
    priority: 50,
    email: 'romana.tomanova@zskostelec.cz',
    phone: '608983497'
  },
  {
    id: '10024',
    name: 'Vavřínová Alena',
    positionIds: ['24'],
    buildingIds: ['13'],
    priority: 50,
    email: 'alena.vavrinova@zskostelec.cz',
    phone: '775598553'
  },
  {
    id: '16097',
    name: 'Vecková Eva, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'eva.veckova@zskostelec.cz',
    phone: '773838419'
  },
  {
    id: '10050',
    name: 'Veiserová Dana, Mgr.',
    positionIds: ['21'],
    buildingIds: ['14'],
    priority: 50,
    email: 'dana.veiserova@zskostelec.cz',
    phone: '773838420'
  },
  {
    id: '13870',
    name: 'Vejnarová Iva',
    positionIds: ['22'],
    buildingIds: ['12'],
    priority: 50,
    email: 'iva.vejnarova@zskostelec.cz',
    phone: '775 418 013'
  },
  {
    id: '13867',
    name: 'Vladíková Magdalena',
    positionIds: ['22'],
    buildingIds: ['12'],
    priority: 50,
    email: 'magdalena.vladikova@zskostelec.cz',
    phone: '777 098 647'
  },
  {
    id: '10035',
    name: 'Voborník Luboš, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'lubos.vobornik@zskostelec.cz',
    phone: '773838421'
  },
  {
    id: '10040',
    name: 'Voborníková Eva, PaedDr.',
    positionIds: ['21'],
    buildingIds: ['13'],
    priority: 50,
    email: 'eva.vobornikova@zskostelec.cz',
    phone: '773838422'
  },
  {
    id: '10036',
    name: 'Voltová Kateřina, Mgr.',
    positionIds: ['21'],
    buildingIds: ['13', '14'],
    priority: 50,
    email: 'katerina.voltova@zskostelec.cz',
    phone: '773838423'
  },
  {
    id: '38898',
    name: 'Voženílek Jiří',
    positionIds: ['23'],
    buildingIds: ['12'],
    priority: 50,
    email: 'jiri.vozenilek@zskostelec.cz',
    phone: '773 838 437'
  },
  {
    id: '10059',
    name: 'Zimová Tereza, DiS.',
    positionIds: ['21'],
    buildingIds: ['12'],
    priority: 50,
    email: 'tereza.zimova@zskostelec.cz',
    phone: '608 166 709'
  }
]
