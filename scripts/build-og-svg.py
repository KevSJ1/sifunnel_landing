"""Genera scripts/og.svg (1200x630) con el texto convertido a trazos usando Sora/Inter reales.
Uso: python3 scripts/build-og-svg.py && node scripts/generate-images.mjs
Requiere: pip install fonttools brotli
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
FS = ROOT / 'node_modules/@fontsource-variable'

def load(path, wght):
    f = TTFont(path)
    return instantiateVariableFont(f, {'wght': wght})

def text_path(font, text, x, y, size, tracking=0.0):
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font['head'].unitsPerEm
    s = size / upm
    out = []
    cx = x
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            cx += size * 0.3
            continue
        pen = SVGPathPen(gs)
        tpen = TransformPen(pen, (s, 0, 0, -s, cx, y))
        gs[gname].draw(tpen)
        d = pen.getCommands()
        if d:
            out.append(d)
        cx += gs[gname].width * s + tracking * size
    return ' '.join(out), cx - x

def latin(pkg, name):
    return FS / pkg / 'files' / name

sora800 = load(latin('sora', 'sora-latin-wght-normal.woff2'), 800)
sora700 = load(latin('sora', 'sora-latin-wght-normal.woff2'), 700)
inter500 = load(latin('inter', 'inter-latin-wght-normal.woff2'), 500)

brand, bw = text_path(sora800, 'SIFUNNEL', 196, 132, 40, 0.04)
l1, _ = text_path(sora800, 'Más clientes,', 80, 290, 76, -0.02)
l2, _ = text_path(sora800, 'menos trabajo manual.', 80, 380, 76, -0.02)
sub, _ = text_path(inter500, 'Web · SEO · Anuncios · Contenido con IA · WhatsApp 24/7', 80, 460, 28)
cta, cw = text_path(sora700, 'Diagnóstico gratis', 0, 0, 26)
pill, pw = text_path(inter500, 'Crecimiento digital con IA · Pymes en Colombia', 0, 0, 20)

cta_w = cw + 84
pill_w = pw + 44

logo = '''
<g transform="translate(80 72) scale(0.92)">
<circle cx="52" cy="50" r="46" fill="none" stroke="#6b7180" stroke-width="2.4"/>
<circle cx="52" cy="50" r="42" fill="none" stroke="#e8ecf6" stroke-width="2"/>
<circle cx="52" cy="50" r="38" fill="#05080f"/>
<path d="M14 10 L32 18.2 L33.6 81 L15.6 91 Z" fill="#1067f5"/>
<path d="M36 20 L52 27.5 L53.2 72.5 L37.4 80 Z" fill="#0bb3b0"/>
<path d="M56 29.4 L69 35.6 L69.8 64.6 L57 71 Z" fill="#fd6550"/>
<path d="M72.4 37.2 L86 43.6 L86.4 56.2 L73 62.8 Z" fill="#f9b908"/>
</g>'''

# Embudo decorativo grande a la derecha
funnel = '''
<g transform="translate(935 175) scale(2.8)" opacity="0.95">
<path d="M14 10 L32 18.2 L33.6 81 L15.6 91 Z" fill="#1067f5"/>
<path d="M36 20 L52 27.5 L53.2 72.5 L37.4 80 Z" fill="#0bb3b0"/>
<path d="M56 29.4 L69 35.6 L69.8 64.6 L57 71 Z" fill="#fd6550"/>
<path d="M72.4 37.2 L86 43.6 L86.4 56.2 L73 62.8 Z" fill="#f9b908"/>
</g>'''

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
<radialGradient id="g1" cx="85%" cy="10%" r="60%"><stop offset="0" stop-color="#947dff" stop-opacity=".45"/><stop offset="1" stop-color="#947dff" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="0%" cy="100%" r="55%"><stop offset="0" stop-color="#41e575" stop-opacity=".18"/><stop offset="1" stop-color="#41e575" stop-opacity="0"/></radialGradient>
<linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#cabeff"/><stop offset=".45" stop-color="#a48bff"/><stop offset="1" stop-color="#41e575"/></linearGradient>
<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#cabeff" stroke-opacity=".05"/></pattern>
</defs>
<rect width="1200" height="630" fill="#0c1321"/>
<rect width="1200" height="630" fill="url(#grid)"/>
<rect width="1200" height="630" fill="url(#g1)"/>
<rect width="1200" height="630" fill="url(#g2)"/>
{funnel}
{logo}
<path d="{brand}" fill="#ffffff"/>
<path d="{l1}" fill="#dce2f6"/>
<path d="{l2}" fill="url(#tg)"/>
<path d="{sub}" fill="#c9c4d8"/>
<g transform="translate(80 505)">
<rect width="{cta_w:.0f}" height="64" rx="32" fill="#25d366"/>
<path d="{cta}" transform="translate(42 41)" fill="#04210f"/>
</g>
<g transform="translate({80 + cta_w + 20:.0f} 511)">
<rect width="{pill_w:.0f}" height="52" rx="26" fill="#947dff" fill-opacity=".12" stroke="#cabeff" stroke-opacity=".3"/>
<path d="{pill}" transform="translate(22 33)" fill="#cabeff"/>
</g>
</svg>'''
(ROOT / 'scripts/og.svg').write_text(svg)
print('scripts/og.svg listo')
