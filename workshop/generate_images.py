from pathlib import Path
from html import escape
import csv
from decimal import Decimal, ROUND_HALF_UP

ROOT = Path(__file__).parent
OUT = ROOT / "images"
OUT.mkdir(exist_ok=True)
rows = list(csv.DictReader((ROOT / "data/bullet_workshop.csv").open(encoding="utf-8")))

def svg(name, title, body):
    content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="960" height="530" viewBox="0 0 960 530">
<rect width="960" height="530" fill="#fff"/>
<text x="40" y="48" font-family="Arial" font-size="27" font-weight="700" fill="#151d2b">{escape(title)}</text>
<line x1="40" y1="68" x2="920" y2="68" stroke="#d9e0e8"/>
{body}
<text x="40" y="510" font-family="Arial" font-size="12" fill="#687487">Illustration from workshop sample data • schematic, not a Power BI screenshot</text>
</svg>'''
    (OUT / name).write_text(content, encoding="utf-8")

def label(x,y,s,size=18,color="#243247",weight="400"):
    return f'<text x="{x}" y="{y}" font-family="Arial" font-size="{size}" font-weight="{weight}" fill="{color}">{escape(str(s))}</text>'

def rect(x,y,w,h,color,rx=0):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{color}"/>'

body = label(55,130,"Category",20,weight="700") + label(380,130,"Actual",20,weight="700") + label(620,130,"Target",20,weight="700")
body += label(55,195,"Marketing",20) + rect(380,174,205,26,"#2A78D6",4) + rect(630,166,4,42,"#EB6834")
body += label(55,273,"Sales",20) + rect(380,252,280,26,"#2A78D6",4) + rect(630,244,4,42,"#EB6834")
body += label(55,352,"Blue bar = spend",18,"#2A78D6") + label(380,352,"Orange tick = budget",18,"#EB6834")
body += label(55,415,"Read both on the same horizontal scale.",18)
svg("00-anatomy.svg","Bullet chart anatomy",body)

body = ""
for x,title,detail in [(70,"CSV","8 categories"),(370,"Power BI","import + field types"),(685,"Deneb","Values → dataset")]:
    body += rect(x,160,210,150,"#eef3f9",14) + label(x+20,211,title,23,weight="700") + label(x+20,255,detail,17)
body += label(300,238,"→",38,"#2A78D6") + label(615,238,"→",38,"#2A78D6")
body += label(76,380,"category • actual • target • region",22)
svg("01-setup.svg","Step 0 — Prepare the dataset",body)

def chart(mode):
    b = ""
    maxv = max(max(int(r["actual"]),int(r["target"])) for r in rows)
    x0, span = 245, 620
    for i,r in enumerate(rows):
        y=107+i*46
        a=int(r["actual"]); t=int(r["target"])
        b += label(40,y+19,r["category"],16)
        if mode >= 2 and mode < 4: b += rect(x0,y,round(span*t/maxv),27,"#E4E0D4",3)
        color="#2A78D6"
        if mode>=3:
            v=(a-t)/t*100
            color="#0CA30C" if v < -5 else "#D03B3B" if v >= 10 else "#2A78D6"
        b += rect(x0,y+4,round(span*a/maxv),19,color,3)
        if mode >= 2: b += rect(x0+round(span*t/maxv)-2,y-2,4,31,"#EB6834")
        if mode >= 4:
            v=(a-t)/t*100
            b += label(875,y+19,f"{v:+.0f}%",14,"#D03B3B" if v>=10 else "#344054")
    return b

svg("02-bars.svg","Step 1 — Actual bars",chart(1))
svg("03-target.svg","Step 2 — Compare Actual with Target",chart(2))
svg("04-variance.svg","Step 3 — Color by variance",chart(3))

def full_chart():
    b = ""
    x0, span = 220, 490
    # The Vega x scale uses nice:true. For this sample, show a 0–1.3M domain
    # and 0.2M grid intervals in the instructional illustration.
    domain_max = 1300000
    for tick in range(0, 1300000, 200000):
        gx = x0 + round(span * tick / domain_max)
        b += f'<line x1="{gx}" y1="92" x2="{gx}" y2="473" stroke="#E4E0D4" stroke-width="1"/>'
        b += label(gx-15, 490, f"{tick / 1000000:.1f}M", 11, "#898781")
    for i, r in enumerate(rows):
        y = 100 + i * 46
        a, t = int(r["actual"]), int(r["target"])
        variance = (a - t) / t * 100
        color = "#0CA30C" if variance < -5 else "#D03B3B" if variance >= 10 else "#2A78D6"
        value = (Decimal(a) / Decimal(1000000)).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)
        b += label(40, y+19, r["category"], 16)
        b += rect(x0, y, span, 25, "#E4E0D4", 3)
        actual_w = round(span * a / domain_max)
        target_x = x0 + round(span * t / domain_max)
        b += rect(x0, y, actual_w, 25, color, 3)
        b += rect(target_x-2, y-4, 4, 33, "#EB6834")
        b += label(x0+actual_w+6, y+19, f"{value}M", 15, "#243247")
        if variance >= 10:
            b += f'<text x="924" y="{y+18}" text-anchor="end" font-family="Arial" font-size="13" font-weight="700" fill="#D03B3B">OVER BURN</text>'
    return b

svg("05-final.svg","Step 4 — Full Vega spec, conditionalColor on",full_chart())
