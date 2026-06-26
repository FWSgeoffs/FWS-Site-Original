import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const allowedHost = 'futureworksystems.com';
const startUrls = [
  'https://futureworksystems.com/',
  'https://futureworksystems.com/BI-Solutions',
  'https://futureworksystems.com/BI-Solutions/FutureWorks-BI',
  'https://futureworksystems.com/BI-Solutions/FutureWorks-BI-National',
  'https://futureworksystems.com/BI-Solutions/Board-Matters',
  'https://futureworksystems.com/Portals/0/FWSBI-Tiers.html',
  'https://futureworksystems.com/Portals/0/Send-My-Impact-Report-FWS-Site-v1.htm',
  'https://futureworksystems.com/Company',
  'https://futureworksystems.com/Company/Clients',
  'https://futureworksystems.com/Company/Careers',
  'https://futureworksystems.com/Connect',
  'https://futureworksystems.com/Privacy'
];

function slug(url){
  const u = new URL(url);
  return (u.pathname === '/' ? 'home' : u.pathname.replace(/^\//,'').replace(/[^a-z0-9]+/gi,'-').replace(/-$/,''));
}

const out = path.resolve('captures');
await fs.mkdir(path.join(out,'screenshots'), {recursive:true});
await fs.mkdir(path.join(out,'rendered-html'), {recursive:true});
await fs.mkdir(path.join(out,'text'), {recursive:true});
await fs.mkdir(path.join(out,'links'), {recursive:true});
await fs.mkdir(path.join(out,'forms'), {recursive:true});

const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1440,height:1200}});

await page.route('**/*', route => {
  const reqUrl = new URL(route.request().url());
  if (reqUrl.hostname === allowedHost) return route.continue();
  if (reqUrl.hostname.endsWith('.' + allowedHost)) return route.continue();
  return route.abort();
});

for (const url of startUrls) {
  const id = slug(url);
  console.log('Capturing', url);
  await page.goto(url, {waitUntil:'networkidle', timeout:60000});
  await page.screenshot({path:path.join(out,'screenshots',id+'.png'), fullPage:true});
  await fs.writeFile(path.join(out,'rendered-html',id+'.html'), await page.content());
  await fs.writeFile(path.join(out,'text',id+'.txt'), await page.locator('body').innerText());
  const links = await page.$$eval('a', as => as.map(a => ({text:a.innerText.trim(), href:a.href})));
  const forms = await page.$$eval('form', forms => forms.map((f,i)=>({index:i, action:f.action, method:f.method, fields:[...f.elements].map(el=>({name:el.name, type:el.type, id:el.id, label:el.getAttribute('aria-label')||''}))})));
  await fs.writeFile(path.join(out,'links',id+'.json'), JSON.stringify(links,null,2));
  await fs.writeFile(path.join(out,'forms',id+'.json'), JSON.stringify(forms,null,2));
}

await browser.close();
