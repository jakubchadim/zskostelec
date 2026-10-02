# Odchod z WordPressu – plán

Cíl: web běží jen na **Vercelu + Cloudflare**. WordPress (a hosting s PHP/MySQL) zmizí.
Škola v adminu spravuje jen to, co přibývá každý týden: **články a fotogalerie** (+ volitelně dokumenty, viz rozhodnutí níže).
Všechno ostatní jsou **statické stránky v kódu**. Úpravy: škola pošle e-mail → úprava přes AI → PR → náhled na Vercelu → merge.

Větev: `static-pages` (z `playful-redesign`). Aktuální WP verzi jde nasadit nezávisle a tohle mergnout později –
statické stránky v `app/src/app/(static)/` mají přednost před catch-all routou, takže fungují i s WP na pozadí.

---

## Stav k 2. 10. 2026 – změřeno, nové pořadí

**WP hosting (Endora) nezvládá zátěž** buildu ani provozu → nejdřív odstřihnout návštěvníky od WP, CMS až potom.

Změřeno (`app/scripts/ftp-measure-uploads.py`, FTP jen čtení) a z exportu DB (`app/db_*.sql`, **v .gitignore – osobní data**):

| | |
|---|---|
| `wp-content/uploads` | **9,3 GB**, 31 000 souborů (originály 9,0 GB, WP zmenšeniny jen 0,2 GB) |
| z toho videa | 108× MP4/MOV = **2,8 GB** (největší 122 MB) |
| fotky | ~36 000 JPG/PNG = 5,9 GB |
| soubory jsou od | 2019 (starší články odkazují na 7 obrázků ze starého CMS, které už nefungují) |
| DB | 3 397 článků, 21 stránek, 30 920 příloh, ~1 840 galerií, 69 zaměstnanců, 107 dokumentů, 28 Guťáků |
| DNS | Hukot (ns1.hukot.cz), web → Vercel (76.76.21.21), **e-mail → Microsoft 365** (MX outlook) |

Nové pořadí:
1. **Export** – data z dumpu DB (přesně, včetně ACF a seznamu originálů `_wp_attached_file`), soubory přes FTP po dávkách (jednorázově ~9 GB, šetrně, přes noc).
2. **Web bez WP** – média do R2 (`media.zskostelec.cz`, stejné cesty `uploads/RRRR/MM/…`), datová vrstva čte export místo REST API → přepnutí domény na nový web, WP už nikdo nezatěžuje.
3. **CMS** (níže) – import ze stejného exportu, škola píše do nového adminu, WP se vypne.

### Cloudflare – co je potřeba nastavit (checklist)

1. **Účet** na cloudflare.com (Free) a v Billing **přidat platební kartu** – bez ní nejde R2 zapnout, i když se vejdeme do free tieru.
2. **Doména do Cloudflare** (kvůli `media.zskostelec.cz` – vlastní doména pro R2 musí být v Cloudflare zóně):
   - Add a site → `zskostelec.cz` → plán **Free** → Cloudflare načte stávající DNS záznamy.
   - **Zkontrolovat, že se převzalo všechno pro e-mail (Microsoft 365):** MX `zskostelec-cz.mail.protection.outlook.com`,
     TXT SPF (`v=spf1 include:spf.protection.outlook.com …`), CNAME `autodiscover`, CNAME `selector1/2._domainkey` (DKIM),
     TXT `_dmarc`, případně TXT `MS=…`. Porovnat se záznamy u Hukotu **před** přepnutím.
   - Web záznamy (A `76.76.21.21`, `www`) nechat jako **DNS only (šedý mráček)** – Vercel si certifikáty řeší sám.
   - U registrátora (Hukot) **změnit nameservery** na ty dva, které ukáže Cloudflare. Propagace minuty až hodiny; e-mail i web jedou dál.
3. **R2 → Create bucket** `zskostelec-media`, Location: Automatic (nebo jurisdikce EU).
4. Bucket → Settings → **Custom Domains → Connect** `media.zskostelec.cz` (veřejné čtení přes CDN; r2.dev URL jen na testy).
5. **R2 → Manage API Tokens → Create**: oprávnění *Object Read & Write*, jen pro bucket `zskostelec-media`.
   Hodnoty do `app/.env.local` (nikam jinam):
   ```
   R2_ACCOUNT_ID=…        # z URL endpointu https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=…
   R2_SECRET_ACCESS_KEY=…
   R2_BUCKET=zskostelec-media
   R2_PUBLIC_URL=https://media.zskostelec.cz
   ```
6. (Až pro CMS) Bucket → Settings → **CORS**: povolit `PUT` z domény webu (přímé nahrávání fotek z adminu do R2).

Náklady: R2 10 GB zdarma, egress zdarma. Originály + naše 2 zmenšeniny ≈ 12–14 GB → **≈ 0,05 $/měs.**
Videa (2,8 GB) časem zvážit přesunout na YouTube / zmenšit.

### CMS – vlastní admin, nebo Payload?

Co admin musí umět: **článek** (titulek, kategorie, text s obrázky/odkazy/soubory, připnout na úvod, koncept/publikovat),
**galerie** (název, datum, hromadně přetáhnout desítky fotek z mobilu, seřadit, titulní fotka, napojit na článek),
přihlášení pro pár učitelů, role (admin / editor).

| | **A) Payload CMS v `app/` (doporučeno)** | **B) Vlastní admin na míru** |
|---|---|---|
| Co to je | hotový open-source headless CMS běžící přímo v Next.js na `/admin` | vlastní stránky `/admin` v našem designu, Drizzle + Neon, editor Tiptap |
| Přihlášení, role, reset hesla | hotové | psát a zabezpečit sami (Auth.js / magic link) |
| Editor textu | hotový (Lexical), přizpůsobitelné bloky | Tiptap – hezký, ale napojení na obrázky/soubory sami |
| Koncepty, verze, náhled | hotové | sami |
| Galerie | **vlastní komponenta** do Payloadu: drag&drop, zmenšení v prohlížeči, přímý upload do R2 | to samé, jen v našem adminu |
| Vzhled | Payload admin s logem, barvami a češtinou (dá se přebarvit, ne „hravý web“) | 100 % ve stylu webu, jen to nejnutnější – nejjednodušší pro učitele |
| Práce | ~4–6 dní | ~8–12 dní |
| Údržba | aktualizace Payloadu (vazba na verzi Next.js – nutno ověřit Next 16) | vše naše, žádné cizí závislosti navíc, ale i všechny chyby a bezpečnost |

**Doporučení: A – Payload jako „motor“, ale s naším rozhraním tam, kde na tom záleží.** Přihlášení, oprávnění,
editor, verze a media pipeline jsou 60 % práce a největší bezpečnostní riziko – to je hotové a prověřené.
Na míru uděláme jen to, co učitelé používají nejvíc: **nahrávání galerie** (přetáhni složku z mobilu → hotovo)
a zjednodušený formulář článku. Admin dostane logo, barvy a češtinu školy.
První krok je **½denní spike**: Payload + Next 16.3 + Neon + R2 – pokud by kompatibilita drhla, přepneme na B
(nic z exportu ani frontendu se tím nezahodí).

Volba B dává smysl, pokud chceš admin, který vypadá přesně jako web, a nevadí delší vývoj.

---

## Fáze 0 – statické stránky (HOTOVO v této větvi)

| Stránka | Co je nového |
|---|---|
| `/skolni-stravovani/` | Data vytažená z naskenovaného *Vnitřního řádu ŠJ* (platný od 1. 9. 2026) a otevírací doby: výdejní časy, **výběr věku → cena**, živý widget **„Stihnu to ještě?“** (odhlášení do 8:00, změna menu do 14:00 předchozího dne), 4 kroky k prvnímu obědu, platby (účet, VS/SS), FAQ „Co když…“ (nemoc, ztráta čipu, alergie…), kontakt, PrimiApp leták s QR |
| `/historie/` | Interaktivní časová osa (14. stol. → 1925) s rozbalováním, „Jak žili kantoři“, profil Gutha-Jarkovského |
| `/uredni-deska/` | IČ / IZO / datová schránka / účty s **tlačítkem Kopírovat**, organizační struktura přepsaná z obrázku do HTML, žádosti/ceník/stížnosti/předpisy v akordeonu |
| `/prevence-rizikoveho-chovani/` | „Potřebuji pomoc“ pro žáky a rodiče, programy 2025/26 s **filtrem 1./2. stupeň**, částky dotací, dokumenty, spolupracující odborníci |
| `/karierove-poradenstvi/` | **Odpočet** do přihlášek (1.–22. 2. 2027) a přijímaček (12.–13. 4. 2027), kontakty ÚP a PPP |
| `/vychovne-poradenstvi/` | Kontakt, činnosti ve 3 kartách, zápis do 1. tříd, poradny |
| `/skolni-druzina/` | Básnička, 2 pracoviště s časy a vychovatelkami, poplatky, pravidla, akce rozdělené podle ročních období |
| `/klub-rodicu/`, `/dotacni-programy-projekty/`, `/prohlaseni-o-pristupnosti/` | Přeskládané do karet |
| `/skolska-rada/` | 307 redirect na `https://www.kostelecno.cz/skolska-rada` (`app/next.config.ts`) |

Technicky:
- Sdílené komponenty: `app/src/components/static/` (`kit.tsx` – Section, PersonCard, DocList, FactGrid, Accordion, JumpNav…; interaktivní widgety jsou samostatné client komponenty).
- Soubory (PDF, obrázky) zkopírované z WP do `app/public/soubory/<stránka>/` – nezávisí na WP.
- `STATIC_PAGE_SLUGS` (`components/static/meta.ts`) – catch-all je vynechává v `generateStaticParams`.

**K ověření se školou** (našel jsem při převodu):
- Řád ŠJ má dvě data (18. 8. 2026 na titulu × 22. 6. 2026 u podpisu). Otevírací doba je podle letáku jídelny (obědy 11:00–14:30); řád uvádí výdej pro žáky 11:45–14:30.
- Kariérové poradenství odkazovalo na .docx s termíny pro rok 2023/24 – nahrazeno samotnými daty 2027.
- Prohlášení o přístupnosti citovalo „§ 7 zákona 356/2000 Sb.“ – opraveno na zákon č. 99/2019 Sb. (zjevný překlep).
- Na Úřední desce byly rozbité e-mailové odkazy ředitele a pověřence (chybělo `mailto:`) – opraveno.

---

## Co zůstane v CMS a co ne

| Obsah | Objem (snapshot 9/2026) | Kam |
|---|---|---|
| Články + kategorie | 3 388 článků (~250/rok) | **CMS** |
| Fotogalerie | 1 836 galerií, ~30 000 fotek | **CMS** |
| Obsahové stránky | 17 stránek | **kód** (hotovo, kromě Pracoviště – viz F1) |
| Menu (hlavní + 2 rychlá) | 3 menu | **kód** |
| Úvodní strana (hlavní článek, kategorie) | ACF pole | **kód** + příznak „připnout“ u článku v CMS |
| Zaměstnanci | 69 osob | **kód** (TS/JSON, mění se 1–2× ročně) |
| Guťák | 2 čísla | **kód** |
| Dokumenty | 104 souborů v kategoriích | **rozhodnout** – doporučuji CMS (řády, formuláře, výroční zprávy nahrávají přímo ve škole a přes e-mail by to bylo nejčastější zdržení) |

---

## Architektura

```
              ┌──────────── Vercel ────────────┐
 návštěvník → │ Next.js app (app/)             │
              │  ├─ statické stránky (kód)     │
              │  ├─ články/galerie (ISR + tagy)│
              │  └─ /admin  ← Payload CMS      │
              └───────┬───────────────┬────────┘
                      │               │
          Postgres (Neon přes         Cloudflare R2 (média)
          Vercel Marketplace)         media.zskostelec.cz + CDN
                                      DNS + proxy: Cloudflare
```

- **Payload CMS 3** přímo v Next.js aplikaci (`/admin`). Dává zadarmo: přihlášení a role, editor (Lexical), drafty,
  verze, náhled, upload médií. Kolekce: `users`, `categories`, `posts`, `galleries`, `media` (+ `documents`).
- **DB: Postgres na Neonu přes Vercel Marketplace** (účtuje se přes Vercel, free tier stačí). Cloudflare D1 z Vercelu
  rozumně použít nejde – D1 adaptér Payloadu běží jen na Workers.
  *Alternativa „jeden poskytovatel“*: celé na Cloudflare Workers (OpenNext + Payload D1/R2 šablona) – pak bez Vercelu.
- **Média na R2**, veřejná doména `media.zskostelec.cz` za Cloudflare CDN.
  - Varianty velikostí (náhled ~640 px, velká ~2048 px) **generovat při nahrání**, ne on-the-fly → žádné poplatky za
    Vercel Image Optimization ani Cloudflare Image Transformations. `next/image` s vlastním loaderem, který vybírá variantu.
  - **Hromadné nahrání galerie**: limit těla requestu na Vercelu je 4,5 MB → fotky jdou z prohlížeče **přímo do R2**
    (presigned URL / `clientUploads` v `@payloadcms/storage-s3`), v prohlížeči se před nahráním zmenší (originál 20 MB z
    mobilu → ~1 MB). Vlastní komponenta v adminu: drag & drop celé složky, progress, řazení, výběr titulní fotky.
- **Revalidace**: `afterChange` hooky v Payloadu volají `revalidateTag` (infrastruktura tagů v `lib/wp` už je, jen se
  přepojí). Nový článek je venku do pár sekund, bez rebuildu.
- **Data vrstva**: `app/src/lib/wp/` → `app/src/lib/cms/` (Payload Local API, typy generuje Payload). Šablony
  (`components/templates/*`) zůstávají, mění se jen zdroj dat. Gutenberg block renderer se nahradí rendererem Lexicalu.
- **Staré URL**: zachovat `/clanky/<kategorie>/<slug>/` a adresy galerií. Média z WP nahrát do R2 se **stejnou cestou**
  (`uploads/2023/11/x.png`) → jedno pravidlo `/wp-content/uploads/*` → `media.zskostelec.cz/uploads/*` (Cloudflare
  Redirect Rule) a staré odkazy z e-mailů/Facebooku fungují dál.

Riziko k ověření hned na začátku (spike, ~½ dne): verze Payloadu kompatibilní s **Next 16.3** a React 19.2 v `app/`.
Pokud by to drhlo, Payload jako samostatný Vercel projekt `admin.zskostelec.cz` (web čte přes REST) – zbytek plánu stejný.
Záložní varianta bez Payloadu: vlastní mini-admin (Better Auth + Drizzle + Tiptap) – víc práce, ale jen 2–3 formuláře.

---

## Fáze

**F1 – web nezávislý na WP mimo články/galerie** (1–2 dny)
- ~~Menu a rychlé odkazy do `components/nav/menu.ts`~~ – **hotovo**: nová hierarchie (Úvod · Aktuality · O škole · Pro rodiče · Poradenství · Prezentace), EduPage jako samostatné tlačítko v hlavičce, Školská rada jako externí odkaz.
- Pracoviště: fotky do `public/`, počty zaměstnanců ze statických dat.
- Zaměstnanci (69) a Guťák → TS data + jednorázový export z WP; šablony beze změny.
- Úvodní strana: konfigurace kategorií v kódu.

**F2 – CMS** (3–5 dní)
- Spike kompatibility (viz výše) → Payload do `app/`, Neon přes Marketplace, R2 bucket + doména, env proměnné ve Vercelu.
- Kolekce + role (`admin` = já, `editor` = škola: jen články, galerie, dokumenty).
- Bulk upload galerií s resize v prohlížeči; generování variant.
- Česky lokalizovaný admin, jednoduchá nápověda pro školu (1 stránka).

**F3 – přepojení frontendu** (2–3 dny)
- `lib/cms` místo `lib/wp`, renderer Lexicalu, revalidace z hooků, sitemap.

**F4 – migrace obsahu** (2–3 dny + běh skriptu)
- Skript (Node, lokálně): WP REST (crawler `app/scripts/crawl-api.js` už existuje) → Payload Local API.
  Kategorie → články (bloky → Lexical: odstavec, nadpis, obrázek, seznam, tabulka, citace, tlačítko, soubor) → galerie.
- Média: stáhnout originály (velikost `wp-content/uploads` změřit na serveru – odhad desítky GB), `sharp` vygeneruje
  varianty, upload do R2 se zachováním cesty. Idempotentní (dá se pustit znovu jen na rozdíl).
- Kontrola: počty, náhodný vzorek vizuálně, crawl všech URL na 404, kontrola odkazů na `wp-content`.

**F5 – přepnutí** (½ dne)
- Zmrazit WP (read-only), finální rozdílová migrace, DNS na Cloudflare → Vercel, redirect pravidla, Search Console.
- WP nechat 1–2 měsíce vypnutý ale zálohovaný, pak zrušit hosting.

---

## Workflow pro statické stránky

1. Škola pošle e-mail („změnil se telefon“, „nový řád jídelny v příloze“).
2. AI upraví příslušný `app/src/app/(static)/<stránka>/page.tsx` (obsah je přímo v souboru, žádná abstrakce navíc),
   nové PDF do `public/soubory/<stránka>/`.
3. PR → Vercel preview URL → poslat škole ke kontrole → merge = nasazeno.

Velké soubory (PDF > pár MB) časem přesunout z `public/` do R2, ať repo neroste.

## Náklady (orientačně)
- Vercel: Hobby je jen pro nekomerční osobní projekty → spíš **Pro $20/měs.** (ověřit, zda škola nespadá pod výjimku / sponzoring).
- Neon: free tier (0,5 GB) stačí pro texty.
- R2: 10 GB zdarma, pak $0,015/GB/měs., **egress zdarma** – při ~50 GB ≈ $0,60/měs.
- Cloudflare DNS/CDN: zdarma.
