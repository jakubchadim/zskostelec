# Odchod z WordPressu – plán

Cíl: web běží jen na **Vercelu + Cloudflare**. WordPress (a hosting s PHP/MySQL) zmizí.
Škola v adminu spravuje jen to, co přibývá každý týden: **články a fotogalerie** (+ volitelně dokumenty, viz rozhodnutí níže).
Všechno ostatní jsou **statické stránky v kódu**. Úpravy: škola pošle e-mail → úprava přes AI → PR → náhled na Vercelu → merge.

Větev: `static-pages` (z `playful-redesign`). Aktuální WP verzi jde nasadit nezávisle a tohle mergnout později –
statické stránky v `app/src/app/(static)/` mají přednost před catch-all routou, takže fungují i s WP na pozadí.

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
- Řád ŠJ má dvě data (18. 8. 2026 na titulu × 22. 6. 2026 u podpisu); výdej pro žáky je v řádu 11:45–14:30, starší leták uvádí obědy od 11:00. Použil jsem řád.
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
- Menu a rychlé odkazy do `components/nav/menu.ts` (místo `wp-api-menus`), Školská rada rovnou jako externí odkaz.
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
