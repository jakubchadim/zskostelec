import re, pathlib, html
root = pathlib.Path(__file__).resolve().parent
svg = lambda name: re.sub(r'<\?xml[^>]*>', '', (root/'svg'/name).read_text())

concepts = [
  dict(key='a-klobouk', name='A · Klobouk', tag='Doporučuji',
       idea='Z portrétu Jiřího Gutha-Jarkovského zůstaly jen tři nejznámější rysy: klobouk, kulaté brýle a knír. Patron školy tak zůstává v logu, jen jako přátelská postavička místo dřevorytu.',
       pros=['Okamžitě rozpoznatelné i v 16 px (favicon, ikona aplikace)', 'Navazuje na původní logo, takže ho škola „pozná“', 'Postavička se dá použít i samostatně: samolepky, trička, maskot Guťáku'],
       cons=['Pro někoho může být až moc hravé na úřední dokumenty, tam pomůže varianta D']),
  dict(key='d-razitko', name='D · Razítko 2.0', tag='Nejbezpečnější',
       idea='Moderní verze současného razítka: zachovává kruh s textem okolo, místo portrétu je uprostřed klobouk z varianty A a písmo je zaoblené.',
       pros=['Nejplynulejší přechod ze starého loga', 'Funguje na vysvědčeních, razítku i webu', 'Ikona uprostřed se dá použít samostatně'],
       cons=['Text v kruhu je v malých velikostech nečitelný, na favicon je potřeba jen střed']),
  dict(key='b-monogram', name='B · Monogram G', tag='Nejmodernější',
       idea='Velké „G“ jako Guth, jehož příčku tvoří tužka mířící dovnitř. Mezerou v písmenu svítí sluníčko.',
       pros=['Čistý, současný, škálovatelný znak', 'Tužka i slunce říkají „škola“ bez textu'],
       cons=['Ztrácí osobnost patrona', 'Monogramů je hodně, je méně unikátní']),
  dict(key='c-pochoden', name='C · Pochodeň z tužky', tag='Příběh',
       idea='Guth-Jarkovský byl spoluzakladatel novodobých olympijských her. Pochodeň, jejíž rukojeť tvoří tužka a plamen tři barevné kapky: učení jako olympijská disciplína.',
       pros=['Silný příběh, který se dá vyprávět dětem', 'Sport + učení v jednom znaku', 'Plamen v barvách webu'],
       cons=['Bez vysvětlení může působit jako sportovní klub', 'Je potřeba nepřiblížit se olympijským symbolům (kruhy)']),
  dict(key='e-budova', name='E · Škola na náměstí', tag='Místní',
       idea='Silueta hlavní budovy na Palackého náměstí se štítem a kulatým okénkem, nad ní slunce a pod ní zelený „úsměv“.',
       pros=['Hned je jasné, že jde o školu', 'Navazuje na 3D model a mapu pracovišť na webu'],
       cons=['Škola má 4 budovy, logo ukazuje jen jednu', 'Domeček je častý motiv mnoha škol']),
]

def lockup(icon, dark=False):
    fg = '#fff9f0' if dark else '#1d2150'
    sub = 'rgba(255,249,240,.75)' if dark else '#5b5a6e'
    return f'''<div class="lockup" style="color:{fg}"><div class="lk-icon">{icon}</div>
<div><div class="lk-title">ZŠ Gutha-Jarkovského</div><div class="lk-sub" style="color:{sub}">Kostelec nad Orlicí</div></div></div>'''

cards = []
for c in concepts:
    icon = svg(c['key'] + '.svg')
    pros = ''.join(f'<li>{html.escape(p)}</li>' for p in c['pros'])
    cons = ''.join(f'<li>{html.escape(p)}</li>' for p in c['cons'])
    sizes = ''.join(f'<div class="size"><div style="width:{s}px;height:{s}px">{icon}</div><span>{s}px</span></div>' for s in (128, 64, 32, 16))
    cards.append(f'''
<section class="concept" id="{c['key']}">
  <header><h2>{c['name']}</h2><span class="tag">{c['tag']}</span></header>
  <p class="idea">{html.escape(c['idea'])}</p>
  <div class="grid3">
    <div class="tile" style="background:#fff9f0">{icon}</div>
    <div class="tile" style="background:#1d2150">{icon}</div>
    <div class="tile" style="background:#ff8a00">{icon}</div>
  </div>
  <div class="row">
    <div class="panel light">{lockup(icon)}</div>
    <div class="panel dark">{lockup(icon, True)}</div>
  </div>
  <div class="row">
    <div class="panel sizes">{sizes}</div>
    <div class="panel mock">
      <div class="tab"><span class="fav">{icon}</span>ZŠ Kostelec nad Orlicí</div>
      <div class="bar"><span class="bar-logo">{icon}</span><b>ZŠ Kostelec</b><span class="bar-nav">Úvod · Aktuality · O škole</span></div>
    </div>
  </div>
  <div class="row">
    <div class="panel"><h3>Proč ano</h3><ul>{pros}</ul></div>
    <div class="panel"><h3>Na co myslet</h3><ul class="cons">{cons}</ul></div>
  </div>
</section>''')

old = svg('puvodni-logo.svg')
page = f'''<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Návrhy loga – ZŠ Gutha-Jarkovského</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap&subset=latin-ext" rel="stylesheet">
<style>
:root{{--ink:#1d2150;--cream:#fff9f0;--paper:#fffdf8;--sun:#ffcf33;--orange:#ff8a00;--berry:#ff5c8a;}}
*{{box-sizing:border-box}} body{{margin:0;background:var(--cream);background-image:radial-gradient(rgba(29,33,80,.07) 1px,transparent 1px);background-size:22px 22px;color:var(--ink);font-family:Nunito,system-ui,sans-serif;line-height:1.55}}
h1,h2,h3,.lk-title,.tag{{font-family:'Baloo 2',ui-rounded,sans-serif}}
main{{max-width:1100px;margin:0 auto;padding:40px 20px 80px}}
h1{{font-size:clamp(2rem,5vw,3.2rem);line-height:1.05;margin:0 0 12px}} .lead{{font-size:1.15rem;max-width:720px;color:#3d3f63}}
.toc{{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 8px}} .toc a{{border:2.5px solid var(--ink);border-radius:999px;padding:6px 14px;background:var(--paper);font-weight:800;color:var(--ink);text-decoration:none;box-shadow:2px 2px 0 var(--ink)}}
.concept,.old{{background:var(--paper);border:2.5px solid var(--ink);border-radius:28px;box-shadow:6px 6px 0 var(--ink);padding:28px;margin-top:40px}}
.concept header{{display:flex;align-items:center;gap:12px;flex-wrap:wrap}} .concept h2{{margin:0;font-size:2rem}}
.tag{{background:var(--sun);border:2px solid var(--ink);border-radius:999px;padding:2px 12px;font-weight:800}}
.idea{{font-size:1.1rem;max-width:760px;color:#3d3f63}}
.grid3{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:20px 0}}
.tile{{aspect-ratio:1;border-radius:22px;border:2.5px solid var(--ink);display:grid;place-items:center;padding:18%}} .tile svg{{width:100%;height:100%}}
.row{{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}}
.panel{{border:2.5px solid var(--ink);border-radius:20px;padding:20px;background:var(--cream)}} .panel.dark{{background:var(--ink)}} .panel.light{{background:#fff}}
.panel h3{{margin:0 0 6px}} .panel ul{{margin:0;padding-left:1.2em}} .panel li+li{{margin-top:4px}} .cons li::marker{{color:var(--berry)}}
.lockup{{display:flex;align-items:center;gap:14px}} .lk-icon{{width:72px;height:72px;flex:none}} .lk-icon svg{{width:100%;height:100%}}
.lk-title{{font-size:1.55rem;font-weight:800;line-height:1}} .lk-sub{{font-weight:700;margin-top:4px}}
.sizes{{display:flex;align-items:flex-end;gap:22px;flex-wrap:wrap}} .size{{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:.8rem;font-weight:700;color:#5b5a6e}} .size svg{{width:100%;height:100%}}
.mock{{display:flex;flex-direction:column;gap:14px;justify-content:center}}
.tab{{display:inline-flex;align-items:center;gap:8px;background:#e9e3d6;border-radius:10px 10px 0 0;padding:8px 14px;font-size:.85rem;font-weight:700;width:max-content}} .fav{{width:16px;height:16px;display:inline-block}} .fav svg{{width:16px;height:16px;display:block}}
.bar{{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid var(--ink);border-radius:14px;padding:8px 14px}} .bar-logo{{width:38px;height:38px}} .bar-logo svg{{width:38px;height:38px;display:block}} .bar b{{font-family:'Baloo 2';font-size:1.2rem}} .bar-nav{{margin-left:auto;font-size:.85rem;font-weight:700;color:#5b5a6e}}
.old .row{{align-items:center}} .old-tile{{background:#c96a1d;border-radius:22px;border:2.5px solid var(--ink);padding:24px;display:grid;place-items:center}} .old-tile svg{{width:100%;max-width:260px;height:auto}}
.note{{margin-top:40px;font-size:.95rem;color:#5b5a6e}}
@media (max-width:720px){{.grid3,.row{{grid-template-columns:1fr}} .tile{{max-width:280px}}}}
</style></head><body><main>
<h1>Návrhy nového loga<br>ZŠ Gutha-Jarkovského</h1>
<p class="lead">Pět směrů, od jemné modernizace razítka po úplně nový znak. Všechny používají barvy a zaoblené písmo nového webu (Baloo 2, oranžová, sluníčkově žlutá, inkoustově modrá). Jde o koncepty: před finálním použitím je potřeba je dotáhnout, hlavně převést text na křivky a doladit detaily.</p>
<nav class="toc"><a href="#puvodni">Současné logo</a>{''.join(f'<a href="#{c["key"]}">{c["name"]}</a>' for c in concepts)}</nav>

<section class="old" id="puvodni">
  <h2 style="margin:0">Současné logo</h2>
  <div class="row">
    <div class="old-tile">{old}</div>
    <div>
      <h3>Co funguje</h3><ul><li>Patron školy Jiří Guth-Jarkovský (klobouk, knír) je silný a jedinečný motiv.</li><li>Kruhové razítko působí důvěryhodně a tradičně.</li></ul>
      <h3 style="margin-top:14px">Co nefunguje</h3><ul class="cons"><li>Detailní dřevorytový portrét se při zmenšení slije, na faviconu ani v mobilu není čitelný.</li><li>Jde jen jednobarevně (bílá), nemá barevnou verzi ani ikonu bez textu.</li><li>Patkové písmo neladí s novým hravým webem.</li></ul>
    </div>
  </div>
</section>
{''.join(cards)}
<p class="note">Soubory jednotlivých znaků jsou ve složce <code>design/logo/svg/</code>. Tahle stránka se generuje skriptem <code>design/logo/build.py</code> (spusťte <code>python3 design/logo/build.py</code> po úpravě SVG).</p>
</main></body></html>'''
(root/'index.html').write_text(page)
print('written', len(page))
