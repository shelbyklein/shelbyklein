import json, re, html, pathlib, subprocess
from html.parser import HTMLParser
R=pathlib.Path(__file__).resolve().parents[1]
(R/'content').mkdir(exist_ok=True)
media=json.loads((R/'research/wp-media.json').read_text())

def plain(s): return html.unescape(re.sub(r'<[^>]+>','',s)).strip()
def local_image(url):
 url=html.unescape(url).replace('http://shelbyklein.com','https://shelbyklein.com')
 if '/wp-content/uploads/' not in url: return None
 name=url.split('/')[-1].split('?')[0]
 if not re.search(r'\.(webp|png|jpg|jpeg|svg)$',name,re.I): return None
 path=R/'research/original-assets'/name
 if not path.exists():
  subprocess.run(['curl','-L','--fail','--silent','--show-error',url,'-o',str(path)],check=True)
 return '/images/'+name

# Concise summaries are new editorial copy. Detailed descriptions retain source wording.
meta={
547:('playcase','PlayCase','A gaming case that brings physical controls to the iPhone.','Independent product',['Product design','3D printing','Brand & marketing'],'playcase-card.png','https://playcase.gg','PlayCase'),
660:('sea-education','Sea Education Association','Website design and development for ocean education.','Client project',['Web design','Web development'],'sea-card.webp','https://sea.edu','Sea Education Association'),
550:('field-studies','The School for Field Studies','Website design and content systems for environmental field studies.','Client project',['Web design','Content architecture'],'sfs-card.webp','https://fieldstudies.org','School for Field Studies'),
1049:('usa-archery-broadcast','USA Archery Live','Live broadcasts, motion graphics, and scoring systems for national archery events.','National events',['Live production','Motion & software'],'usaa-livestream-screenshot.webp',None,'USA Archery'),
19:('steam-deck-hq','Steam Deck HQ','Brand identity and web development for a handheld gaming publication.','Independent platform',['Brand identity','Web development'],'sdhq-cover-image.webp','https://steamdeckhq.com','Steam Deck HQ'),
549:('national-event-identities','National event identities','A series of identities for USA Archery’s national events.','USA Archery',['Brand identity','Event design'],'logos-usaa-scaled.webp',None,'USA Archery'),
533:('olympic-jerseys','Team USA Olympic Jerseys','Team USA archery jerseys for the Tokyo and Paris Olympic Games.','2020 & 2024 Olympic Games',['Apparel design','Creative direction'],'olympic-jersey-card.webp',None,'USA Archery'),
21:('workplace-solutions','Workplace Solutions','Website redesign, presentations, and video for a commercial interiors company.','Client project',['Web design','Video & presentations'],'q2-stadium-suite.webp','https://wpsolutions.com','Workplace Solutions'),
114:('archery-is-for-everyone','Archery is for Everyone','An inclusive archery campaign with USA Archery and Marvel Entertainment.','USA Archery × Marvel',['Campaign direction','Film & design'],'Archery-is-for-Everyone.webp',None,'USA Archery, in collaboration with Marvel Entertainment'),
539:('us-open','U.S. Open Fan Experience','A motion-tracking installation for the 2016 U.S. Open.','2016 U.S. Open',['Interactive experience','Game development'],'us-open-fan-experience-7.jpg',None,'USTA'),
22:('sfs-brochure','SFS Recruitment Brochure','Recruitment brochures for the School for Field Studies.','Client project',['Editorial design','Print production'],'SFS-Brochure-card.webp',None,'School for Field Studies'),
}
projects=[]
for raw in json.loads((R/'research/wp-project.json').read_text()):
 slug,title,summary,label,tags,cover,url,client=meta[raw['id']]
 paragraphs=[plain(p) for p in re.findall(r'<p\b[^>]*>(.*?)</p>',raw['content']['rendered'],re.S) if plain(p)]
 if raw['id']==660: paragraphs=['Website design and development for Sea Education Association, an organization connecting students with ocean education and exploration. The original portfolio documents the work through desktop and mobile website imagery.']
 if raw['id']==550: paragraphs=['I designed and developed a new website for the School for Field Studies, restructuring content and systems architecture to make ongoing maintenance easier for the client. The project connects environmental field education with a clear, accessible digital experience.']
 if raw['id']==22: paragraphs=['I designed the School for Field Studies recruitment brochures for 2023 and 2024, helping introduce its programs to students at colleges across the country. The work brings together photography, program information, and an editorial structure built for exploration.']
 # Clearly date a source claim rather than presenting changing metrics as current.
 if raw['id']==19: paragraphs=[p for p in paragraphs if not p.startswith('SDHQ receives')]+['The original portfolio reported more than one million monthly page views. This is a historical figure from the earlier site, not a current audience measurement.']
 imgs=[]
 for url_img in re.findall(r'<img[^>]*src="([^"]+)"',raw['content']['rendered']):
  src=local_image(url_img)
  if src and src not in [i['src'] for i in imgs]: imgs.append({'src':src,'alt':title+' — project artwork '+str(len(imgs)+1)})
 videos=[html.unescape(u) for u in re.findall(r'<iframe[^>]*src="([^"]+)"',raw['content']['rendered'])]
 # The homepage has three additional portfolio videos outside the post body.
 if raw['id']==114: videos.append('https://player.vimeo.com/video/864416195')
 if raw['id']==539: videos.append('https://player.vimeo.com/video/216589013')
 if raw['id']==21: videos.insert(0,'https://player.vimeo.com/video/570761145')
 projects.append(dict(id=slug,title=title,originalTitle=html.unescape(raw['title']['rendered']),summary=summary,label=label,tags=tags,cover='/images/'+cover,client=client,url=url,paragraphs=paragraphs,images=imgs,videos=videos,source=raw['link'],legacySlug=raw['slug']))
new=[
 dict(id='newton',title='Newton',originalTitle='Newton',summary='A desktop workspace for persistent AI teams.',label='Independent software · In development',tags=['Application design','AI systems'],cover='/images/newton.webp',client='Independent project',url=None,paragraphs=['Newton is a local desktop workspace for persistent AI teammates. I’m building a place where projects, conversations, roles, and recurring work stay connected over time.','The app brings Codex CLI and Claude Code into one workspace, with separate project teams, saved conversations, scheduled routines, and handoffs between teammates. Illustrated characters give each role a recognizable presence.','The work spans interface design and the underlying system: a React and TypeScript front end, a Tauri desktop shell, and a Rust runtime that keeps track of work beyond the app window. Newton is an independent application in active development.'],images=[{'src':'/images/newton.webp','alt':'Newton desktop app welcome screen with its apple mascot'}],videos=[],source='Local Newton project and screenshots, September 2026',legacySlug=None),
 dict(id='current',title='Current',originalTitle='Current',summary='A live rhyme studio with speech input and phrase suggestions.',label='Independent software · In development',tags=['Creative tools','Language & audio'],cover='/images/current.webp',client='Independent project',url=None,paragraphs=['Current is a live rhyme studio for finding the next line while you rap. It connects spoken or typed words to rhyme suggestions, vowel matches, and phrase ideas in a single working surface.','I’m exploring how software can support a creative moment without interrupting it: keeping useful suggestions in view, grouping related sounds, and making the emerging rhyme scheme easy to follow.','The interface brings together your flow, phrase ideas, and a rhyme log. Session audio and transcript tools support revisiting the work. This is an independent project in active development; the screenshot documents its September 2026 interface.'],images=[{'src':'/images/current.webp','alt':'Current live rhyme studio showing rhyme suggestions, phrase ideas, and an ABAB rhyme scheme'}],videos=[],source='Local Current application source and screenshot, September 2026',legacySlug=None),
 dict(id='arcadia',title='Arcadia',originalTitle='Arcadia',summary='An exploration of AI coordination and interactive simulation.',label='Independent experiment',tags=['AI systems','Simulation & interaction'],cover=None,client='Independent exploration',url=None,paragraphs=['Arcadia explores the relationship between an AI workspace and a simulated world. It brings together an agent dashboard and a life simulation, asking how software activity can become something you can see and navigate as a place.','The work investigates agent coordination, persistent event history, character behavior, and spatial interaction. The agent system and simulation keep distinct responsibilities while contributing to the same experience.','This is an ongoing exploration in creative software and human–AI interaction. It sits alongside Newton and Current as part of my interest in building tools with a sense of presence and play.'],images=[],videos=[],source='Local Arcadia README, verified September 2026',legacySlug=None)
]
projects+=new
(R/'content/projects.json').write_text(json.dumps(projects,indent=2,ensure_ascii=False))

allowed={'p','h2','h3','h4','ul','ol','li','strong','em','a','blockquote','code','pre','br','hr','figure','figcaption','img'}
class Cleaner(HTMLParser):
 def __init__(self): super().__init__(); self.out=[]; self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in {'script','style','form'}:self.skip+=1;return
  if self.skip or tag not in allowed:return
  attrs=dict(attrs); clean=''
  if tag=='a':
   href=attrs.get('href','')
   if href.startswith(('https://','http://','mailto:','#')):clean=' href="'+html.escape(href,quote=True)+'"'
  if tag=='img':
   src=local_image(attrs.get('src',''))
   if not src:return
   clean=' src="'+html.escape(src,quote=True)+'" alt="'+html.escape(attrs.get('alt','Article illustration'),quote=True)+'" loading="lazy"'
  self.out.append('<'+tag+clean+'>')
 def handle_endtag(self,tag):
  if tag in {'script','style','form'}:self.skip=max(0,self.skip-1);return
  if not self.skip and tag in allowed and tag not in {'img','br','hr'}:self.out.append('</'+tag+'>')
 def handle_data(self,data):
  if not self.skip:self.out.append(html.escape(data))
articles=[]
for post in json.loads((R/'research/wp-posts.json').read_text()):
 c=Cleaner();c.feed(post['content']['rendered'])
 articles.append(dict(slug=post['slug'],title=html.unescape(post['title']['rendered']),date=post['date'][:10],excerpt=plain(post['excerpt']['rendered']),html=''.join(c.out),source=post['link']))
 subprocess.run(['curl','-L','--fail','--silent','--show-error',post['link'],'-o',str(R/'research/pages'/(post['slug']+'.html'))],check=True)
(R/'content/articles.json').write_text(json.dumps(articles,indent=2,ensure_ascii=False))
print('Saved',len(projects),'projects and',len(articles),'articles.')
