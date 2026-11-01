// Accept both ordinary Next arguments and the managed preview daemon flags.
import {spawn} from 'node:child_process';
const raw=process.argv.slice(2),args=[];
for(let i=0;i<raw.length;i++){if(raw[i]==='--strictPort')continue;args.push(raw[i]==='--host'?'--hostname':raw[i]);}
const child=spawn(process.execPath,['node_modules/next/dist/bin/next',process.env.TG_PREVIEW_PRODUCTION==='1'?'start':'dev',...args],{stdio:'inherit'});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
