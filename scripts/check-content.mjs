import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const projects=JSON.parse(await fs.readFile('content/projects.json','utf8'));
const articles=JSON.parse(await fs.readFile('content/articles.json','utf8'));
assert.equal(projects.length,15); assert.equal(articles.length,4);
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
let images=new Set();
for(const p of projects){
 assert(p.title && p.paragraphs.length && p.tags.length,`Incomplete project: ${p.id}`);
 if(p.cover)images.add(p.cover);
 for(const i of p.images){assert(i.alt);images.add(i.src);}
 for(const v of p.videos){const u=new URL(v);assert(['www.youtube.com','player.vimeo.com'].includes(u.hostname));}
}
for(const a of articles){
 assert(!/<(?:script|form|style)\b|\bon\w+\s*=|javascript:/i.test(a.html),`Unsafe article: ${a.slug}`);
 for(const m of a.html.matchAll(/src="(\/images\/[^"]+)"/g))images.add(m[1]);
}
for(const img of images){const f='public'+img;await fs.access(f);if(!img.endsWith('.svg')){const meta=await sharp(f).metadata();assert(meta.width&&meta.height,`Invalid image: ${img}`)}}
console.log(`${projects.length} complete projects, ${articles.length} archived articles, ${images.size} valid image references.`);
const base=process.argv[2];
if(base){
 const paths=['/','/writing',...projects.map(p=>'/work/'+p.id),...articles.map(a=>'/writing/'+a.slug),'/Shelby-Klein-Resume.pdf'];
 for(const path of paths){const r=await fetch(base+path);assert.equal(r.status,200,path);const body=await r.text();assert(!/Internal Server Error|Failed to load URL/.test(body),path);}
 const redirects=[...projects.filter(p=>p.legacySlug).map(p=>['/project/'+p.legacySlug,'/work/'+p.id]),...articles.map(a=>['/'+a.slug,'/writing/'+a.slug]),['/projects','/#work'],['/blog','/writing'],['/project/sfs-recruitment-brochure','/work/sfs-brochure']];
 for(const [from,to] of redirects){const r=await fetch(base+from,{redirect:'manual'});assert([301,302,307,308].includes(r.status),`${from}: ${r.status}`);assert.equal(r.headers.get('location'),to,from);}
 const missing=await fetch(base+'/work/not-a-project');assert.equal(missing.status,404);
 console.log(`${paths.length} routes/resources returned 200, ${redirects.length} legacy redirects passed, missing project returned 404.`);
}
