# UX audit a redesign – ZŠ Kostelec (Next.js, `app/`)

Větev: `playful-redesign` (odbočená z `app-rewrite`). Audit dělán proti lokálnímu mock API (`npm run mock-server`, snapshot produkčních dat), desktop 1440 px a mobil 390 px.

---

## 1. Shrnutí

Nový stack (Next 16 + Tailwind 4 + REST) je technicky v dobrém stavu, ale vizuálně i UX-ově je to 1:1 port webu z roku 2019: oranžová lišta, šedobílé karty, drobné písmo, hodně prázdného místa a žádná „osobnost“ základní školy. K tomu jsem našel několik skutečných chyb (nejzávažnější: **mizející obrázky/tlačítka/soubory v obsahu** a **nečitelné články bez odstavců**).

Redesign jde směrem **„hravá škola“**: krémový papír, zaoblené písmo, obrysové „samolepkové“ karty s tvrdým stínem, pestrá paleta, kreslené doodly (hvězdy, vlaštovka, tužka, sluníčko) a jemné animace. Obsah a datová vrstva zůstaly beze změny – všechno se dál plní z WordPressu, redakce nemusí nic nastavovat.

---

## 2. Nalezené chyby (bugy)

| # | Závažnost | Problém | Stav |
|---|---|---|---|
| B1 | 🔴 vysoká | **Bloky `core/image`, `core/button`, `core/file` mizí z obsahu.** Pipeline normalizace běží dvakrát (entity vrstva + `BlockContent`) a per-type normalizery nejsou idempotentní. Jakmile se v běžícím serveru jednou vyrenderuje `BlockContent`, registr je naplněný a druhý průchod bloky zahodí. Na produkci by to znamenalo, že po prvním requestu zmizí fotky budov na „Pracoviště“, soubory na „Historie“ atd. Tabulkám se navíc ztrácel popisek. | ✅ opraveno (`lib/wp/blocks/normalizer.ts` + test) |
| B2 | 🔴 vysoká | **Články jsou „zeď textu“** – Tailwind preflight nuluje `margin` u `<p>`, takže odstavce nemají mezery. Stejně tak nadpisy a seznamy v obsahu. | ✅ nový `.wp-prose` styl |
| B3 | 🟠 střední | **Odkazy v obsahu nevypadají jako odkazy** (globálně `color: inherit; text-decoration: none`). Např. „Školní stravování“ – tři odkazy na PDF vypadají jako běžný text. | ✅ podtržené, barevné odkazy |
| B4 | 🟠 střední | **Detail článku vnořuje `<section>` + `Container` + vlnu do sloupce** → dvojí padding, velká mezera pod nadpisem, dekorativní vlna uprostřed sloupce. | ✅ `BlockContent inline` |
| B5 | 🟠 střední | **Kontrast**: bílý text na `#ff9800` (hlavička, tlačítka) má poměr ~2,2 : 1 – neprojde WCAG AA. Šedé datumy s `opacity-50` také. | ✅ tmavý „ink“ text na barevných plochách |
| B6 | 🟡 nízká | „Další články“ v detailu článku může obsahovat právě otevřený článek (spoléhá čistě na `exclude` v API). | ✅ pojistka i na klientu |
| B7 | 🟡 nízká | Úvodka stahovala **všechny galerie (~900, 9 requestů)** – nově by to bylo jen kvůli 10 fotkám. | ✅ `getLatestGalleries(limit)` = 1 request |
| B8 | ℹ️ info | Mock server ignoruje `_fields`, takže lokálně padá data cache („items over 2MB“) a stránky galerií se renderují 30–50 s. V produkci se to neděje, ale lokální vývoj to brzdí. | ⏳ návrh: filtrovat `_fields` v `scripts/mock-server.js` |
| B9 | ℹ️ info | Kolize cest: `/skolni-stravovani/`, `/skolni-druzina/`, `/vychovne-poradenstvi/` existují jako stránka i jako příspěvek (log `[wp/route] path collision`). Vyhrává stránka, příspěvek je nedostupný. | ⏳ řešit v adminu (přejmenovat slug příspěvku) |

---

## 3. UX analýza (před redesignem)

### Kdo web používá a proč
1. **Rodiče** (většina návštěv, hlavně z mobilu): upozornění (seznamy pomůcek, provoz družiny, zápisy), EduPage, jídelna, kontakty na učitele, formuláře.
2. **Žáci**: fotky z akcí, úspěchy, Guťák, žákovský web.
3. **Veřejnost / budoucí rodiče**: jaká je škola, kde je, jak vypadá.
4. **Úřady**: úřední deska, dokumenty, povinné informace.

### Problémy
**Úvodní stránka**
- Hero = logo + nadpis hlavního článku. Neřekne nic o škole, žádná fotka dětí, přitom v galeriích jsou stovky krásných fotek.
- Karty „Upozornění / Aktuality / Úspěchy“ mají **vnitřní scroll** s fade efektem – na desktopu se scroll-in-scroll špatně ovládá, obsah je uřezaný (text uprostřed věty), na mobilu se zobrazí jen 1 článek.
- „Rychlé menu“ jsou dva seznamy drobných odkazů v kartách stejně vypadajících jako novinky → nejpoužívanější cíle (EduPage, dokumenty, zaměstnanci) nejsou vizuálně odlišené.
- Upozornění (časově kritická informace pro rodiče) vypadají stejně jako běžné aktuality.
- Fotogalerie na úvodce vůbec není.

**Navigace**
- 7 položek s dropdowny, některé mají jen 1 podpoložku („Informace → Školní družina“, „Studium → Přístupy → Edupage“) – zbytečný klik navíc. *(Obsahová věc – doporučuji v adminu sloučit, viz kap. 6.)*
- Chybí aktivní stav (kde jsem).
- Mobilní menu: malé položky, akordeony bez vizuální hierarchie.
- Chybí „skip link“ pro klávesnici / čtečky.

**Výpis článků**
- Karty s pevnou výškou nadpisu (`h-[3.3em]`) → dlouhé názvy se ořízly, krátké nechávají díru.
- Filtr podkategorií skrytý za podtržené „vyberte kategorii“ vedle nadpisu – málo objevitelné, na mobilu malý cíl.
- Tlačítko „Zobrazit“ je jediná klikací plocha (malá).
- Stránkování se ukazovalo i pro jednu stránku.

**Detail článku**
- Viz B2/B4: nečitelný text, žádná metadata (délka čtení), sidebar se stejnými velkými kartami jako výpis.

**Zaměstnanci / Dokumenty**
- Postranní filtr s 18 checkboxy „Pozice“ – dlouhý seznam, na mobilu odsune výsledky úplně dolů.
- Hledání **nerespektuje diakritiku** („nemec“ nenajde „Němec“, „prihlaska“ nenajde „Přihláška“) – na mobilní klávesnici typická situace.
- Žádný počet výsledků, u zaměstnanců telefon/e-mail jako drobný text (na mobilu jde kliknout, ale není to vidět).
- Dokumenty: malé tlačítko „Stáhnout“ jako jediný cíl.

**Galerie / Guťák**
- Obyčejná mřížka, šedé placeholdery u Guťáku (existující logo Guťáku se nepoužívalo).

**404 / prázdné stavy**
- Generické ikony a „Nalezeno 0 článků. Zkuste hledat jinde.“

---

## 4. Co jsem změnil

### Design systém (`src/app/globals.css`)
- **Paleta**: školní oranžová zůstala jako hlavní značka, přibyly akcenty `sun`, `sky`, `berry`, `grass`, `grape`, `teal` (+ světlé „tint“ varianty). Tmavě modrý „ink“ (#1d2150) místo černé.
- **Písmo**: Baloo 2 (nadpisy – kulaté, přátelské) + Nunito (text – kulaté, dobře čitelné), obojí s `latin-ext`, self-hosted přes `next/font`. Základní velikost 17 px.
- **Utility**: `sticker` (obrysová karta), `btn` (tlačítko s „cvaknutím“), `hover-lift`, `squiggle`, `highlight`, `font-display`.
- **Animace**: `float`, `drift` (mraky), `fly` (vlaštovka), `marquee`, `pop-in`, `wiggle`, scroll-reveal (`<Reveal>`). Vše vypnuto při `prefers-reduced-motion`. Reveal skrývá obsah až z JS, takže bez JS / pro vyhledávače je obsah vidět.
- **Pozadí**: jemný tečkovaný „sešitový“ papír.
- Legacy názvy tokenů (`primary-1`, `gray-1..9`…) zůstaly, protože na ně mapuje barevná paleta Gutenberg bloků.

### Komponenty
- `ui/doodles.tsx` – SVG doodly (hvězda, jiskra, vlnovka, vlaštovka, tužka, sluníčko, mrak, raketa, blob, vlnitý okraj).
- `ui/page-hero.tsx` – barevná hlavička každé podstránky (barva podle sekce, zpětný odkaz, meta „štítky“).
- `ui/reveal.tsx`, `ui/accent.ts` (cyklování barev a náklonů).
- `filter/search-field.tsx`, `filter/chip-group.tsx` – sdílené hledání a filtry.

### Stránky
| Stránka | Změna |
|---|---|
| **Hlavička** | Logo v kulatém odznaku, „pilulková“ navigace s aktivním stavem, dropdowny jako karty s barevnými tečkami; mobil: celoobrazovkové menu s velkými barevnými dlaždicemi; skip link. |
| **Úvod** | Hero s claimem, 2 CTA (Co je nového / EduPage), karta „Právě teď“ s hlavním článkem a **koláž polaroidů z posledních galerií**. Pod tím dlaždice rychlých odkazů s ikonami (ikona se vybírá automaticky podle názvu). **Nástěnka** – upozornění jako připíchnuté lístečky na korkové tabuli. Aktuality jako karty + panel Úspěchy žáků. **Nekonečný pás fotek** z galerií (zastaví se při najetí). Blok Pracoviště s letícími mraky. |
| **Kategorie** | Hero s počtem článků, podkategorie jako viditelné čipy, karty s „kalendářovým lístkem“ data, celá karta klikací. |
| **Článek** | Hero s datem a délkou čtení, text na „papírové“ kartě v čitelné šířce, galerie jako polaroidy, sticky sidebar „Další z rubriky“. |
| **Stránka** | Hero + obsah v čitelné šířce (~75 znaků), pěkné seznamy (barevné puntíky), tabulky, citace, obrázky, soubory. |
| **Fotogalerie** | Nakloněné polaroidy s washi páskou, narovnají se při najetí. Detail: počet fotek, mřížka 2/3/4 sloupce, lightbox, „Načíst další (N)“. |
| **Zaměstnanci** | Velké hledání + čipy Pracoviště/Pozice (pozice sbalené na 8 + „další“), počet výsledků, karty s iniciálami v barevném kolečku, telefon/e-mail jako tlačítka. |
| **Dokumenty** | Hledání + čipy kategorií, sekce s počty, řádky celé klikací, barva ikony podle typu (PDF/Word/Excel…). |
| **Guťák** | Obálky jako časopisy na stole; chybějící náhled nahrazuje existující logo Guťáku. |
| **Patička** | Vlna, doodly, kontakt s odkazem na mapu, „Nahoru“ s raketou. |
| **404** | „Ups! Tahle stránka utekla o přestávce“ s vlaštovkou. |

### Chování
- Hledání zaměstnanců a dokumentů ignoruje diakritiku (`foldText` v `lib/utils.ts`), testy upraveny.
- Stránkování: `aria-current`, `aria-label`, skryté pro 1 stránku.
- Výsledky filtrů hlášené přes `aria-live`.

---

## 5. Ověření
- `npx tsc --noEmit` ✅, `npm test` ✅ (206 testů, +1 regresní pro B1), `npx eslint src` ✅ (jen původní warning u `<img>` ve `WpImage`), `next build` ✅.
- Ručně prokliknuto proti mock API: úvod, aktuality, článek, fotogalerie + detail, zaměstnanci, dokumenty, Guťák, úřední deska (tabulka), školní družina (citace, seznamy), pracoviště (obrázky), historie (soubory) – desktop i mobil 390 px.

## 6. Doporučení a otevřené body (na rozhodnutí)
1. **Texty k potvrzení** – claim v hero („Učíme se s radostí a objevujeme svět“), perex pod ním, „Škola, kde se učíme s radostí, zvědavostí a respektem“ v patičce, perexy na podstránkách. Jsou napsané jako návrh; ideálně je přesunout do ACF polí homepage, aby je škola mohla měnit.
2. **Kontakty v patičce** – v datech není obecný školní e-mail/telefon, proto je tam jen adresa + odkaz na zaměstnance. Pokud škola chce ústřednu/e-mail, doplnit (ideálně ACF „nastavení webu“).
3. **Menu v adminu**: položky s jedinou podpoložkou („Informace“, „Studium“) sloučit na přímé odkazy – ušetří klik.
4. **Fotky zaměstnanců** – v datech nejsou, proto iniciály. Pokud se doplní, karta je automaticky použije.
5. **Mock server** – respektovat `_fields` (B8) pro rychlejší lokální vývoj.
6. **Kolize slugů** (B9) opravit v adminu.
7. Další nápady: „Jídelníček dnes“ widget (primiapp), kalendář akcí z EduPage, vyhledávání přes celý web, přepínač vysokého kontrastu.
