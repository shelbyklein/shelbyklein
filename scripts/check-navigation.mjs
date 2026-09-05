import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.argv[2];
assert(base,'Provide a production preview URL.');
const origin=new URL(base).origin;
const prefix=new URL(base).pathname.replace(/\/$/,'');
function sitePath(path){
 const [pathname,hash]=path.split('#');
 const suffix=prefix && !pathname.endsWith('/') ? '/' : '';
 return prefix+pathname+suffix+(hash ? '#'+hash : '');
}
const siteUrl=path=>origin+sitePath(path);
const projects=JSON.parse(await fs.readFile('content/projects.json','utf8'));
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base,{waitUntil:'networkidle'});
 for(const project of projects){
  const trigger=page.locator(`.project-info a[href="${sitePath(`/work/${project.id}`)}"], .archive-row[href="${sitePath(`/work/${project.id}`)}"]`).first();
  await trigger.click();
  const dialog=page.getByRole('dialog');
  await dialog.waitFor({state:'visible'});
  const link=dialog.getByRole('link',{name:'View full project'});
  assert.equal(await link.getAttribute('href'),sitePath('/work/'+project.id));
  await Promise.all([page.waitForURL(siteUrl('/work/'+project.id)),link.click()]);
  await page.locator('#overview-title').waitFor();
  assert.equal(await page.locator('h1').textContent(),project.originalTitle);
  assert.equal(await page.locator('[role="dialog"]:visible').count(),0);
  await Promise.all([page.waitForURL(siteUrl('/#work')),page.locator('.back-link').click()]);
  await page.waitForLoadState('networkidle');
 }
 console.log('All 15 side-panel links and return links passed in the production build.');
 const keyboardTrigger=page.locator(`.project-info a[href="${sitePath('/work/newton')}"]`);
 await keyboardTrigger.focus();
 await keyboardTrigger.press('Enter');
 const keyboardLink=page.getByRole('dialog').getByRole('link',{name:'View full project'});
 await keyboardLink.focus();
 await Promise.all([page.waitForURL(siteUrl('/work/newton')),keyboardLink.press('Enter')]);
 await page.locator('#overview-title').waitFor();
 await Promise.all([page.waitForURL(siteUrl('/work/current')),page.locator(`.case-related-item[href="${sitePath('/work/current')}"]`).click()]);
 await page.locator('#overview-title').waitFor();
 await Promise.all([page.waitForURL(siteUrl('/writing/creative-work-fewer-tools')),page.locator('.case-reading a').click()]);
 await page.locator('.article-body').waitFor();
 await Promise.all([page.waitForURL(siteUrl('/writing')),page.locator('.back-link').click()]);
 await Promise.all([page.waitForURL(siteUrl('/writing/creative-work-fewer-tools')),page.locator('.writing-card').first().click()]);
 await page.locator('.article-body').waitFor();
 await page.goBack({waitUntil:'networkidle'});
 assert.equal(new URL(page.url()).pathname,sitePath('/writing'));
 console.log('Keyboard activation, related projects, article links, and browser Back passed.');
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const phone=await mobile.newPage();
 phone.on('pageerror',error=>errors.push(error.message));
 await phone.goto(base,{waitUntil:'networkidle'});
 await phone.locator(`.project-info a[href="${sitePath('/work/playcase')}"]`).tap();
 const mobileLink=phone.getByRole('dialog').getByRole('link',{name:'View full project'});
 await mobileLink.waitFor({state:'visible'});
 const box=await mobileLink.boundingBox();
 assert(box && box.y>=0 && box.y+box.height<=844,'Mobile full-project link must fit in the viewport');
 await Promise.all([phone.waitForURL(siteUrl('/work/playcase')),mobileLink.tap()]);
 await phone.locator('#overview-title').waitFor();
 assert.equal(await phone.locator('[role="dialog"]:visible').count(),0);
 assert.deepEqual(errors,[],'Browser errors');
 console.log('Mobile tap and visible action passed; no JavaScript errors.');
} finally {await browser.close();}
