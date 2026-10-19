# ss — Editor web para Google Sheets

> Repositorio `ss` · rama de trabajo `servisofts`

Aplicación web estática que permite **ver y editar una hoja de cálculo de Google Sheets desde una página propia**, sin que la persona usuaria tenga que iniciar sesión con una cuenta de Google. El frontend es un único archivo HTML con JavaScript nativo; el backend es un script de **Google Apps Script** publicado como aplicación web, que actúa como API JSON sobre la hoja.

![Vista principal](presentacion/01-vista-principal.png)

---

## 1. Objetivo y problema que resuelve

Editar una hoja de Google Sheets normalmente exige una cuenta de Google con permisos sobre el archivo, y la versión "publicada en la web" de una hoja es solo de lectura. La primera versión de este repositorio (commit `b45a00e`) incrustaba precisamente esa vista de solo lectura en un `iframe`.

Este proyecto reemplaza ese enfoque por una interfaz propia que:

- lee **todas las pestañas** de la hoja a través de una API en Apps Script;
- permite **editar celdas** y guardar solo los cambios realizados;
- controla el acceso con un **token compartido** en lugar de cuentas de Google.

## 2. Características principales

Verificadas en el código (`index.html`, `apps-script.gs`):

- Carga de todas las pestañas de la hoja con sus valores (`getDisplayValues`).
- Navegación por pestañas en la parte inferior, al estilo de Google Sheets.
- Cuadrícula editable con encabezados de columna (A, B, C…) y números de fila fijos al hacer scroll.
- Tamaño mínimo visible configurable (30 filas × 8 columnas por defecto).
- Barra de fórmula: muestra la referencia de la celda activa (p. ej. `C7`) y permite editar su contenido.
- Resaltado de la celda activa y de su fila/columna.
- Seguimiento de cambios pendientes: celdas modificadas en amarillo, contador en el botón **Guardar** e indicador en las pestañas con cambios.
- Guardado **incremental**: solo se envían las celdas modificadas, agrupadas por pestaña.
- Botones para añadir filas y columnas visibles.
- Atajos de teclado: `Ctrl/Cmd + S` (guardar), `Enter` y flechas (moverse entre celdas), `Esc` (cerrar ventana del token).
- Ventana modal para introducir el token; se guarda en `localStorage` del navegador.
- Indicador de estado de conexión, pantalla de carga y avisos (toast) de éxito/error.
- Aviso al cerrar la página si hay cambios sin guardar.
- Tema claro/oscuro automático (`prefers-color-scheme`) y ajustes para pantallas de hasta 640 px.

## 3. Arquitectura

```
┌──────────────────────────┐   GET  ?token=…                  ┌───────────────────────────┐        ┌──────────────────┐
│  index.html (navegador)  │ ───────────────────────────────▶ │ Google Apps Script        │ ─────▶ │  Google Sheets   │
│  HTML + CSS + JS nativo  │   POST {token, hoja, cambios}    │ (aplicación web /exec)    │        │  (hoja vinculada)│
│  token en localStorage   │ ◀─────────────────────────────── │ doGet / doPost → JSON     │ ◀───── │                  │
└──────────────────────────┘          JSON                    └───────────────────────────┘        └──────────────────┘
```

- **Frontend:** página estática sin framework ni proceso de compilación. Se comunica con la API mediante `fetch`.
- **Backend:** Google Apps Script vinculado a la hoja (`SpreadsheetApp.getActive()`), implementado como aplicación web que se ejecuta con la identidad del propietario y es accesible para "Cualquiera".
- **Persistencia:** la propia hoja de Google Sheets.

**Decisión técnica relevante:** las peticiones `POST` se envían con `Content-Type: text/plain;charset=utf-8`. Así el navegador no realiza la petición *preflight* de CORS (`OPTIONS`), que las aplicaciones web de Apps Script no responden. El cuerpo sigue siendo JSON y se interpreta con `JSON.parse` en el servidor.

## 4. Estructura del proyecto

```
ss/
├── index.html          # Frontend completo: estilos, marcado y lógica (≈780 líneas)
├── apps-script.gs      # Backend: código para pegar en Extensiones → Apps Script
├── presentacion/       # Capturas de la aplicación en funcionamiento
├── README.md
├── version-portafolio.md
└── LICENSE             # MIT
```

Organización interna de `index.html` (secciones comentadas en el código):

| Sección | Responsabilidad |
|---|---|
| `<style>` | Tokens de color claro/oscuro, barra superior, barra de fórmula, tabla, pestañas, avisos, modal, responsive |
| `CONFIGURACIÓN` | `URL_API`, `FILAS_MINIMAS`, `COLUMNAS_MINIMAS` |
| `ESTADO` | `hojas`, `hojaActual`, `cambios` (pendientes por pestaña), `inputs`, `seleccion` |
| `UTILIDADES` | Conversión índice → letra de columna, contador de cambios, avisos, indicador de conexión |
| `TOKEN` | Lectura/escritura en `localStorage` (clave `tokenHoja`) y modal de acceso |
| `DIBUJAR` | Render de pestañas y de la cuadrícula |
| `EDITAR Y MOVERSE` | Registro de cambios, selección de celda, navegación con teclado, barra de fórmula |
| `CARGAR Y GUARDAR` | Llamadas `GET` y `POST` a la API |
| `BOTONES Y ATAJOS` | Eventos de botones, `Ctrl+S`, `Esc`, aviso `beforeunload` |

**Punto de entrada:** `index.html`, que llama a `cargar()` al terminar de cargar el script.

## 5. Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | HTML5, CSS3 (custom properties, `position: sticky`, `color-mix`, `backdrop-filter`), JavaScript ES2017+ (`async/await`, `fetch`) | Sin versión fija (nativo del navegador) |
| Tipografía | Inter vía Google Fonts | Pesos 400–700 |
| Backend | Google Apps Script (`SpreadsheetApp`, `ContentService`) | Runtime gestionado por Google; sin manifiesto `appsscript.json` en el repositorio |
| Datos | Google Sheets | — |
| Hosting previsto | GitHub Pages | — |

No hay `package.json`, dependencias npm, bundler, framework ni suite de pruebas en el repositorio.

## 6. Módulos y funcionalidades

### Lectura
`cargar()` llama a `GET URL_API?token=…`. Si la respuesta es válida, guarda las pestañas en `hojas`, reinicia los cambios pendientes y dibuja la interfaz. Si el token es inválido, abre la ventana de acceso. Si la respuesta no incluye `hojas`, avisa de que el Apps Script no está actualizado.

### Edición
Cada `input` de la cuadrícula registra su valor en `cambios[nombreHoja]["fila,columna"]` (índices desde 1). Las celdas con cambios pendientes conservan su valor aunque se cambie de pestaña y se vuelva.

### Guardado
`guardar()` envía un `POST` por cada pestaña con cambios. Tras cada respuesta correcta, incorpora los valores a los datos locales y limpia los pendientes de esa pestaña. Al terminar muestra un aviso con el número de celdas guardadas.

### Acceso
El token no está en el código del frontend: se pide en una ventana modal y se guarda en `localStorage` del navegador de cada persona.

![Edición con cambios pendientes](presentacion/02-funcionalidad-principal.png)

## 7. Base de datos

No hay motor de base de datos ni migraciones. La persistencia es una **hoja de cálculo de Google Sheets**:

- Cada **pestaña** se expone como `{ nombre, valores }`.
- `valores` es una matriz bidimensional de cadenas con el rango de datos usado (`getDataRange().getDisplayValues()`).
- No hay esquema fijo: columnas y filas son libres, sin tipos ni relaciones.

## 8. Backend y API

Archivo: `apps-script.gs`. Base: URL de la aplicación web (`https://script.google.com/macros/s/<ID>/exec`).

### `GET /exec?token=<token>`
Devuelve todas las pestañas.

```json
{ "ok": true, "hojas": [ { "nombre": "Hoja 1", "valores": [["A1", "B1"], ["A2", "B2"]] } ] }
```

### `POST /exec`
Cuerpo (enviado como `text/plain`, contenido JSON):

```json
{ "token": "…", "hoja": "Hoja 1", "cambios": [ { "fila": 1, "columna": 1, "valor": "Hola" } ] }
```

Respuesta: `{ "ok": true, "guardados": 1 }`. Cada cambio se escribe con `getRange(fila, columna).setValue(valor)`.

### Errores

| Situación | Respuesta |
|---|---|
| Token ausente o distinto | `{ "ok": false, "error": "token inválido" }` |
| Pestaña inexistente (POST) | `{ "ok": false, "error": "no existe la hoja \"…\"" }` |

### Validaciones y autorización
- Única validación de acceso: comparación estricta del token con la constante `TOKEN`.
- No hay roles ni permisos diferenciados: quien tiene el token puede leer y escribir.
- No se valida el contenido de `cambios` (tipos, rangos o tamaño).

## 9. Configuración e instalación

Requisitos: una cuenta de Google con una hoja de cálculo y un navegador moderno. No hay dependencias que instalar.

### Backend (Apps Script)
1. Abrir la hoja → **Extensiones → Apps Script**.
2. Pegar el contenido de `apps-script.gs` y reemplazar `PON-TU-TOKEN-AQUI` por un token propio, **solo en el editor de Apps Script**.
3. **Implementar → Nueva implementación → Aplicación web**, con *Ejecutar como: Yo* y *Quién tiene acceso: Cualquiera*.
4. Autorizar los permisos y copiar la URL que termina en `/exec`.
5. Para cambios posteriores: **Gestionar implementaciones → Editar → Nueva versión**. La URL se mantiene.

### Frontend
1. En `index.html`, sección `CONFIGURACIÓN`, asignar la URL `/exec` a `URL_API`.
2. Opcional: ajustar `FILAS_MINIMAS` y `COLUMNAS_MINIMAS`.

## 10. Variables de configuración

El proyecto no usa variables de entorno. La configuración son constantes en el código:

| Nombre | Archivo | Descripción | ¿Secreto? |
|---|---|---|---|
| `TOKEN` | `apps-script.gs` (solo en el editor de Apps Script) | Clave compartida de acceso | **Sí**: no debe subirse al repositorio |
| `URL_API` | `index.html` | URL de la aplicación web de Apps Script | No (pública; el acceso lo controla el token) |
| `FILAS_MINIMAS`, `COLUMNAS_MINIMAS` | `index.html` | Tamaño mínimo visible de la cuadrícula | No |
| `tokenHoja` | `localStorage` del navegador | Token introducido por la persona usuaria | Sí (local a cada navegador) |

## 11. Ejecución en desarrollo

Al ser una página estática basta con abrir `index.html` en el navegador. Funciona también desde `file://`, que es como se tomaron las capturas de `presentacion/`. No hay scripts de desarrollo definidos en el repositorio.

## 12. Compilación y despliegue

- No hay paso de compilación.
- **Hosting previsto:** GitHub Pages, sirviendo `index.html` desde la raíz. El repositorio tuvo un archivo `CNAME` (añadido en `a0f321d` y eliminado en `044864f`).
- **Estado verificado (19/10/2026):** `https://alvarosiles.github.io/ss/` responde 404. La rama `main` solo contiene el commit inicial y el trabajo está en `servisofts`, así que el despliegue en GitHub Pages **no está confirmado**.
- **Backend:** desplegado como aplicación web de Apps Script y respondiendo correctamente en la fecha indicada.

## 13. Seguridad y consideraciones

- **Token compartido:** cualquier persona con la URL `/exec` y el token tiene lectura y escritura completas sobre todas las pestañas.
- **El token no debe estar en el repositorio.** `apps-script.gs` lleva un marcador y un aviso explícito. Un valor de token anterior quedó en el historial de git (commit `17c3fde`): ese valor debe considerarse comprometido y no reutilizarse.
- **Ejecución como propietario:** el script actúa con los permisos de la cuenta que lo implementó.
- **Token en `localStorage`:** accesible para cualquier script que se ejecute en el mismo origen.
- **XSS:** los valores de las celdas se asignan con `input.value` y `textContent`, no como HTML.
- **Contraste de token** en el servidor por igualdad simple, sin límite de intentos.

## 14. Limitaciones identificadas

- **Sin control de concurrencia:** si dos personas editan la misma celda, prevalece la última escritura y no se detectan conflictos.
- **Valores, no fórmulas:** se leen valores formateados (`getDisplayValues`). Al editar una celda con fórmula, la fórmula se sustituye por el valor escrito. Las celdas no editadas no se tocan.
- **Todo se guarda como texto** desde la interfaz; Google Sheets interpreta el tipo al recibirlo.
- **Escritura celda a celda** (`setValue` por cambio): ineficiente con muchos cambios y sujeta a las cuotas de Apps Script.
- **Carga completa:** cada lectura trae todas las pestañas enteras; no hay paginación.
- **Operaciones no soportadas:** eliminar filas o columnas, crear o renombrar pestañas, formatos, ordenar o filtrar.
- **Las filas y columnas añadidas** desde la interfaz son solo visuales hasta que se escribe en ellas.
- **Sin pruebas automatizadas** ni manifiesto `appsscript.json` versionado.
- **Dependencia de servicios externos:** Google Apps Script, Google Sheets y Google Fonts.

## Licencia

MIT — ver [LICENSE](LICENSE).
