/**
 * =============================================================
 *  ss — Editor web para Google Sheets · Backend (Google Apps Script)
 * =============================================================
 *  Autor:    Alvaro Siles Estrada — Ingeniero de Sistemas · Full Stack Developer
 *  Licencia: MIT (ver LICENSE)
 *
 *  API JSON sobre la hoja de cálculo vinculada a este script.
 *    GET  /exec?token=…               → lee todas las pestañas
 *    POST /exec  { token, hoja, cambios } → escribe las celdas modificadas
 *
 *  Instalación:
 *    1. Google Sheets → Extensiones → Apps Script → pegar este archivo.
 *    2. Reemplazar TOKEN por una clave propia (solo en el editor de Apps Script).
 *    3. Implementar → Nueva implementación → Aplicación web
 *       (Ejecutar como: Yo · Quién tiene acceso: Cualquiera).
 *    4. Para publicar cambios: Gestionar implementaciones → ✏️ → Nueva versión.
 * =============================================================
 */

/**
 * Clave compartida de acceso. Debe coincidir con la que se introduce en la página (botón 🔑).
 * ⚠️ Cámbiala SOLO en el editor de Apps Script, nunca en el repositorio: es público.
 */
const TOKEN = 'PON-TU-TOKEN-AQUI';


/**
 * Lectura: devuelve todas las pestañas con sus valores formateados.
 * Uso: GET .../exec?token=TU_TOKEN
 *
 * @param {GoogleAppsScript.Events.DoGet} e Evento de la petición.
 * @return {GoogleAppsScript.Content.TextOutput} { ok, hojas: [{ nombre, valores }] }
 */
function doGet(e) {
  if (e.parameter.token !== TOKEN) return responder({ ok: false, error: 'token inválido' });

  const hojas = SpreadsheetApp.getActive().getSheets().map(hoja => ({
    nombre: hoja.getName(),
    valores: hoja.getDataRange().getDisplayValues()
  }));

  return responder({ ok: true, hojas: hojas });
}


/**
 * Escritura incremental: guarda solo las celdas que cambiaron.
 * Uso: POST .../exec con el cuerpo:
 *   { "token": "...", "hoja": "Hoja 1",
 *     "cambios": [ { "fila": 1, "columna": 1, "valor": "Hola" } ] }
 *   (fila y columna empiezan en 1: fila 1, columna 1 = celda A1)
 *
 * @param {GoogleAppsScript.Events.DoPost} e Evento de la petición.
 * @return {GoogleAppsScript.Content.TextOutput} { ok, guardados }
 */
function doPost(e) {
  const datos = JSON.parse(e.postData.contents);
  if (datos.token !== TOKEN) return responder({ ok: false, error: 'token inválido' });

  const hoja = SpreadsheetApp.getActive().getSheetByName(datos.hoja);
  if (!hoja) return responder({ ok: false, error: 'no existe la hoja "' + datos.hoja + '"' });

  datos.cambios.forEach(c => {
    hoja.getRange(c.fila, c.columna).setValue(c.valor);
  });

  return responder({ ok: true, guardados: datos.cambios.length });
}


/**
 * Serializa un objeto como respuesta JSON.
 *
 * @param {Object} objeto Datos a devolver.
 * @return {GoogleAppsScript.Content.TextOutput}
 */
function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
