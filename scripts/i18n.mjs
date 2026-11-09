import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {codes,canonicalLocale} from '../lib/i18n/config.js';
import {translateBatch,protect} from '../lib/i18n/provider.mjs';
const root=path.resolve(import.meta.dirname,'..');process.chdir(root);
for(const name of ['.env.local','.env']){if(fs.existsSync(name))process.loadEnvFile(name);}
const source = JSON.parse(
  fs.readFileSync('messages/source.json', 'utf8')
);

// Historical records remain preserved but are excluded
// from active translation and publication coverage.
const keys = Object.keys(source).filter(
  key => source[key]?.retired !== true
);

const command = process.argv[2] || 'report';
const target = process.argv[3];
const read=locale=>{const file=`messages/${locale}.json`;return fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):{locale,status:'draft',messages:{}};};
const write=(locale,data)=>{const file=`messages/${locale}.json`;fs.writeFileSync(file+'.tmp',JSON.stringify(data,null,2)+'\n');fs.renameSync(file+'.tmp',file);};
const fresh=(c,k)=>c.messages[k]?.sourceHash===source[k].hash&&typeof c.messages[k]?.text==='string'&&c.messages[k].text.trim();
function validate(c){const issues=[];for(const k of keys){const item=c.messages[k];if(!fresh(c,k)){issues.push({key:k,issue:item?'stale':'missing'});continue;}const tokens=source[k].text.match(/\{[a-zA-Z0-9_]+\}/g)||[];if(tokens.some(t=>!item.text.includes(t)))issues.push({key:k,issue:'placeholder'});const expected=protect(source[k].text).values;for(const value of expected)if(!item.text.includes(value))issues.push({key:k,issue:'protected-term',value});if(/<\/?(?:script|iframe)|TGPROTECT\d+TOKEN/.test(item.text))issues.push({key:k,issue:'unsafe-or-token'});}return issues;}
if(command==='translate'){
if(target&&target!=='all'&&!canonicalLocale(target))throw new Error('Unsupported locale.');
// One writer prevents duplicate billable generation jobs; source hashes make reruns incremental.
const lock='messages/.translation.lock';let fd;try{fd=fs.openSync(lock,'wx');}catch{throw new Error('Translation is already running. Remove the lock only after verifying the old process has stopped.');}
try{const selected=target&&target!=='all'?[canonicalLocale(target)]:codes.filter(c=>c!=='en');for(const locale of selected){if(locale==='en')continue;const c=read(locale);const pending=keys.filter(k=>!fresh(c,k));for(let offset=0;offset<pending.length;){let batch=[],size=0;while(offset<pending.length&&batch.length<40&&size+source[pending[offset]].text.length<10000){const k=pending[offset++];batch.push(k);size+=source[k].text.length;}if(!batch.length)throw new Error('A source message exceeds the configured batch limit.');try{const translated=await translateBatch(batch.map(k=>source[k].text),locale);batch.forEach((k,i)=>{c.messages[k]={text:translated[i],sourceHash:source[k].hash,status:'machine-translated'};});c.status='machine-translated';write(locale,c);console.log(`${locale}: ${offset}/${pending.length} generated`);}catch(error){c.lastFailure={at:new Date().toISOString(),keys:batch,reason:error.message};write(locale,c);throw error;}}delete c.lastFailure;write(locale,c);}}finally{fs.closeSync(fd);fs.unlinkSync(lock);}
}else if(command==='review'){
const locale=canonicalLocale(target);if(!locale||locale==='en')throw new Error('Supply the non-English locale reviewed.');const reviewer=process.argv[4],file=process.argv[5];if(!reviewer||!file)throw new Error('Usage: review <locale> <reviewer> <JSON array of reviewed message keys>');const reviewed=JSON.parse(fs.readFileSync(file));if(!Array.isArray(reviewed))throw new Error('Review keys must be an array.');const c=read(locale);for(const k of reviewed){if(!source[k]||!fresh(c,k))throw new Error('Cannot review missing or stale message: '+k);c.messages[k].status='reviewed';c.messages[k].review={by:reviewer,at:new Date().toISOString(),sourceHash:source[k].hash};}c.status='reviewed';write(locale,c);
}else if(command==='publish'){
const locale=canonicalLocale(target);if(!locale||locale==='en')throw new Error('Supply a non-English locale.');const c=read(locale);if(validate(c).length||keys.some(k=>!['reviewed','published'].includes(c.messages[k]?.status)||!c.messages[k]?.review))throw new Error('Publication blocked: full current coverage, glossary integrity and explicit review records are required.');c.status='published';write(locale,c);console.log('Published catalog '+locale+'. Rebuild and redeploy for changes to take effect.');
}else if(!['report','check','release'].includes(command))throw new Error('Unknown command.');
const report=codes.map(locale=>{const c=read(locale),issues=validate(c);const translated=keys.filter(k=>fresh(c,k)).length;return {locale,status:locale==='en'?'published':issues.length?'blocked':c.status,total:keys.length,translated,missing:keys.length-translated,reviewed:keys.filter(k=>['reviewed','published'].includes(c.messages[k]?.status)&&fresh(c,k)).length,issues};});
fs.writeFileSync('TRANSLATION_COVERAGE.json',JSON.stringify({generatedAt:new Date().toISOString(),sourceRevision:crypto.createHash('sha256').update(JSON.stringify(source)).digest('hex'),locales:report},null,2)+'\n');
console.table(report.map(({locale,status,total,translated,reviewed})=>({locale,status,total,translated,reviewed})));
if(command==='check'&&report.some(r=>r.issues.some(i=>!['missing','stale'].includes(i.issue))))process.exitCode=1;
if(command==='release'&&report.some(r=>r.status!=='published'||r.translated!==r.total||r.reviewed!==r.total)){console.error('Multilingual production release blocked. See TRANSLATION_COVERAGE.json.');process.exitCode=1;}
