import { neon } from '@neondatabase/serverless';
import { randomBytes, randomUUID, pbkdf2Sync, createHmac, timingSafeEqual } from 'node:crypto';

const send=(res,status,obj)=>{res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');return res.status(status).json(obj);};
const clean=x=>typeof x==='string'?x.trim():'';
const safeEqual=(a,b)=>{const aa=Buffer.from(String(a)),bb=Buffer.from(String(b));return aa.length===bb.length&&timingSafeEqual(aa,bb);};
const digest=(password,salt)=>pbkdf2Sync(password,Buffer.from(salt,'hex'),310000,32,'sha256').toString('hex');
const sign=(payload,secret)=>createHmac('sha256',secret).update(payload).digest('hex');
const month=x=>/^20\d{2}-(0[1-9]|1[0-2])$/.test(x);
const date=x=>/^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(x)&&!Number.isNaN(Date.parse(x+'T12:00:00Z'))&&new Date(x+'T12:00:00Z').toISOString().slice(0,10)===x;
const positive=x=>Number.isSafeInteger(x)&&x>0&&x<=1e11;
const allowedKind=x=>x==='income'||x==='expense';
const cookie=(value,age)=>`personal_session=${value}; HttpOnly; Secure; SameSite=Strict; Path=/personal; Max-Age=${age}`;
const getCookie=req=>(req.headers.cookie||'').match(/(?:^|;\s*)personal_session=([^;]+)/)?.[1]||'';
const authenticated=(req,secret)=>{const [exp,mac]=getCookie(req).split('.');return /^\d+$/.test(exp||'')&&Number(exp)>Date.now()&&safeEqual(mac||'',sign(exp,secret));};
const ipKey=req=>{const ip=(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();return createHmac('sha256',process.env.SESSION_SECRET).update(ip).digest('hex');};
const credentials=(b)=>clean(b.username).length>=3&&clean(b.username).length<=40&&/^[a-zA-Z0-9_.-]+$/.test(clean(b.username))&&typeof b.password==='string'&&b.password.length>=12&&b.password.length<=128;
const validRecord=(table,b)=>{if(table==='goals')return clean(b.name).length>0&&clean(b.name).length<=100&&positive(b.target_cents)&&Number.isSafeInteger(b.saved_cents)&&b.saved_cents>=0&&b.saved_cents<=1e11;
 const basic=clean(b.description).length>0&&clean(b.description).length<=100&&positive(b.amount_cents)&&allowedKind(b.kind)&&clean(b.category).length<=50;
 return basic&&(table==='movements'?date(b.date):month(b.start_month)&&month(b.end_month)&&b.start_month<=b.end_month&&Number.isInteger(b.day)&&b.day>=1&&b.day<=28);
};
export default async function handler(req,res){
 try{
  const url=process.env.PERSONAL_DB_URL||process.env.DATABASE_URL||process.env.PERSONAL_DB_DATABASE_URL;
  const secret=process.env.SESSION_SECRET;
  if(!url||!secret||secret.length<32)return send(res,503,{error:'Faltan PERSONAL_DB_URL/DATABASE_URL o SESSION_SECRET en Vercel.'});
  if(req.method!=='GET'){
   const origin=req.headers.origin;
   const host=req.headers.host;
   if(!origin||!host||new URL(origin).host!==host)return send(res,403,{error:'Origen no permitido.'});
  }
  const sql=neon(url);
  const path=String(req.query.path||'').replace(/^\/+|\/+$/g,'');
  const b=req.body||{};
  const stored=await sql`SELECT value FROM personal_settings WHERE key='password_hash'`;
  if(path==='status'&&req.method==='GET')return send(res,200,{setup:stored.length>0});
  if(path==='setup'&&req.method==='POST'){
   if(stored.length)return send(res,409,{error:'La cuenta ya está creada.'});
   if(!process.env.SETUP_TOKEN||process.env.SETUP_TOKEN.length<24)return send(res,503,{error:'Configura SETUP_TOKEN (mínimo 24 caracteres).'});
   if(!safeEqual(b.token||'',process.env.SETUP_TOKEN))return send(res,403,{error:'Código de activación incorrecto.'});
   if(!credentials(b))return send(res,400,{error:'Usuario de 3–40 caracteres (letras, números, . _ -) y contraseña de 12–128 caracteres.'});
   const salt=randomBytes(16).toString('hex'),hash=salt+':'+digest(b.password,salt);
   const inserted=await sql`INSERT INTO personal_settings(key,value) VALUES('password_hash',${hash}) ON CONFLICT DO NOTHING RETURNING key`;
   if(!inserted.length)return send(res,409,{error:'La cuenta ya existe.'});
   await sql`INSERT INTO personal_settings(key,value) VALUES('username',${clean(b.username)}) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`;
   return send(res,200,{ok:true});
  }
  if(!stored.length)return send(res,403,{error:'Primero debes activar la cuenta.'});
  if(path==='login'&&req.method==='POST'){
   const key=ipKey(req),attempts=await sql`SELECT count,window_start,locked_until FROM personal_login_attempts WHERE key=${key}`;
   if(attempts.length&&attempts[0].locked_until&&new Date(attempts[0].locked_until).getTime()>Date.now())return send(res,429,{error:'Demasiados intentos. Espera 15 minutos.'});
   const user=await sql`SELECT value FROM personal_settings WHERE key='username'`;
   const [salt,hash]=stored[0].value.split(':');
   const pass=typeof b.password==='string'&&b.password.length<=128?digest(b.password,salt):'';
   if(!safeEqual(clean(b.username),user[0]?.value||'')||!safeEqual(pass,hash)){
    await sql`INSERT INTO personal_login_attempts(key,count,window_start,locked_until) VALUES(${key},1,NOW(),NULL) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN personal_login_attempts.window_start<NOW()-INTERVAL '15 minutes' THEN 1 ELSE personal_login_attempts.count+1 END,window_start=CASE WHEN personal_login_attempts.window_start<NOW()-INTERVAL '15 minutes' THEN NOW() ELSE personal_login_attempts.window_start END,locked_until=CASE WHEN personal_login_attempts.window_start>=NOW()-INTERVAL '15 minutes' AND personal_login_attempts.count>=4 THEN NOW()+INTERVAL '15 minutes' ELSE NULL END`;
    return send(res,401,{error:'Usuario o contraseña incorrectos.'});
   }
   await sql`DELETE FROM personal_login_attempts WHERE key=${key}`;
   const exp=String(Date.now()+7*86400000);
   res.setHeader('Set-Cookie',cookie(exp+'.'+sign(exp,secret),7*86400));
   return send(res,200,{ok:true});
  }
  if(path==='logout'&&req.method==='POST'){res.setHeader('Set-Cookie',cookie('',0));return send(res,200,{ok:true});}
  if(!authenticated(req,secret))return send(res,401,{error:'Inicia sesión para continuar.'});
  if(path==='data'&&req.method==='GET'){
   const [movements,plans,goals,settings]=await Promise.all([
    sql`SELECT id::text,TO_CHAR(date,'YYYY-MM-DD') AS date,description,amount_cents::integer,category,kind FROM personal_movements ORDER BY date DESC,created_at DESC`,
    sql`SELECT id::text,description,amount_cents::integer,kind,category,start_month,end_month,day FROM personal_plans ORDER BY start_month,description`,
    sql`SELECT id::text,name,target_cents::integer,saved_cents::integer FROM personal_goals ORDER BY created_at`,
    sql`SELECT key,value FROM personal_settings WHERE key IN ('opening_balance','opening_month')`]);
   return send(res,200,{movements,plans,goals,settings:Object.fromEntries(settings.map(x=>[x.key,x.value]))});
  }
  if(path==='settings'&&req.method==='PUT'){
   if(!month(b.opening_month)||!Number.isSafeInteger(b.opening_balance)||Math.abs(b.opening_balance)>1e11)return send(res,400,{error:'Saldo o mes inválido.'});
   await sql`INSERT INTO personal_settings(key,value) VALUES('opening_month',${b.opening_month}) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`;
   await sql`INSERT INTO personal_settings(key,value) VALUES('opening_balance',${String(b.opening_balance)}) ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value`;
   return send(res,200,{ok:true});
  }
  const match=path.match(/^(movements|plans|goals)(?:\/([0-9a-f-]{36}))?$/);
  if(!match)return send(res,404,{error:'Ruta no encontrada.'});
  const [,table,id]=match;
  if(req.method==='DELETE'&&id){
   if(table==='movements')await sql`DELETE FROM personal_movements WHERE id=${id}`;
   if(table==='plans')await sql`DELETE FROM personal_plans WHERE id=${id}`;
   if(table==='goals')await sql`DELETE FROM personal_goals WHERE id=${id}`;
   return send(res,200,{ok:true});
  }
  if(!['POST','PUT'].includes(req.method)||(req.method==='POST'&&id)||(req.method==='PUT'&&!id))return send(res,405,{error:'Método no permitido.'});
  if(!validRecord(table,b))return send(res,400,{error:'Revisa los datos introducidos.'});
  const uid=id||randomUUID(),cat=clean(b.category)||'Otros';
  if(table==='movements'){
   if(id)await sql`UPDATE personal_movements SET date=${b.date},description=${clean(b.description)},amount_cents=${b.amount_cents},kind=${b.kind},category=${cat} WHERE id=${uid}`;
   else await sql`INSERT INTO personal_movements(id,date,description,amount_cents,kind,category) VALUES(${uid},${b.date},${clean(b.description)},${b.amount_cents},${b.kind},${cat})`;
  }else if(table==='plans'){
   if(id)await sql`UPDATE personal_plans SET description=${clean(b.description)},amount_cents=${b.amount_cents},kind=${b.kind},category=${cat},start_month=${b.start_month},end_month=${b.end_month},day=${b.day} WHERE id=${uid}`;
   else await sql`INSERT INTO personal_plans(id,description,amount_cents,kind,category,start_month,end_month,day) VALUES(${uid},${clean(b.description)},${b.amount_cents},${b.kind},${cat},${b.start_month},${b.end_month},${b.day})`;
  }else{
   if(id)await sql`UPDATE personal_goals SET name=${clean(b.name)},target_cents=${b.target_cents},saved_cents=${b.saved_cents} WHERE id=${uid}`;
   else await sql`INSERT INTO personal_goals(id,name,target_cents,saved_cents) VALUES(${uid},${clean(b.name)},${b.target_cents},${b.saved_cents})`;
  }
  return send(res,id?200:201,{ok:true,id:uid});
 }catch(err){console.error('PERSONAL API',err);return send(res,500,{error:'Error del servidor. Comprueba las tablas y la configuración.'});}
}
