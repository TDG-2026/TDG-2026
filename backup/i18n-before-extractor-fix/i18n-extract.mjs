import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {parse}=require('next/dist/compiled/babel/parser');
const root=path.resolve(import.meta.dirname,'..');const out=path.join(root,'messages/source.json');
const prior=fs.existsSync(out)?JSON.parse(fs.readFileSync(out)):{};const existing=new Map(Object.entries(prior).map(([k,v])=>[v.text.replace(/\s+/g,' ').trim(),k]));const entries={};let seq=Math.max(0,...Object.keys(prior).map(k=>Number(k.match(/m(\d+)$/)?.[1]||0)));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]).filter(p=>p.endsWith('.js'));}
const excludedKeys=new Set(['id','slug','src','href','url','className','class','key','type','value','code','icon','dir','lang','locale','keywords','intent','match','pattern','categoryId','followUps','releaseVersion','date','dateTime']);
// Conservative source inventory: include English prose and labels, never opaque identifiers,
// URLs, code, emails, shortcuts, styles, or technical example passenger data.
function meaningful(text,forced=false){return /[A-Za-z]/.test(text)&&text.trim().length>1&&!/^(?:https?:|mailto:|\/\S|#\S|@\S|\.[a-zA-Z/]|[A-Za-z]+:\/\/)/.test(text)&&!/^\S+@\S+$/.test(text)&&!(forced?false:/^(?:[A-Z0-9_+ /.-]{2,}|[a-z][a-z0-9_-]*|[\d.]+px)$/.test(text))&&!/(?:=>|querySelector|\{\s*['"]|localStorage|\bfunction\b|SRDOCS|SSRDOCS|SR CTC|SI\.P1|3DOCS|3CTC)/.test(text)&&!text.includes('KHAN')&&!text.includes('AHMED')&&!/^import |^use client$/.test(text);}
function add(text,file,line,forced=false){text=forced?text.replace(/\s+/g,' ').trim():text.trim();const normalized=text.replace(/\s+/g,' ').trim();if(!text||!meaningful(text,forced))return;const key=existing.get(normalized)||`${path.basename(file,'.js').replace(/[^a-zA-Z0-9]/g,'')}.m${String(++seq).padStart(4,'0')}`;existing.set(normalized,key);entries[key]||={text,hash:crypto.createHash('sha256').update(text).digest('hex'),sources:[]};const location=path.relative(root,file)+':'+line;if(!entries[key].sources.includes(location))entries[key].sources.push(location);}
for(const file of [...files(root+'/app/[locale]'),...files(root+'/components'),...files(root+'/data'),...files(root+'/lib/genie'),root+'/lib/seo.js']){if(file.endsWith('/locales.js')||file.endsWith('/genie/i18n.js'))continue;const ast=parse(fs.readFileSync(file,'utf8'),{sourceType:'module',plugins:['jsx']});function walk(n,parent){if(!n||typeof n!=='object')return;if(n.type==='JSXText')add(n.value,file,n.loc.start.line,true);if(n.type==='StringLiteral'){const k=parent?.type==='ObjectProperty'?(parent.key.name||parent.key.value):null;const attr=parent?.type==='JSXAttribute'?parent.name.name:null;if(!excludedKeys.has(k)&&(!attr||['alt','title','placeholder','aria-label','aria-description'].includes(attr))&&!['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration','DirectiveLiteral'].includes(parent?.type))add(n.value,file,n.loc.start.line);}if(n.type==='TemplateLiteral'&&!n.expressions.length)add(n.quasis[0].value.cooked,file,n.loc.start.line);for(const [key,v] of Object.entries(n)){if(['loc','comments'].includes(key))continue;if(Array.isArray(v))v.forEach(x=>walk(x,n));else if(v&&typeof v==='object')walk(v,n);}}walk(ast);}
// All English chat UI values are first-party source copy, irrespective of property names.
const {strings:ui}=await import('../data/genie/i18n.js').catch(()=>({}));
function values(v){if(typeof v==='string')add(v,root+'/data/genie/i18n.js',1);else if(v&&typeof v==='object')Object.values(v).forEach(values);}
if(ui?.en)values(ui.en);

// Resolve first-party computed records (e.g. legal paragraphs) before translation.
for(const module of ['legal','resources','products','site']){const exports=await import('../data/'+module+'.js');function visit(value,key=''){if(typeof value==='string'){if(!excludedKeys.has(key))add(value,root+'/data/'+module+'.js',1,['label','title','name'].includes(key));}else if(Array.isArray(value))value.forEach(v=>visit(v,key));else if(value&&typeof value==='object')for(const [k,v] of Object.entries(value))visit(v,k);}visit(exports);}
const extra=JSON.parse(fs.readFileSync(root+'/messages/additional-source.json','utf8'));for(const text of extra)add(text,root+'/messages/additional-source.json',1,true);

fs.writeFileSync(out,JSON.stringify(entries,null,2)+'\n');
const messages=Object.fromEntries(Object.entries(entries).map(([key,e])=>[key,{text:e.text,sourceHash:e.hash,status:'published'}]));fs.writeFileSync(root+'/messages/en.json',JSON.stringify({locale:'en',status:'published',messages},null,2)+'\n');
console.log(`Extracted ${Object.keys(entries).length} source messages.`);
