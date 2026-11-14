# CONTEXTO · La casa de Pinchín (versión interna 1.0.6, 13-nov-2026)

Documento de traspaso para retomar este proyecto en otro chat. Adjunta con él `index.html`, `Codigo.gs`, `manifest.json`, `sw.js` y `GUIA.md`.

## Qué es
PWA de un solo archivo, tipo Pou, para Infantil 4 años – 1º de Primaria (CEIP Manuel Siurot). Mascota: **Pinchín**, un erizo con una manzana en los pinchos (SVG propio). Derivada de Lumi 2.2.1 (mismo esqueleto), pero es un juego independiente: otra clave local (`pinchin-v1`), otra hoja, otro script, otro ranking.
- Web prevista: `https://manuelvs8.github.io/Pinchin/` (repo `ManuelVS8/Pinchin`).
- Reglas de Manuel: entregar archivos (sin publicar artifacts), sin `alert/confirm/prompt`, botón Atrás = migas de pan, `index.html`, PWA con instalación nativa de Chrome, `?diag`, ZIP con la estructura, ser crítico, español conciso.

## Decisiones tomadas (13-nov)
- Nombre «La casa de Pinchín»; mascota erizo «Pinchín» (el huevo nace sin escribir nombre; se cambia en Ajustes).
- Matemáticas: sumas `a+b≤10`, `a,b≥1`; restas `a≤10`, `b≥1`, `a−b≥1` (nunca 0). Niveles: hasta 5 · hasta 7 · hasta 10 (total o minuendo). Cada ronda 10 ejercicios, ~7 nuevos del nivel + repaso.
- Dos casas (➕ suma, ➖ resta). **La resta se abre al superar el nivel 3 de la suma en cualquier modo.**
- Tres modos por casa: 🍎 Frutas (sin números, huecos fantasma), 🍎2 Frutas y números (número encima de la zona, sin fantasmas), 123 Números (operación y teclado 1–10).
- **1.0.6:** el número de versión ya no se muestra (ni en el inicio ni en Ajustes ni en los avisos de actualización; solo en `?diag`). El 🔊 de los juegos, casas, acceso y estadio lee siempre (`hablarYa`), aunque la voz automática esté desactivada. Manuel NO quiere: mostrar la versión, cambiar la hoja (columna de progreso) ni mover el MP3 del pedo (sigue en el repo de Lumi).
- **v1.0.5:** en las restas, al tocar una fruta de la diferencia vuela en arco hasta el sustraendo (`flyFruit`, Web Animations, 0,5 s; la fruta de llegada se oculta con `.arr` hasta que aterriza); al devolverla vuela al revés.
- **v1.0.4:** cajas (rectángulos redondeados) en vez de óvalos. Suma 🍎2: mientras rellenan los sumandos, el resultado se va llenando a la vez. **Restas (🍎 y 🍎2):** [minuendo fijo] − [sustraendo] = [diferencia]; la diferencia empieza con todas las frutas y, al tocarlas, se borran y pasan al sustraendo (tocar en el sustraendo las devuelve). En 🍎 se comprueba con ✔ (sustraendo con huecos de guía); en 🍎2 al quitar las justas se activa el teclado y escribe el número. Sustituye a lo de v1.0.3 en las restas.
- **v1.0.3 · Resta (sustituido):** en 🍎 Frutas, dos conjuntos a la misma altura (minuendo con sus frutas y sustraendo con huecos); el niño toca frutas del minuendo y pasan al sustraendo (desaparecen del primero, se devuelven tocándolas); al pulsar ✔, si pasó las justas sale el resultado debajo y cuenta como acierto (sin elegir opciones). En 🍎2 Frutas y números, arriba la operación y dos conjuntos con sus frutas (sin tachar) y su número; el niño pone abajo las que quedan (−, 🧺+, ✔) y luego escribe el número. **La voz viene desactivada por defecto** (se activa en Ajustes; `S.vozV=2` migra a «Sin voz» a quien ya la tenía). `demo.html`: copia con todo desbloqueado y monedas infinitas (clave `pinchin-demo-v1`, sin manifest ni service worker, sin nube); se rehace desde `index.html`.
- **v1.0.2 · Frutas y números = CONJUNTOS:** pantalla fija desde el principio (no crece). Suma: dos conjuntos (óvalos) con su número debajo; el niño toca el conjunto o 🧺+ para poner frutas y «−» para quitar; cuando los dos están bien se ponen verdes, aparece el total en el conjunto de abajo y se activa el teclado 1–10. Resta: un conjunto con el minuendo; lo llena, luego toca las frutas que quita (salen tachadas, «8 − 4» debajo); aparecen las que quedan y escribe el número. Pinchín ya no lleva la manzana en los pinchos (iconos regenerados).
- **v1.0.1:** Suma en 🍎 Frutas: la app ya muestra los sumandos con frutas; el niño llena el «banco» con el total (🧺+, tocar para quitar, ✔; tras 2 fallos aparecen huecos de pista). En 🍎2 Frutas y números: el niño pone las frutas de cada sumando, ✔, y las frutas de la operación se quedan; debajo aparece el total y escribe el número (igual en la resta: el minuendo con las tachadas se queda y debajo salen las que quedan).
- Suma 🍎2 (v1.0.0): el niño pone frutas con 🧺+ en dos zonas, ✔, luego cuenta (tocar numera) y responde. Resta con frutas: toca las frutas que quita (van al plato de Pinchín), ✔, cuenta las que quedan y responde. Respuesta en modo Frutas = elegir entre 3 grupos de frutas; en los otros = teclado 1–10.
- Superar nivel: **errores ≤ 2** (8/10 a la primera). Estrellas: 0 errores ⭐⭐⭐, 1–2 ⭐⭐, 3–4 ⭐ (no superado). Tras 2 intentos fallidos se ilumina la respuesta correcta. Errores al construir solo avisan, no cuentan.
- Recompensas: monedas por acierto (2/3/4 según nivel; mitad si el nivel ya estaba superado), +10×nivel la primera vez, frutas a la cesta 🧺 (comida gratis en la cocina), XP, regalos de armario por nivel y por modo completo, color Dorado al abrir el estadio, medalla 🏅 y trofeo por terminar las dos casas en «Números». 17 logros. Reto del día (monedas ×2 +20) y racha.
- **Estadio:** se abre al superar el nivel 3 de suma y de resta en «Frutas y números» o «Números» (cualquier combinación). Portero (6 zonas) y Baloncesto (3 balones), **10 paradas/canastas, sin límite por pregunta, tiempo total en centésimas**; un fallo es gol/clonk y sigue. Tope de 40 tiros (sin récord). Solo modos 🍎2 y 123 (con frutas pequeñas de apoyo en 🍎2). Equipación por paradas totales: 10/30/60/100.
- **Ranking:** por tiempo, de menor a mayor; ⚽/🏀 × (Frutas y números | Números) × (semana | siempre); todas las clases; admins solo para admins.
- **Cuentas:** «Elige la combinación» = 10 frutas mezcladas (5×2), tocar 3; la correcta es tres veces la fruta de la clase (pestaña Clases). Luego lista de nombres de la clase o «Soy nuevo» (solo nombre; si existe, sugiere «Ana 2», «Ana 🦊»…). Bloqueo local 1 min tras 5 fallos; servidor 10 min tras 8 fallos por aparato. Seguridad: barrera de clase, no contraseña personal (avisado a Manuel).
- Voz: TTS del aparato si tiene voz es-ES; si no, voz en línea de Google Traductor (`translate_tts`). Ajustes: Automática / Del aparato / En línea / Sin voz. Los bocadillos de la mascota también se leen.

## Arquitectura de `index.html`
Un IIFE. Se montó con un script a partir de trozos de Lumi; **desde ahora la fuente es `index.html`** (editar directamente). Bloques principales:
- Pinchín: `spikePath`, `HEDGE_BACK` (en `#charBack`). Mismos IDs de cara que Lumi (`#eyesOpen`, `#mouth`, `.ft1`…), así funcionan pedo, caras, gestos.
- Datos: `COLORS`, `ACCS` (slots hat/glasses/pal/neck; `gift:{h,l}` o `{h,m}` o `{trofeo}`), `FOODS`, `FR` (frutas con género para la voz), `HOUSES`, `MODES`, `LV_MAX`, `factsFor`, `choicesFor`.
- Estado `S`: `med[h][m][l]` (estrellas 0–3), `plays[h][m][l]`, `cesta{emoji:n}`, `fut{saves,games,best{m,n}}`, `bball{baskets,games,best{m,n}}` (tiempos en centésimas), `week{k,xp,fm,fn,bm,bn}`, `vozMode`, `fMode`, `acct`, `kit`, `daily`, `celebStadium`, `celebTrophy` + lo heredado de Lumi (needs, coins, xp, owned, achievements, stats, streak…).
- Casas: `openHouse`, `startRound`, `nextEx`, `renderEx`, `answer`, `finishRound`.
- Estadio: `openPenalty/startPenalty`, `openBasket/startBasket`, `stadiumResult`, `openLiga`.
- Voz: `hablar`, `callar`, `pickVoice`, `ONLINE_TTS`.
- Nube: `CLOUD_URL` (vacío = sin nube), `cloudCallR` (reintentos con espera al azar), `cloudSync` (primero descarga y fusiona con `mergeProg` campo a campo, luego sube; cada 45 s si hay cambios, al acabar partida, al ocultar y al volver), `S.acct` = `clase|nombre` (no mezcla mascotas de otra cuenta en un Chromebook compartido), `confirmCloudOut` vacía el aparato, `godApply/godKeep` (modo profe).
- `?diag`: `showDiag()` comprueba manifest, iconos (tamaño real), sw, service worker, botón instalar, voces, almacenamiento y servidor.

## Servidor (`Codigo.gs`)
URL de la aplicación web, ya puesta en `CLOUD_URL` de `index.html`: `https://script.google.com/macros/s/AKfycbwZ80C1dgm4ImIkMIsR0MGkWt14t5g5sgWkjrk1euIekwFD31P09eLp9oytd14qAyIc/exec`. `demo.html` no la usa (siempre local).
Acciones POST (`text/plain`): `clase {f}` → nombres; `alta {f,n}`; `sync {f,c,n,data?,prog?,force?,sum?}`; `rank {f,c,n}`. Errores: `code`, `login`, `locked`, `busy`, `existe` (+`sug`), `nombre`, `lleno` (800 filas), `big`. Solo guarda si `prog ≥ guardado` o `force`. `LockService` solo en escrituras. Columnas en la GUIA.

## Pruebas hechas (Playwright, Pixel 5 y Chromebook 1366×768)
`node --check`; ronda completa de suma con frutas (sobrellenar y corregir, contar, fallo y acierto), resta con frutas, suma mixta nivel 3, números con pista tras 2 fallos; 12.000 operaciones generadas sin salirse de las reglas; portero y baloncesto completos con récord y equipación; armario, regalos, logros; botón Atrás (juego → casa → cerrar → cocina); `?diag`; **el `Codigo.gs` real ejecutado en Node con una hoja simulada**: alta, duplicados con sugerencias, fruta sin clase, clase equivocada, no pisar con menos progreso, bloqueo, ranking; dos aparatos (el segundo con mascota de otra cuenta: no se mezcla), salir, modo profe. **No probado:** Google real, voz real (ni del aparato ni en línea), instalación real en Android/iOS.

## Pendiente / ideas
- Comprobar en GitHub Pages con `?diag` y con alumnos reales (voz en línea en la red del cole).
- Si la voz en línea está bloqueada en el cole, grabar MP3 cortos (números 1–10, «más», «menos», frases) y servirlos desde el repo.
- Ajustar niveles/criterios tras verlo con los niños (valores en `LV_MAX`, `LV_RATE`, regla `errs<=2`).
