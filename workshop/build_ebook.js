const fs = require('fs');
const path = require('path');
const marked = require('C:/Users/MSI/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked');
const root = __dirname;
const md = fs.readFileSync(path.join(root, 'ebook.md'), 'utf8');
const body = marked.parse(md);
const html = `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>สร้าง Bullet Chart ด้วย Deneb ใน Power BI</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;600;700&display=swap');
:root{font-family:"Noto Sans Thai",Tahoma,Arial,sans-serif;color:#19263a;background:#f1f4f8}
*{box-sizing:border-box}body{margin:0}main{max-width:900px;margin:32px auto;padding:56px 68px;background:white;box-shadow:0 8px 40px #12213a18}
h1{font-size:2.25rem;line-height:1.25;margin:0 0 1rem}h2{font-size:1.42rem;margin:2.4rem 0 .7rem;border-bottom:2px solid #dfe7f1;padding-bottom:.35rem}
p,li{line-height:1.8}a{color:#1d64b3}img{width:100%;height:auto;margin:1rem 0 1.5rem;border:1px solid #e1e6ed}
table{border-collapse:collapse;width:100%;margin:1rem 0}th,td{padding:.7rem;border:1px solid #d9e1ec;text-align:left}th{background:#eaf0f8}
code{font-family:Consolas,monospace;background:#f2f5f8;padding:.1rem .3rem}pre{background:#101c2d;color:#f4f7fb;padding:1rem;overflow:auto}pre code{background:transparent;padding:0}
blockquote{margin:1rem 0;padding:.2rem 1rem;border-left:4px solid #2a78d6;background:#f4f8fd}
@media(max-width:700px){main{margin:0;padding:26px 20px}h1{font-size:1.8rem}}
@media print{body{background:#fff}main{box-shadow:none;margin:0;padding:0;max-width:none}h2{break-after:avoid}img,pre,table{break-inside:avoid}a{color:#19263a}}
</style></head><body><main>${body}</main></body></html>`;
fs.writeFileSync(path.join(root, 'ebook.html'), html);
