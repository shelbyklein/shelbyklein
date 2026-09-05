import concurrent.futures, html, json, pathlib, re, subprocess
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parents[1]
RESEARCH = ROOT / 'research'
ASSETS = RESEARCH / 'original-assets'
ASSETS.mkdir(exist_ok=True)
(RESEARCH / 'pages').mkdir(exist_ok=True)

def download(pair):
    url, path = pair
    result = subprocess.run(['curl', '-L', '--fail', '--silent', '--show-error', '--retry', '2', '--max-time', '45', url, '-o', str(path)], capture_output=True)
    return {'url': url, 'path': str(path.relative_to(ROOT)), 'ok': result.returncode == 0, 'bytes': path.stat().st_size if path.exists() else 0}

media = json.loads((RESEARCH / 'wp-media.json').read_text())
projects = json.loads((RESEARCH / 'wp-project.json').read_text())
pages = json.loads((RESEARCH / 'wp-pages.json').read_text())
jobs = [(m['source_url'], ASSETS / m['source_url'].split('/')[-1]) for m in media]
jobs += [(p['link'], RESEARCH / 'pages' / (p['slug'] + '.html')) for p in projects + pages]
jobs += [('https://shelbyklein.com/' + path, RESEARCH / path.replace('/', '-')) for path in ['robots.txt', 'wp-sitemap.xml']]
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    results = list(pool.map(download, jobs))
(RESEARCH / 'download-manifest.json').write_text(json.dumps(results, indent=2))

class Text(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]; self.skip=0
    def handle_starttag(self, tag, attrs):
        if tag in ('style','script'): self.skip+=1
        if tag in ('p','h1','h2','h3','h4','li','div','br'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('style','script'): self.skip=max(0,self.skip-1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

for path in [RESEARCH / 'original-home.html', *(RESEARCH / 'pages').glob('*.html')]:
    if path.exists():
        parser=Text(); parser.feed(path.read_text(errors='replace'))
        path.with_suffix('.txt').write_text('\n'.join(x.strip() for x in ''.join(parser.parts).splitlines() if x.strip()))
print(json.dumps({'downloaded': sum(r['ok'] for r in results), 'total':len(results), 'bytes':sum(r['bytes'] for r in results), 'failed':[r for r in results if not r['ok']]}))
