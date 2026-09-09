import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const projects=JSON.parse(await fs.readFile('content/projects.json','utf8'));
const articles=JSON.parse(await fs.readFile('content/articles.json','utf8'));
const studies=JSON.parse(await fs.readFile('content/case-studies.json','utf8'));
assert.equal(projects.length,15); assert.equal(articles.length,3);
assert.equal(articles.filter(a=>a.archived).length,2);
assert.equal(new Set(articles.map(a=>a.slug)).size,articles.length);
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);
assert.deepEqual(Object.keys(studies).sort(),projects.map(p=>p.id).sort(),'Case studies must cover every project');
for(const [id,study] of Object.entries(studies)){
 assert(study.headline && study.intro && study.role && study.format,`Incomplete case study: ${id}`);
 assert(study.scope.length>=2 && study.sections.length>=2,`Missing project detail: ${id}`);
 for(const item of [...study.scope,...study.sections])assert(item.title && item.body,`Empty section: ${id}`);
 assert(study.related.length && new Set(study.related).size===study.related.length,`Invalid related projects: ${id}`);
 for(const related of study.related)assert(related!==id && projects.some(p=>p.id===related),`Broken related project: ${id} -> ${related}`);
}
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
console.log(`${projects.length} complete case studies, ${articles.length} articles, ${images.size} valid image references.`);
const base=process.argv[2];
if(base){
 const paths=['/','/writing',...projects.map(p=>'/work/'+p.id),...articles.map(a=>'/writing/'+a.slug),'/Shelby-Klein-Resume.pdf'];
 for(const path of paths){
  const r=await fetch(base+path);assert.equal(r.status,200,path);const body=await r.text();assert(!/Internal Server Error|Failed to load URL/.test(body),path);
  if(path.startsWith('/work/')){
   const project=projects.find(p=>path==='/work/'+p.id);
   for(const id of ['overview','contribution','approach','related-title'])assert(body.includes(`id="${id}"`),`${path}: missing ${id}`);
   assert.equal(body.includes('id="gallery"'),project.images.some(i=>i.src!==project.cover),`${path}: gallery visibility`);
   assert.equal(body.includes('id="video"'),project.videos.length>0,`${path}: video visibility`);
  }
 }
 const redirects=[...projects.filter(p=>p.legacySlug).map(p=>['/project/'+p.legacySlug,'/work/'+p.id]),...articles.map(a=>['/'+a.slug,'/writing/'+a.slug]),['/projects','/#work'],['/blog','/writing'],['/project/sfs-recruitment-brochure','/work/sfs-brochure']];
 for(const [from,to] of redirects){const r=await fetch(base+from,{redirect:'manual'});assert([301,302,307,308].includes(r.status),`${from}: ${r.status}`);assert.equal(r.headers.get('location'),to,from);}
 const missing=await fetch(base+'/work/not-a-project');assert.equal(missing.status,404);
 console.log(`${paths.length} routes/resources returned 200, ${redirects.length} legacy redirects passed, missing project returned 404.`);
}
