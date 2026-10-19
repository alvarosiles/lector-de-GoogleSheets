// =============================================================
//  Código para pegar en Google Sheets → Extensiones → Apps Script
//  Después: Implementar → Gestionar implementaciones → ✏️ →
//           Versión: Nueva versión → Implementar
// =============================================================

// Clave para poder leer y escribir. Debe ser la misma que pones en la página (botón 🔑).
// ⚠️ Cámbiala SOLO en el editor de Apps Script, nunca aquí: este repo es público.
const TOKEN = 'PON-TU-TOKEN-AQUI';


// LEER: devuelve todas las pestañas con sus datos.
// Uso: GET  .../exec?token=TU_TOKEN
function doGet(e) {
  if (e.parameter.token !== TOKEN) return responder({ ok: false, error: 'token inválido' });

  const hojas = SpreadsheetApp.getActive().getSheets().map(hoja => ({
    nombre: hoja.getName(),
    valores: hoja.getDataRange().getDisplayValues()
  }));

  return responder({ ok: true, hojas: hojas });
}


// GUARDAR: escribe solo las celdas que cambiaron.
// Uso: POST .../exec  con el cuerpo:
//   { "token": "...", "hoja": "Hoja 1",
//     "cambios": [ { "fila": 1, "columna": 1, "valor": "Hola" } ] }
//   (fila y columna empiezan en 1: fila 1, columna 1 = celda A1)
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


// Convierte un objeto en respuesta JSON.
function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}
