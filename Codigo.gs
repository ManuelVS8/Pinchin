/**
 * La casa de Pinchín · servidor (Google Apps Script + Hoja de cálculo propia, independiente de Lumi)
 * CEIP Manuel Siurot
 *
 * Pestaña «Clases»:   A clase · B fruta (la combinación secreta: tres veces esa fruta) · C activa (sí/no)
 * Pestaña «Alumnado»: A nombre · B clase · C alta · D última vez · E monedas · F nivel · G medallas ·
 *                     H progreso (oculta) · I datos (oculta) · J modo (profe) · K semana ·
 *                     L ⚽ F+N · M ⚽ N · N 🏀 F+N · O 🏀 N   (mejor tiempo de siempre, en segundos)
 *                     P ⚽ F+N sem · Q ⚽ N sem · R 🏀 F+N sem · S 🏀 N sem   (mejor tiempo de la semana)
 *  (F+N = modo «frutas y números»; N = modo «solo números»)
 */
const HOJA = 'Alumnado', CLASES = 'Clases';
const MAX_FALLOS = 8;     // combinaciones o nombres equivocados seguidos por aparato
const BLOQUEO_S = 600;    // bloqueo de 10 minutos
const MAX_FILAS = 800;    // tope de alumnos en la hoja
const COLS = 19;
const ANIMALES = ['🦊', '🐸', '🐼', '🐱', '🐶', '🦁', '🐰', '🐻'];

function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function hoja_() { return ss_().getSheetByName(HOJA) || ss_().insertSheet(HOJA); }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function num_(x) { x = Number(x); return isFinite(x) ? x : 0; }
function fr_(s) { return String(s || '').replace(/️/g, '').trim(); }
function norm_(s) { return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function seg_(cs) { cs = num_(cs); return cs > 0 ? Math.round(cs) / 100 : ''; }

// Autocomprobación: abre la URL /exec en el navegador y te dice si todo está bien
function doGet() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) return out_({ ok: false, msg: 'El script no está dentro de la hoja: créalo desde la hoja con Extensiones → Apps Script' });
    const c = ss.getSheetByName(CLASES), a = ss.getSheetByName(HOJA);
    const clases = c && c.getLastRow() > 1 ? c.getRange(2, 1, c.getLastRow() - 1, 3).getValues().filter(r => String(r[0]).trim()).map(r => String(r[0]).trim() + ' ' + fr_(r[1]) + (norm_(r[2]) === 'no' ? ' (cerrada)' : '')) : [];
    return out_({ ok: true, msg: 'La casa de Pinchín · servicio activo', hoja: ss.getName(), clases: clases, alumnos: a ? Math.max(0, a.getLastRow() - 1) : 0,
      aviso: !c ? 'Falta la pestaña Clases: menú 🦔 Pinchín → Preparar hoja' : clases.length ? '' : 'La pestaña Clases está vacía' });
  } catch (x) { return out_({ ok: false, msg: 'Error: ' + x.message }); }
}

// Clase a la que corresponde una fruta (solo clases activas)
function clase_(f) {
  f = fr_(f);
  const sh = ss_().getSheetByName(CLASES);
  if (!f || !sh || sh.getLastRow() < 2) return null;
  const v = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  for (const r of v) {
    const act = norm_(r[2]);
    if (String(r[0]).trim() && fr_(r[1]) === f && act !== 'no') return { c: String(r[0]).trim() };
  }
  return null;
}
function filas_(sh) {
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, COLS).getValues() : [];
}
function buscar_(v, c, n) {
  const k = norm_(n);
  for (let i = 0; i < v.length; i++) if (String(v[i][1]).trim() === c && norm_(v[i][0]) === k) return i;
  return -1;
}

// Cualquier fallo se devuelve como JSON (si no, el navegador solo ve «sin conexión»)
function doPost(e) {
  try { return doPost_(e); } catch (x) { return out_({ ok: false, err: 'server', msg: String(x && x.message || x) }); }
}
function doPost_(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, err: 'bad' }); }
  const a = b && b.a;
  if (['clase', 'alta', 'sync', 'rank'].indexOf(a) < 0) return out_({ ok: false, err: 'bad' });
  const cache = CacheService.getScriptCache();
  const ck = 'f_' + String(b.d || 'x').slice(0, 20);
  if (num_(cache.get(ck)) >= MAX_FALLOS) return out_({ ok: false, err: 'locked' });
  const falla = err => { cache.put(ck, String(num_(cache.get(ck)) + 1), BLOQUEO_S); return out_({ ok: false, err: err }); };

  const cl = clase_(b.f);
  if (!cl) return falla(a === 'clase' || a === 'alta' ? 'code' : 'login');

  if (a === 'clase') {
    cache.remove(ck);
    const nombres = filas_(hoja_()).filter(r => String(r[1]).trim() === cl.c && String(r[0]).trim()).map(r => String(r[0]).trim());
    nombres.sort((x, y) => x.localeCompare(y, 'es'));
    return out_({ ok: true, c: cl.c, nombres: nombres });
  }

  if (a === 'rank') {
    if (String(b.c || '').trim() !== cl.c) return falla('login');
    const v = filas_(hoja_()), i = buscar_(v, cl.c, b.n);
    if (i < 0) return falla('login');
    return out_({ ok: true, semana: lunes_(), rank: ranking_(v, i) });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return out_({ ok: false, err: 'busy' });
  try {
    const sh = hoja_(), v = filas_(sh);

    if (a === 'alta') {
      let n = String(b.n || '').trim().replace(/\s+/g, ' ').slice(0, 16);
      n = n.charAt(0).toUpperCase() + n.slice(1);
      if (n.length < 2 || !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñÇç]/.test(n)) return out_({ ok: false, err: 'nombre' });
      if (v.length >= MAX_FILAS) return out_({ ok: false, err: 'lleno' });
      if (buscar_(v, cl.c, n) >= 0) {
        const libre = x => buscar_(v, cl.c, x) < 0, sug = [];
        for (let k = 2; k < 30 && sug.length < 1; k++) if (libre(n + ' ' + k)) sug.push(n + ' ' + k);
        for (const an of ANIMALES) { if (sug.length >= 3) break; if (libre(n + ' ' + an)) sug.push(n + ' ' + an); }
        return out_({ ok: false, err: 'existe', sug: sug });
      }
      const fila = [n, cl.c, new Date(), '', 0, 1, 0, '', '', ''];
      while (fila.length < COLS) fila.push('');
      sh.getRange(sh.getLastRow() + 1, 1, 1, COLS).setValues([fila]);
      cache.remove(ck);
      return out_({ ok: true, c: cl.c, n: n });
    }

    // sync
    if (String(b.c || '').trim() !== cl.c) return falla('login');
    const i = buscar_(v, cl.c, b.n);
    if (i < 0) return falla('login');
    cache.remove(ck);
    const row = i + 2, r = v[i];
    const nombre = String(r[0]).trim();
    const modo = String(r[9] || '').trim().toLowerCase();
    const storedProg = num_(r[7]);
    const stored = String(r[8] || '');
    if (b.data != null) {
      const data = String(b.data);
      if (data.length > 49000) return out_({ ok: false, err: 'big' });
      const prog = num_(b.prog);
      // Solo se guarda si trae igual o más progreso (o si es un reinicio voluntario): nunca se pisa con algo menor
      if (b.force || !stored || prog >= storedProg) {
        const s = b.sum || {};
        sh.getRange(row, 4, 1, 6).setValues([[new Date(), num_(s.coins), num_(s.level), num_(s.med), prog, data]]);
        if (s.wk) sh.getRange(row, 11, 1, 9).setValues([['sem ' + String(s.wk).slice(0, 10), seg_(s.fm), seg_(s.fn), seg_(s.bm), seg_(s.bn), seg_(s.wfm), seg_(s.wfn), seg_(s.wbm), seg_(s.wbn)]]);
        return out_({ ok: true, saved: true, name: nombre, mode: modo });
      }
      return out_({ ok: true, saved: false, data: stored, name: nombre, mode: modo });
    }
    return out_({ ok: true, saved: false, data: stored || null, name: nombre, mode: modo });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Ranking por tiempo (menos es mejor), de todas las clases ---------- */
function lunes_() {
  const d = new Date(), dia = Number(Utilities.formatDate(d, 'Europe/Madrid', 'u'));   // 1 = lunes … 7 = domingo
  return Utilities.formatDate(new Date(d.getTime() - (dia - 1) * 864e5), 'Europe/Madrid', 'yyyy-MM-dd');
}
function esAdmin_(r) { return String(r[9] || '').trim().toLowerCase() === 'todo'; }
function ranking_(v, yo) {
  const sem = lunes_(), yoAdmin = esAdmin_(v[yo]), al = [];
  v.forEach((r, i) => {
    const nom = String(r[0] || '').trim();
    if (!nom) return;
    if (esAdmin_(r) && !yoAdmin && i !== yo) return;   // las cuentas admin solo las ven otros admin
    const act = String(r[10] || '').trim() === 'sem ' + sem;
    al.push({ i: i, n: nom, g: String(r[1] || '').trim(), t: [11, 12, 13, 14].map(k => num_(r[k])), s: [15, 16, 17, 18].map(k => act ? num_(r[k]) : 0) });
  });
  const lista = (arr, k) => {
    const l = al.filter(a => a[arr][k] > 0).sort((x, y) => x[arr][k] - y[arr][k]);
    const pos = l.findIndex(a => a.i === yo) + 1;
    return { top: l.slice(0, 10).map(a => ({ n: a.n, g: a.g, p: a[arr][k], me: a.i === yo })), pos: pos, myp: pos ? l[pos - 1][arr][k] : 0 };
  };
  const par = k => ({ sem: lista('s', k), tot: lista('t', k) });
  return { fut: { m: par(0), n: par(1) }, bask: { m: par(2), n: par(3) } };
}

/* ---------- Menú para el profe ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🦔 Pinchín')
    .addItem('Preparar hoja', 'preparar')
    .addItem('Revisar nombres repetidos', 'revisar')
    .addToUi();
}
function preparar() {
  const ss = ss_();
  let c = ss.getSheetByName(CLASES);
  if (!c) {
    c = ss.insertSheet(CLASES);
    c.getRange(1, 1, 3, 3).setValues([['clase', 'fruta', 'activa'], ['1º A', '🍇', 'sí'], ['1º B', '🍎', 'sí']]);
  }
  c.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#ffe0b2');
  c.setFrozenRows(1); c.setColumnWidth(1, 160);
  c.getRange(1, 5, 4, 1).setValues([['Frutas posibles: 🍎 🍌 🍇 🍊 🍓 🍉 🍐 🍍 🥝 🍋'], ['Una fruta distinta para cada clase.'], ['Para entrar, el niño toca tres veces esa fruta.'], ['Pon «no» en activa para cerrar una clase.']]);
  const sh = hoja_();
  sh.getRange(1, 1, 1, COLS).setValues([['nombre', 'clase', 'alta', 'última vez', 'monedas', 'nivel', 'medallas', 'progreso', 'datos', 'modo (profe)', 'semana',
    '⚽ F+N', '⚽ N', '🏀 F+N', '🏀 N', '⚽ F+N sem', '⚽ N sem', '🏀 F+N sem', '🏀 N sem']]);
  sh.getRange(1, 1, 1, COLS).setFontWeight('bold').setBackground('#ffe0b2');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 150); sh.setColumnWidths(2, 1, 90); sh.setColumnWidths(3, 2, 140);
  sh.getRange(2, 3, Math.max(sh.getMaxRows() - 1, 1), 2).setNumberFormat('dd/MM/yyyy HH:mm');
  sh.hideColumns(8, 2);
  ss.toast('Hoja preparada ✅');
}
function revisar() {
  const v = filas_(hoja_()), vistos = {}, dup = [];
  v.forEach((r, i) => {
    const k = String(r[1]).trim() + '|' + norm_(r[0]);
    if (!String(r[0]).trim()) return;
    if (vistos[k]) dup.push(r[0] + ' · ' + r[1] + ' (filas ' + vistos[k] + ' y ' + (i + 2) + ')'); else vistos[k] = i + 2;
  });
  SpreadsheetApp.getUi().alert(dup.length ? 'Nombres repetidos en la misma clase:\n' + dup.join('\n') : '✅ No hay nombres repetidos (' + Object.keys(vistos).length + ' alumnos)');
}
