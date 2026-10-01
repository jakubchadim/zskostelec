"""
Variants of logo concept A ("Klobouk"), refined after studying photos of
Jiří Stanislav Guth-Jarkovský. Writes svg/a1..a5 and a-varianty.html.

    python3 design/logo/build_a.py
"""
import html
import pathlib

root = pathlib.Path(__file__).resolve().parent
INK = '#1d2150'
ORANGE = '#ff8a00'
SUN = '#ffcf33'
CREAM = '#fff9f0'
SKIN = '#ffd9b0'
SKIN_SHADE = '#f2b98c'
WHITE_HAIR = '#f4f1ea'


def wrap(body, label, bg=ORANGE):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="{label}">
  <rect width="100" height="100" rx="26" fill="{bg}"/>
{body}
</svg>
'''


# --- parts ---------------------------------------------------------------

def head_broad(y=0):
    # Broad, round older face with ears - the 1919/1937 photos.
    return f'''  <g transform="translate(0 {y})">
  <circle cx="27.5" cy="63" r="5.5" fill="{SKIN}"/><circle cx="72.5" cy="63" r="5.5" fill="{SKIN}"/>
  <path d="M28 50 C27 77 37 90 50 90 C63 90 73 77 72 50 Z" fill="{SKIN}"/>
  </g>'''


def fedora(band=SUN, y=0, rotate=0, cx=50):
    # Flat-topped crown with a pinch and a softly curved wide brim - the plaque in Kostelec.
    return f'''  <g transform="translate(0 {y}) rotate({rotate} {cx} 46)">
  <path d="M32 46 L34 21 Q35 17 40 17 H60 Q65 17 66 21 L68 46 Z" fill="{INK}"/>
  <path d="M41 21 Q50 25 59 21" fill="none" stroke="#3d4277" stroke-width="2" stroke-linecap="round"/>
  <rect x="33" y="36" width="34" height="6" fill="{band}"/>
  <path d="M13 47 Q50 39 87 47 Q89 52 83 53.5 Q50 47 17 53.5 Q11 52 13 47 Z" fill="{INK}"/>
  </g>'''


def round_glasses(thick=True, y=0):
    w = 3.6 if thick else 2.2
    return f'''  <g transform="translate(0 {y})">
  <path d="M31.5 61.5 L28 60 M68.5 61.5 L72 60" stroke="{INK}" stroke-width="2.4" stroke-linecap="round"/>
  <circle cx="40" cy="62" r="8.5" fill="{CREAM}" stroke="{INK}" stroke-width="{w}"/>
  <circle cx="60" cy="62" r="8.5" fill="{CREAM}" stroke="{INK}" stroke-width="{w}"/>
  <path d="M36.5 58.5 Q38 57 40 57" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M56.5 58.5 Q58 57 60 57" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M48 61 Q50 59 52 61" fill="none" stroke="{INK}" stroke-width="2.6" stroke-linecap="round"/>
  </g>'''


def nose(y=0):
    return f'  <path d="M50 64 C46.5 70 47 73.5 50 73.5 C53 73.5 53.5 70 50 64 Z" fill="{SKIN_SHADE}" transform="translate(0 {y})"/>'


def handlebar(color=WHITE_HAIR, y=0, curl=1.0):
    # Bushy moustache with ends twisted upwards (white in old age, dark when young).
    c = curl
    return f'''  <path transform="translate(0 {y})" d="M50 74.5
    C46 71 38 70.5 33 74 C30.5 75.8 28.2 74.6 27 {71.5 - 2 * c}
    C25.8 {76 + c} 30 80.5 36.5 79.5 C42 78.7 46 77.6 50 77.6
    C54 77.6 58 78.7 63.5 79.5 C70 80.5 74.2 {76 + c} 73 {71.5 - 2 * c}
    C71.8 74.6 69.5 75.8 67 74 C62 70.5 54 71 50 74.5 Z"
    fill="{color}" stroke="{INK}" stroke-width="1.8" stroke-linejoin="round"/>'''


def bow_tie(y=0, color=SUN):
    return f'''  <g transform="translate(0 {y})">
  <path d="M50 92 L41 87.5 L41 96.5 Z M50 92 L59 87.5 L59 96.5 Z" fill="{color}" stroke="{INK}" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="50" cy="92" r="2.4" fill="{INK}"/>
  </g>'''


def bald_head():
    # 1937: bald crown, short white hair at the sides, broad face.
    return f'''  <circle cx="27" cy="58" r="5.5" fill="{SKIN}"/><circle cx="73" cy="58" r="5.5" fill="{SKIN}"/>
  <path d="M27 50 C27 26 37 15 50 15 C63 15 73 26 73 50 C73 78 63 90 50 90 C37 90 27 78 27 50 Z" fill="{SKIN}"/>
  <path d="M26.5 60 C23 56 23.5 49 27 46 C26 50 28 53 30.5 54 C29.5 57 28.5 59 26.5 60 Z" fill="{WHITE_HAIR}" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M73.5 60 C77 56 76.5 49 73 46 C74 50 72 53 69.5 54 C70.5 57 71.5 59 73.5 60 Z" fill="{WHITE_HAIR}" stroke="{INK}" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M40 24 Q46 21 52 22" fill="none" stroke="#ffe9cf" stroke-width="3" stroke-linecap="round"/>'''


# --- variants ------------------------------------------------------------

variants = []

variants.append(dict(
    key='a1-deska', name='A1 · Podle pamětní desky', tag='Doporučuji',
    idea='Nejvěrnější podoba podle bronzové desky v Kostelci a fotek: klobouk s plochou korunou a zvlněnou krempou, široký obličej, kulaté brýle, bílý knír se stočenými konci a motýlek z fotky s Coubertinem.',
    svg=wrap('\n'.join([head_broad(), nose(), round_glasses(), handlebar(), fedora(), bow_tie()]),
             'ZŠ Gutha-Jarkovského – A1')))

variants.append(dict(
    key='a2-1896', name='A2 · Mladý olympionik (1896)', tag='Příběh',
    idea='Guth v době založení olympijských her: tmavý, výrazně stočený knír a drobné kulaté brýle. Mladistvější a energičtější, hodí se ke sportu a k dětem.',
    svg=wrap('\n'.join([
        head_broad(), nose(),
        round_glasses(thick=False),
        handlebar(color='#3b2a22', curl=2.6),
        fedora(band='#ff5c8a'),
    ]), 'ZŠ Gutha-Jarkovského – A2')))

variants.append(dict(
    key='a3-1937', name='A3 · Bez klobouku (1937)', tag='Nejvěrnější tváři',
    idea='Podle známého portrétu z roku 1937: holá hlava s bílými vlasy po stranách, výrazné tmavé kulaté brýle a hustý bílý knír. Bez klobouku je patrné, že jde o konkrétního člověka, ale ztrácí se vazba na staré logo.',
    svg=wrap('\n'.join([bald_head(), nose(), round_glasses(), handlebar(), bow_tie(color=SUN)]),
             'ZŠ Gutha-Jarkovského – A3')))

line = f'''  <g fill="none" stroke="{INK}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M33 45 L35 21 Q36 18 40 18 H60 Q64 18 65 21 L67 45"/>
  <path d="M14 48 Q50 40 86 48"/>
  <path d="M34 38 H66"/>
  <circle cx="40" cy="62" r="8"/><circle cx="60" cy="62" r="8"/>
  <path d="M48 61 Q50 59 52 61"/>
  <path d="M32 61 L28.5 59.5 M68 61 L71.5 59.5"/>
  <path d="M50 74.5 C45 70.5 36 70.5 31 74.5 C28.5 76.5 26 74.5 27 71.5 C28 69.5 30.5 70 30.5 72"/>
  <path d="M50 74.5 C55 70.5 64 70.5 69 74.5 C71.5 76.5 74 74.5 73 71.5 C72 69.5 69.5 70 69.5 72"/>
  <path d="M41 85 Q50 90 59 85"/>
  </g>'''
variants.append(dict(
    key='a4-linka', name='A4 · Linka', tag='Elegantní',
    idea='Stejná postava jednou linkou. Klidná a elegantní varianta pro razítko, vysvědčení, výšivku nebo gravírování, jako připomínka autora Společenského katechismu.',
    svg=wrap(line, 'ZŠ Gutha-Jarkovského – A4', bg=CREAM)))

greet = '\n'.join([
    '  <g transform="translate(50 93) scale(.8) translate(-50 -93)">',
    bald_head(), nose(), round_glasses(), handlebar(curl=2),
    '  </g>',
    fedora(y=-13, rotate=-14),
    f'''  <path d="M78 22 Q83 26 82 32 M84 16 Q91 22 89 31" fill="none" stroke="{SUN}" stroke-width="2.8" stroke-linecap="round"/>''',
])
variants.append(dict(
    key='a5-pozdrav', name='A5 · Smeknutí klobouku', tag='Nejhravější',
    idea='Pan Guth smeká klobouk na pozdrav, jak se sluší podle jeho Společenského katechismu. Hravé a vtipné, skvělé na web, samolepky a jako animace (klobouk se zvedne při najetí myší).',
    svg=wrap(greet, 'ZŠ Gutha-Jarkovského – A5')))

for v in variants:
    (root / 'svg' / f"{v['key']}.svg").write_text(v['svg'])

# --- page ----------------------------------------------------------------

photos = [
    ('reference/deska-kostelec.jpg', 'Pamětní deska v Kostelci nad Orlicí',
     'Klobouk s plochou korunou a širokou krempou, kulaté brýle, stočený knír. Hlavní předloha.',
     'Ben Skála, CC BY-SA 3.0, Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Kostelec_nad_Orlic%C3%AD-Guth-Jarkovsk%C3%BD.jpg'),
    ('reference/guth-1937.jpg', 'Portrét, 1937',
     'Tmavé kulaté obroučky, bílý hustý knír, holá hlava s bílými vlasy po stranách, široká tvář.',
     'Neznámý autor, volné dílo, Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Ji%C5%99%C3%AD_Stanislav_Guth-Jarkovsk%C3%BD_1937.jpg'),
    ('reference/guth-coubertin-1925.jpg', 'S Pierrem de Coubertinem, 1925',
     'Klobouk v ruce, kulaté brýle, motýlek, hůlka. Elegance a olympijské hry.',
     'Neznámý autor, volné dílo, Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Coubertin_and_Guth_1925.jpg'),
    ('reference/guth-1919.jpg', 'Portrét z Českého alba, 1919',
     'Velký knír se stočenými konci, drobné kulaté brýle, kulatý obličej.',
     'Bohumil Vavroušek, volné dílo, Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:Ji%C5%99%C3%AD_Guth_(Bohumil_Vavrou%C5%A1ek_%E2%80%93_%C4%8Cesk%C3%A9_album_I._Spisovatel%C3%A9,_1919).jpg'),
    ('reference/guth-mlady.jpg', 'Mladý Guth (kolem 1890)',
     'Tmavý, výrazně stočený knír a skřipec. Předloha pro variantu A2.',
     'Volné dílo, Wikimedia Commons', 'https://commons.wikimedia.org/wiki/File:J_guth.jpg'),
]

photo_html = ''.join(f'''<figure class="photo"><img src="{src}" alt="{html.escape(t)}"><figcaption><b>{html.escape(t)}</b><br>{html.escape(d)}<br><a href="{u}" target="_blank" rel="noopener">{html.escape(c)}</a></figcaption></figure>''' for src, t, d, c, u in photos)


def lockup(icon, dark=False):
    fg = CREAM if dark else INK
    sub = 'rgba(255,249,240,.75)' if dark else '#5b5a6e'
    return f'''<div class="lockup" style="color:{fg}"><div class="lk-icon">{icon}</div><div><div class="lk-title">ZŠ Gutha-Jarkovského</div><div class="lk-sub" style="color:{sub}">Kostelec nad Orlicí</div></div></div>'''


def strip(svg_text):
    return svg_text.replace('<?xml version="1.0"?>', '')


cards = []
for v in variants:
    icon = strip(v['svg'])
    sizes = ''.join(f'<div class="size"><div style="width:{s}px;height:{s}px">{icon}</div><span>{s}px</span></div>' for s in (160, 64, 32, 16))
    cards.append(f'''<section class="concept" id="{v['key']}">
  <header><h2>{v['name']}</h2><span class="tag">{v['tag']}</span></header>
  <p class="idea">{html.escape(v['idea'])}</p>
  <div class="row"><div class="panel sizes">{sizes}</div>
  <div class="panel col">{lockup(icon)}<div class="dark-strip">{lockup(icon, True)}</div></div></div>
</section>''')

compare = ''.join(f'<a class="cmp" href="#{v["key"]}"><div>{strip(v["svg"])}</div><span>{v["name"].split(" · ")[0]}</span></a>' for v in variants)
orig = (root / 'svg' / 'a-klobouk.svg').read_text()

page = f'''<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Logo A – varianty podle Gutha-Jarkovského</title>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap&subset=latin-ext" rel="stylesheet">
<style>
*{{box-sizing:border-box}} body{{margin:0;background:{CREAM};background-image:radial-gradient(rgba(29,33,80,.07) 1px,transparent 1px);background-size:22px 22px;color:{INK};font-family:Nunito,system-ui,sans-serif;line-height:1.55}}
h1,h2,h3,.lk-title,.tag{{font-family:'Baloo 2',ui-rounded,sans-serif}} main{{max-width:1100px;margin:0 auto;padding:40px 20px 80px}}
h1{{font-size:clamp(2rem,5vw,3.1rem);line-height:1.05;margin:0 0 12px}} .lead{{font-size:1.12rem;max-width:760px;color:#3d3f63}} a{{color:#0a6e63}}
.box,.concept{{background:#fffdf8;border:2.5px solid {INK};border-radius:28px;box-shadow:6px 6px 0 {INK};padding:26px;margin-top:36px}}
.photos{{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:16px;margin-top:16px}}
.photo{{margin:0;border:2.5px solid {INK};border-radius:18px;overflow:hidden;background:#fff}} .photo img{{width:100%;height:220px;object-fit:cover;object-position:top;display:block;filter:grayscale(.15)}}
.photo figcaption{{padding:10px 12px;font-size:.85rem;color:#3d3f63}}
.traits{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:18px}} .trait{{border:2px dashed #d9ccb8;border-radius:16px;padding:12px 14px;background:{CREAM}}} .trait b{{font-family:'Baloo 2';font-size:1.1rem}}
.compare{{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:14px;margin-top:16px}} .cmp{{text-decoration:none;color:{INK};text-align:center;font-weight:800}} .cmp div{{border:2.5px solid {INK};border-radius:22px;padding:10px;background:#fff}} .cmp svg{{width:100%;height:auto;display:block}}
.concept header{{display:flex;align-items:center;gap:12px;flex-wrap:wrap}} .concept h2{{margin:0;font-size:1.9rem}}
.tag{{background:{SUN};border:2px solid {INK};border-radius:999px;padding:2px 12px;font-weight:800}} .idea{{font-size:1.08rem;max-width:780px;color:#3d3f63}}
.row{{display:grid;grid-template-columns:1.1fr 1fr;gap:16px;margin-top:14px}} .panel{{border:2.5px solid {INK};border-radius:20px;padding:20px;background:{CREAM}}}
.sizes{{display:flex;align-items:flex-end;gap:22px;flex-wrap:wrap}} .size{{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:.8rem;font-weight:700;color:#5b5a6e}} .size svg{{width:100%;height:100%}}
.col{{display:flex;flex-direction:column;gap:14px;justify-content:center}} .dark-strip{{background:{INK};border-radius:14px;padding:14px}}
.lockup{{display:flex;align-items:center;gap:14px}} .lk-icon{{width:64px;height:64px;flex:none}} .lk-icon svg{{width:100%;height:100%}} .lk-title{{font-size:1.45rem;font-weight:800;line-height:1}} .lk-sub{{font-weight:700;margin-top:4px}}
.before{{display:flex;gap:18px;align-items:center;flex-wrap:wrap}} .before .mini{{width:120px}} .before svg{{width:100%;height:auto}}
@media(max-width:760px){{.row{{grid-template-columns:1fr}}}}
</style></head><body><main>
<p><a href="index.html">← Všechny směry loga</a></p>
<h1>Logo A: varianty podle<br>Jiřího Gutha-Jarkovského</h1>
<p class="lead">PhDr. Jiří Stanislav Guth-Jarkovský (1861–1943) byl spoluzakladatel novodobých olympijských her a člen MOV, první předseda Českého olympijského výboru, ceremoniář prezidenta Masaryka, gymnaziální profesor, spisovatel a autor Společenského katechismu. Ke Kostelci měl blízko, pocházela odsud jeho rodina a prožil tu léta dospívání. Varianty níže vycházejí z jeho skutečných fotografií a z pamětní desky v Kostelci.</p>

<section class="box">
  <h2 style="margin:0">Z čeho čerpám</h2>
  <div class="photos">{photo_html}</div>
  <div class="traits">
    <div class="trait"><b>Kulaté brýle</b><br>Na všech fotkách. V mládí drobný skřipec, ve stáří výrazné tmavé obroučky.</div>
    <div class="trait"><b>Knír se stočenými konci</b><br>Nejvýraznější rys. Tmavý a stočený v mládí, bílý a hustý ve stáří.</div>
    <div class="trait"><b>Klobouk</b><br>Plochá koruna, široká zvlněná krempa. Je na kostelecké desce i ve starém logu.</div>
    <div class="trait"><b>Široká kulatá tvář</b><br>Ve stáří holá hlava s bílými vlasy po stranách.</div>
    <div class="trait"><b>Elegance</b><br>Motýlek, hůlka, smeknutý klobouk. Autor knihy o slušném chování.</div>
  </div>
</section>

<section class="box">
  <h2 style="margin:0">Srovnání</h2>
  <div class="before"><div class="mini">{orig}</div><p style="margin:0;max-width:520px;color:#3d3f63">Původní návrh A byl obecný pán s kloboukem. Nové varianty přidávají rysy, podle kterých se dá poznat konkrétně Guth-Jarkovský: <b>knír se stočenými konci, tvar klobouku z desky, širokou tvář a motýlek.</b></p></div>
  <div class="compare">{compare}</div>
</section>
{''.join(cards)}
<p style="margin-top:36px;color:#5b5a6e;font-size:.9rem">Fotografie slouží jen jako podklad pro návrh, zdroje a licence jsou uvedeny u každé z nich. Stránka se generuje příkazem <code>python3 design/logo/build_a.py</code>.</p>
</main></body></html>'''
(root / 'a-varianty.html').write_text(page)
print('ok', len(page))
