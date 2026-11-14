# La casa de Pinchín · guía de puesta en marcha

## 1. Publicar la app (5 minutos)

1. En GitHub, crea un repositorio nuevo **público** llamado `Pinchin`.
2. Sube **todo** lo que hay en la carpeta `subir-a-GitHub` (6 archivos: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`), todos en la raíz del repositorio.
3. Settings → Pages → *Branch*: `main` / `(root)` → Save. Espera 1–2 minutos.
4. Abre **https://manuelvs8.github.io/Pinchin/?diag** y comprueba que todo sale en verde (manifest, los 3 iconos con su tamaño real, `sw.js`, service worker). Si algo sale en rojo, falta subir ese archivo.
5. Abre **https://manuelvs8.github.io/Pinchin/** y juega. **Sin hacer nada más ya funciona** en modo local (sin cuenta, sin ranking).

Instalar: en Chrome aparece el botón «📲 Instalar» (en la pantalla de inicio de la app o en ⚙️ Ajustes), que abre el diálogo nativo. En iPhone/iPad, Ajustes muestra cómo hacerlo con Safari.

## 2. Activar las clases, la nube y el ranking (opcional)

1. Crea una **hoja de cálculo nueva** en Google Drive (no uses la de Lumi).
2. Extensiones → Apps Script → borra lo que haya, pega `Codigo.gs` y guarda.
3. Implementar → Nueva implementación → tipo **Aplicación web** → Ejecutar como: **Yo** · Quién tiene acceso: **Cualquier usuario** → Implementar → autoriza los permisos → copia la URL que termina en `/exec`.
4. La URL de tu script **ya está puesta** en `index.html`. Solo si algún día haces una implementación nueva con otra URL, cámbiala en la línea `const CLOUD_URL='…';` y vuelve a subir `index.html`.
5. Recarga la hoja → menú **🦔 Pinchín → Preparar hoja**. Se crean las pestañas **Clases** y **Alumnado**.
6. En **Clases**, escribe una fila por clase: nombre de la clase, **una fruta distinta** (🍎 🍌 🍇 🍊 🍓 🍉 🍐 🍍 🥝 🍋) y `sí` en *activa*. Vienen dos de ejemplo (1º A 🍇, 1º B 🍎): cámbialas.
7. Vuelve a abrir `?diag`: «Servidor (Apps Script)» debe salir ✅.

### Si al entrar dice que no se puede conectar con la hoja
1. Abre la URL del script (la que termina en `/exec`) en una **ventana de incógnito**. Debe salir un texto que empiece por `{"ok":true,"msg":"La casa de Pinchín · servicio activo","hoja":…,"clases":[…]}`.
   - Si te pide iniciar sesión o sale «No tienes permiso»: Implementar → Administrar implementaciones → ✏️ → **Quién tiene acceso: Cualquier usuario** (no «cualquier usuario con cuenta de Google»).
   - Si sale «No se ha encontrado la función doGet» o un error: el código no está publicado. Pega el `Codigo.gs`, guarda y publica una **Nueva versión** (paso de abajo).
   - Si sale `"ok":false` con un mensaje, ese mensaje dice qué falta (por ejemplo, que el script no está creado desde la hoja, o que falta la pestaña Clases).
   - Si sale `{"ok":true,"msg":…}` **sin** `"hoja"`, el script publicado es el antiguo: publica una Nueva versión.
2. `…/Pinchin/?diag` hace las mismas comprobaciones desde la app (abrir y entrar).

Si cambias `Codigo.gs` más adelante: Implementar → **Administrar implementaciones** → ✏️ → Versión: **Nueva versión** → Implementar (la URL no cambia).

### Cómo entra un niño
1. En la pantalla de inicio, «☁️ Entrar con mi clase» (o en ⚙️ Ajustes).
2. «Elige la combinación»: toca **tres veces la fruta de su clase** (por ejemplo 🍇🍇🍇) y ✔. No se explica en la pantalla; se lo dices tú.
3. Sale la lista de su clase: toca su nombre. Si es nuevo, «➕ Soy nuevo» y escribe **solo el nombre** (lo normal es que lo escribas tú). Si ya existe, propone «Ana 2», «Ana 🦊»…
4. Solo hay que hacerlo una vez por aparato. En Chromebooks compartidos, al acabar: ⚙️ → **Salir** (guarda y deja el aparato limpio).

**Aviso de seguridad:** la combinación es de la clase, no personal. Un compañero podría entrar con el nombre de otro. Para 4–6 años y un juego es aceptable, pero no es una contraseña. Tras 5 combinaciones mal se bloquea 1 minuto en el aparato, y el servidor bloquea 10 minutos tras 8 fallos.

### Modo profe
Entra con tu nombre en cualquier clase (o crea una clase «Profes» con su fruta) y escribe `todo` en la **columna J** de tu fila. Al sincronizar aparece **🔋 Rellenar todo**, que lo desbloquea todo, rellena las barras y da 999999 🪙. Las cuentas con `todo` salen en el ranking solo para otros profes. **No lo pongas a alumnos**: quien abre el estadio ya recibe un 🔋 Rellenar todo que solo rellena barras y monedas.

### Hoja «Alumnado»
A nombre · B clase · C alta · D última vez · E monedas · F nivel · G medallas (de 18) · H y I ocultas (no tocar) · J modo (profe) · K semana · L–O mejores tiempos (⚽/🏀, F+N = frutas y números, N = números) · P–S mejores tiempos de la semana. Los tiempos están en segundos.
Para borrar a un niño, borra su fila. Menú 🦔 Pinchín → «Revisar nombres repetidos».

### Uso de Google (cuota gratuita)
Cada niño conectado hace 1 llamada al entrar, 1 al acabar cada partida y como mucho 1 cada 45 s si hay cambios. Una clase de 25 durante 45 minutos ≈ 1.500–2.500 llamadas. El límite gratuito es de unas 20.000 al día y 30 a la vez: con una clase cada vez sobra. Si coinciden muchas, la app reintenta sola con espera al azar.

## 3. Voz
La voz viene **desactivada**: la app no habla sola. El botón **🔊** de cada juego lee la consigna siempre que el niño lo pulse. Para que lo lea todo automáticamente: ⚙️ Ajustes → Voz → «Automática» (o «Del aparato» / «En línea»), con botón para probarla.
Usa la voz en español del aparato; si no tiene (pasa en muchos Chromebook), usa una **voz en línea** (la de Google Traductor, hace falta internet). Si la red del cole bloquea `translate.google.com`, la voz en línea no sonará: compruébalo con «🌐 Probar voz en línea» de `?diag`.

## 4. Versión de pruebas (opcional)
`demo.html` (carpeta `opcional`) es una copia con todo desbloqueado y monedas infinitas para revisar la app. Guarda aparte, no se instala y no usa la hoja. Si la subes junto a `index.html`, se abre en `…/Pinchin/demo.html`; bórrala cuando no la necesites.

## 5. Notas
- Lumi y Pinchín comparten dominio (`manuelvs8.github.io`) pero no se mezclan: claves, hojas y cuentas distintas. Lo único compartido es la caché sin conexión: si Lumi se actualiza, Pinchín puede perder su copia offline (con internet no se nota).
- Las actualizaciones llegan solas: sube `index.html` con un número de versión mayor en `<meta name="app-version">`.
