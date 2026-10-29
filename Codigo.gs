/*******************************************************************
 * CBVI — Revisiones Técnicas · Backend (Google Apps Script)
 * Cuerpo de Bomberos Voluntarios de Inírida — Abnegación y Disciplina
 *
 * Router único doPost  +  doGet público de verificación de conceptos.
 * Base de datos: Google Sheets (el mismo archivo donde vive este script).
 * Almacenamiento de fotos: Google Drive (carpeta compartida con Editor).
 *
 * REGLAS DE DESPLIEGUE (no las rompas):
 *  - La URL del Web App NO cambia. Al actualizar: Implementar →
 *    Administrar implementaciones → ✏️ Editar → "Nueva versión".
 *  - El front envía cada fetch con  Content-Type: text/plain;charset=utf-8
 *  - Contraseñas/secretos viven en Propiedades del script, nunca en el código.
 *
 * PRIMER USO: define las Propiedades del script (ver abajo) y ejecuta
 * una vez la función  inicializar().
 *   Propiedades del script requeridas/opcionales:
 *     PASE_SECRET      (obligatoria) secreto para firmar los pases/QR
 *     ADMIN_EMAIL      correo del administrador inicial (comandante)
 *     ADMIN_PIN        PIN inicial del administrador (ej. 4 dígitos)
 *     DRIVE_FOLDER_ID  carpeta de Drive para las fotos (compartida Editor)
 *     SHEET_ID         (opcional) id de la hoja; por defecto la activa
 *******************************************************************/

var CFG = { TZ: 'America/Bogota', CACHE_TTL: 21600, PASE_DIAS: 30 };

var SHEETS = {
  EST:  'Establecimientos',
  INS:  'Inspecciones',
  EVI:  'Evidencias',
  INSP: 'Inspectores',
  CONF: 'Config',
  VER:  'Verificaciones'
};

var HEADERS = {
  Establecimientos: ['id','codigo','nombre','nit','tipo','ocup','actividad','direccion','barrio','lat','lng','repLegal','correo','tel','estado','creado','actualizado'],
  Inspecciones:     ['id','idCliente','codigo','establecimientoId','radicado','tramite','nivel','inspectorEmail','inspectorNombre','inspectorCodigo','fecha','ocupacion','clasifRiesgo','X','Y','total','score100','favorable','riesgo','estado','vigenciaHasta','conceptoUrl','recomendaciones','respuestas','sig','nCobro','creado'],
  Evidencias:       ['id','inspeccionId','itemId','driveFileId','url','lat','lng','timestamp'],
  Inspectores:      ['email','nombre','codigo','rol','pinHash','cursoVigente','activo'],
  Config:           ['clave','valor'],
  Verificaciones:   ['conceptoId','fecha','resultado']
};

/* ===================== Infraestructura de hojas ===================== */
function _prop(k){ return PropertiesService.getScriptProperties().getProperty(k); }
function _ss(){ var id=_prop('SHEET_ID'); return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet(); }
function _sheet(name){
  var ss=_ss(), sh=ss.getSheetByName(name);
  if(!sh){ sh=ss.insertSheet(name); if(HEADERS[name]) sh.getRange(1,1,1,HEADERS[name].length).setValues([HEADERS[name]]).setFontWeight('bold'); }
  return sh;
}
function _rows(name){
  var sh=_sheet(name), v=sh.getDataRange().getValues(); if(v.length<2) return [];
  var h=v[0];
  return v.slice(1).map(function(r){ var o={}; h.forEach(function(k,i){ o[k]=r[i]; }); return o; });
}
function _append(name,obj){ var h=HEADERS[name]; _sheet(name).appendRow(h.map(function(k){ return obj[k]!=null?obj[k]:''; })); }
function _findRow(name,key,val){
  var sh=_sheet(name), v=sh.getDataRange().getValues(), h=v[0], ci=h.indexOf(key);
  for(var i=1;i<v.length;i++){ if(String(v[i][ci])===String(val)) return {sh:sh,row:i+1,h:h,data:v[i]}; }
  return null;
}
function _rowObj(f){ var o={}; f.h.forEach(function(k,i){ o[k]=f.data[i]; }); return o; }
function _upsert(name,key,obj){
  var f=_findRow(name,key,obj[key]), h=HEADERS[name];
  if(f){ var row=h.map(function(k){ return obj[k]!=null?obj[k]:f.data[h.indexOf(k)]; }); f.sh.getRange(f.row,1,1,h.length).setValues([row]); return false; }
  _append(name,obj); return true;
}
function _conLock(fn){ var lock=LockService.getScriptLock(); lock.waitLock(20000); try{ return fn(); } finally{ lock.releaseLock(); } }
function _now(){ return Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd HH:mm:ss'); }
function _year(){ return Utilities.formatDate(new Date(), CFG.TZ, 'yyyy'); }
function _nextCodigo(name,prefix,pad){ var n=_rows(name).length+1, s=''+n; while(s.length<(pad||3)) s='0'+s; return prefix+'-'+s; }
function _tryJson(v){ try{ return JSON.parse(v); }catch(e){ return v; } }

/* ===================== Respuestas ===================== */
function _json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function _ok(d){ d=d||{}; d.ok=true; return _json(d); }
function _err(m){ return _json({ok:false, error:m}); }

/* ===================== Seguridad ===================== */
function _b64url(bytes){ return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/,''); }
function _hmac(s){ var key=_prop('PASE_SECRET')||'CAMBIA_ESTE_SECRETO'; return _b64url(Utilities.computeHmacSha256Signature(s, key)); }
function _sha(s){ return _b64url(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s)); }
function _sig(codigo){ return _hmac(codigo+'|concepto').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6); }

// Pase de sesión firmado (30 días), se verifica sin llamar a Sheets.
function _emitirPase(email,rol){
  var exp=Date.now()+CFG.PASE_DIAS*864e5;
  var payload=_b64url(Utilities.newBlob(JSON.stringify({e:email,r:rol,x:exp})).getBytes());
  return payload+'.'+_hmac(payload);
}
function _verificarPase(pase){
  if(!pase||pase.indexOf('.')<0) return null;
  var p=pase.split('.'); if(_hmac(p[0])!==p[1]) return null;
  try{ var o=JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(p[0])).getDataAsString()); return o.x<Date.now()?null:o; }catch(e){ return null; }
}
function _identidad(data){ return _verificarPase(data.pase); }
function _esAdmin(data){ var o=_identidad(data); return (o&&o.r==='comandante')?o:null; }
function _requireId(data,fn){ var o=_identidad(data); if(!o) return _err('No autorizado'); return fn(data,o); }
function _requireAdmin(data,fn){ var o=_esAdmin(data); if(!o) return _err('Solo el administrador puede hacer esto'); return fn(data,o); }

/* ===================== Router doPost ===================== */
function doPost(e){
  var data;
  try{ data=JSON.parse(e.postData.contents); }catch(err){ return _err('JSON inválido'); }
  try{
    switch(data.accion){
      case 'login':                  return _login(data);
      case 'solicitarAcceso':        return _solicitarAcceso(data);
      case 'getConfig':              return _getConfig(data);
      case 'listarEstablecimientos': return _requireId(data, _listarEstablecimientos);
      case 'crearEstablecimiento':   return _requireId(data, _crearEstablecimiento);
      case 'guardarInspeccion':      return _requireId(data, _guardarInspeccion);
      case 'subirEvidencia':         return _requireId(data, _subirEvidencia);
      case 'listarInspecciones':     return _requireId(data, _listarInspecciones);
      case 'estadisticas':           return _requireId(data, _estadisticas);
      case 'setConfig':              return _requireAdmin(data, _setConfig);
      case 'listarInspectores':      return _requireAdmin(data, _listarInspectores);
      case 'guardarInspector':       return _requireAdmin(data, _guardarInspector);
      default: return _err('Acción desconocida: '+data.accion);
    }
  }catch(err){ return _err('Error: '+err); }
}

/* ===================== Login ===================== */
function _login(data){
  var email=(data.email||'').toLowerCase().trim(), pin=String(data.pin||'');
  if(!email||!pin) return _err('Faltan credenciales');
  var f=_findRow(SHEETS.INSP,'email',email); if(!f) return _err('Usuario no encontrado');
  var o=_rowObj(f);
  if(!o.pinHash) return _err('Tu acceso está pendiente de aprobación por el administrador');
  if(String(o.activo).toLowerCase()==='false') return _err('Usuario inactivo. Contacta al administrador');
  if(_sha(pin+email)!==String(o.pinHash)) return _err('PIN incorrecto');
  return _ok({ pase:_emitirPase(email,o.rol), usuario:{email:email,nombre:o.nombre,rol:o.rol,codigo:o.codigo} });
}

/* ===================== Establecimientos ===================== */
function _listarEstablecimientos(){ return _ok({establecimientos:_rows(SHEETS.EST)}); }
function _crearEstablecimiento(data){
  var e=data.establecimiento||{}; if(!e.nombre) return _err('Falta el nombre');
  _conLock(function(){
    if(e.id && _findRow(SHEETS.EST,'id',e.id)){ e.actualizado=_now(); _upsert(SHEETS.EST,'id',e); }
    else { e.id=e.id||Utilities.getUuid(); if(!e.codigo)e.codigo=_nextCodigo(SHEETS.EST,'EST',3); e.creado=_now(); e.actualizado=_now(); _append(SHEETS.EST,e); }
  });
  return _ok({establecimiento:e});
}

/* ===================== Inspección (idempotente) ===================== */
function _guardarInspeccion(data,ident){
  var ins=data.inspeccion||{}; if(!ins.idCliente) return _err('Falta idCliente');
  var cache=CacheService.getScriptCache(), hit=cache.get('ins_'+ins.idCliente);
  if(hit) return _ok({inspeccion:_tryJson(hit), idempotente:true});
  var result;
  _conLock(function(){
    var f=_findRow(SHEETS.INS,'idCliente',ins.idCliente);   // doble chequeo dentro del lock
    if(f){ result=_rowObj(f); return; }
    ins.id=ins.id||Utilities.getUuid();
    if(!ins.codigo) ins.codigo=_nextCodigo(SHEETS.INS,'RT-'+_year(),4);
    ins.inspectorEmail=ident.e;
    ins.sig=_sig(ins.codigo);
    if(typeof ins.respuestas==='object')     ins.respuestas=JSON.stringify(ins.respuestas);
    if(typeof ins.recomendaciones==='object')ins.recomendaciones=JSON.stringify(ins.recomendaciones);
    ins.creado=_now();
    _append(SHEETS.INS,ins);
    result=ins;
  });
  cache.put('ins_'+ins.idCliente, JSON.stringify(result), CFG.CACHE_TTL);
  return _ok({inspeccion:result});
}
function _listarInspecciones(){ return _ok({inspecciones:_rows(SHEETS.INS)}); }

/* ===================== Evidencia (foto → Drive) ===================== */
function _subirEvidencia(data){
  var folderId=_prop('DRIVE_FOLDER_ID'); if(!folderId) return _err('Falta DRIVE_FOLDER_ID en Propiedades del script');
  var b=String(data.base64||'').replace(/^data:[^,]+,/,''); if(!b) return _err('Falta la imagen');
  var blob=Utilities.newBlob(Utilities.base64Decode(b), data.contentType||'image/jpeg', (data.nombre||('evid_'+Date.now()))+'.jpg');
  var file=DriveApp.getFolderById(folderId).createFile(blob);
  try{ file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); }catch(e){}
  var ev={ id:Utilities.getUuid(), inspeccionId:data.inspeccionId||'', itemId:data.itemId||'', driveFileId:file.getId(), url:file.getUrl(), lat:data.lat||'', lng:data.lng||'', timestamp:_now() };
  _conLock(function(){ _append(SHEETS.EVI, ev); });   // url en texto plano (NO =HYPERLINK, evita #ERROR!)
  return _ok({evidencia:ev});
}

/* ===================== Config / Metas ===================== */
function _getConfig(){ var o={}; _rows(SHEETS.CONF).forEach(function(r){ o[r.clave]=_tryJson(r.valor); }); return _ok({config:o}); }
function _setConfig(data){
  var c=data.config||{};
  _conLock(function(){ Object.keys(c).forEach(function(k){ var v=(typeof c[k]==='object')?JSON.stringify(c[k]):c[k]; _upsert(SHEETS.CONF,'clave',{clave:k,valor:v}); }); });
  return _ok({});
}

/* ===================== Estadísticas ===================== */
function _estadisticas(){
  var ins=_rows(SHEETS.INS).filter(function(x){ return String(x.estado)==='finalizada'; });
  var est=_rows(SHEETS.EST);
  var mesActual=Utilities.formatDate(new Date(),CFG.TZ,'yyyy-MM'), mes=0;
  ins.forEach(function(x){ if(String(x.fecha).indexOf(mesActual)===0) mes++; });
  var vigentes=0,porVencer=0,vencidos=0;
  est.forEach(function(e){
    var u=ins.filter(function(x){return String(x.establecimientoId)===String(e.id);}).sort(function(a,b){return String(b.fecha)<String(a.fecha)?-1:1;})[0];
    if(!u) return;
    var dias=Math.round((new Date(u.vigenciaHasta)-new Date())/86400000);
    if(String(u.favorable)!=='true'||dias<0) vencidos++; else if(dias<=30) porVencer++; else vigentes++;
  });
  return _ok({ estadisticas:{ totalEstablecimientos:est.length, totalInspecciones:ins.length, inspeccionesMes:mes, vigentes:vigentes, porVencer:porVencer, vencidos:vencidos } });
}

/* ===================== Inspectores ===================== */
function _listarInspectores(){ return _ok({inspectores:_rows(SHEETS.INSP).map(function(o){ return {email:o.email,nombre:o.nombre,codigo:o.codigo,rol:o.rol,activo:String(o.activo).toLowerCase()!=='false',aprobado:!!o.pinHash,cursoVigente:o.cursoVigente}; })}); }
function _solicitarAcceso(data){
  var email=(data.email||'').toLowerCase().trim(), nombre=(data.nombre||'').trim();
  if(!email) return _err('Falta el correo');
  var f=_findRow(SHEETS.INSP,'email',email);
  if(f){ var o=_rowObj(f); return _ok(o.pinHash?{yaExiste:true}:{pendiente:true}); }
  _conLock(function(){ _append(SHEETS.INSP,{email:email,nombre:nombre||email,codigo:'',rol:'inspector',pinHash:'',cursoVigente:'',activo:false}); });
  return _ok({pendiente:true});
}
function _guardarInspector(data){
  var i=data.inspector||{}; if(!i.email) return _err('Falta email');
  i.email=i.email.toLowerCase().trim();
  if(i.pin){ i.pinHash=_sha(String(i.pin)+i.email); delete i.pin; }
  if(i.activo==null) i.activo=true;
  if(!i.rol) i.rol='inspector';
  _conLock(function(){ _upsert(SHEETS.INSP,'email',i); });
  return _ok({});
}

/* ===================== Verificación pública (QR / doGet) ===================== */
function doGet(e){
  var c=String((e.parameter.c||'')).toUpperCase().trim(), d=String((e.parameter.d||'')).toUpperCase().trim();
  var ok=false, titulo, detalle='', nombre='';
  if(!c){ titulo='Ingrese el código del concepto'; }
  else {
    var f=_findRow(SHEETS.INS,'codigo',c);
    if(!f){ titulo='Concepto no encontrado'; detalle='No existe un concepto con el código '+c+'.'; }
    else {
      var o=_rowObj(f);
      if(_sig(c)!==d){ titulo='No verificado'; detalle='El distintivo no coincide. Posible falsificación.'; }
      else {
        var est=_findRow(SHEETS.EST,'id',o.establecimientoId); nombre=est?_rowObj(est).nombre:'';
        var dias=Math.round((new Date(o.vigenciaHasta)-new Date())/86400000), fav=String(o.favorable)==='true';
        ok = fav && dias>=0;
        titulo = ok ? 'Concepto vigente y auténtico' : (fav?'Concepto vencido':'Concepto no favorable');
        detalle = (fav?'Favorable':'No favorable')+' · vence '+Utilities.formatDate(new Date(o.vigenciaHasta),CFG.TZ,'dd/MM/yyyy')+(dias<0?(' (hace '+(-dias)+' días)'):'');
      }
    }
    _conLock(function(){ _append(SHEETS.VER,{conceptoId:c,fecha:_now(),resultado:titulo}); });
  }
  return _htmlVerif(titulo, detalle, nombre, c, ok);
}
function _esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];}); }
function _htmlVerif(titulo, detalle, nombre, codigo, ok){
  var col = ok ? '#17864b' : '#c0271f';
  var html =
   '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
   '<title>Verificación de concepto — CBVI</title>'+
   '<style>body{margin:0;font-family:system-ui,Arial,sans-serif;background:#f3f1ec;color:#1b1714;display:grid;place-items:center;min-height:100vh}'+
   '.c{background:#fff;border:1px solid #e0dccf;border-radius:16px;max-width:420px;width:92%;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08)}'+
   '.h{background:#191d23;color:#fff;padding:18px 20px;font-weight:700}.h small{display:block;font-weight:400;opacity:.7;font-size:11px;letter-spacing:2px}'+
   '.b{padding:22px 20px}.badge{font-size:40px;line-height:1}.t{font-size:20px;font-weight:700;margin:6px 0;color:'+col+'}'+
   '.d{color:#555;font-size:14px}.cod{margin-top:14px;font-family:monospace;font-size:12px;color:#777}</style>'+
   '<div class="c"><div class="h"><small>CUERPO DE BOMBEROS VOLUNTARIOS DE INÍRIDA</small>Verificación de concepto técnico</div>'+
   '<div class="b"><div class="badge">'+(ok?'✅':'⚠️')+'</div><div class="t">'+_esc(titulo)+'</div>'+
   (nombre?'<div class="d"><b>'+_esc(nombre)+'</b></div>':'')+
   (detalle?'<div class="d">'+_esc(detalle)+'</div>':'')+
   (codigo?'<div class="cod">Código: '+_esc(codigo)+'</div>':'')+
   '</div></div>';
  return HtmlService.createHtmlOutput(html).setTitle('Verificación de concepto — CBVI');
}

/* ===================== Inicialización (ejecutar una vez) ===================== */
function inicializar(){
  Object.keys(HEADERS).forEach(function(name){ _sheet(name); });
  if(_rows(SHEETS.INSP).length===0){
    var email=(_prop('ADMIN_EMAIL')||'admin@cbvi.gov.co').toLowerCase();
    _append(SHEETS.INSP, { email:email, nombre:'Administrador', codigo:'ADM', rol:'comandante', pinHash:_sha((_prop('ADMIN_PIN')||'1234')+email), cursoVigente:'', activo:true });
  }
  var def={ metaRevisiones:12, metaRenovaciones:6, metaBarrido:30, vigenciaMeses:12, cobroActivo:false, tarifas:JSON.stringify([{nivel:'1',valor:97000},{nivel:'2',valor:196000},{nivel:'3',valor:327000}]) };
  Object.keys(def).forEach(function(k){ if(!_findRow(SHEETS.CONF,'clave',k)) _append(SHEETS.CONF,{clave:k,valor:def[k]}); });
  return 'Listo: hojas creadas, administrador y configuración por defecto.';
}
