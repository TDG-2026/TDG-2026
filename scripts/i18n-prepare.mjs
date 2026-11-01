import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
for(const name of ['.env.local','.env'])if(fs.existsSync(name))process.loadEnvFile(name);
function run(args){const result=spawnSync(process.execPath,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
run(['scripts/i18n-extract.mjs']);
if(process.env.TRANSLATION_PROVIDER)run(['scripts/i18n.mjs','translate','all']);
else console.log('Translation provider is not configured. Using checked-in catalogs; incomplete locales remain noindex previews.');
run(['scripts/i18n.mjs','check']);
