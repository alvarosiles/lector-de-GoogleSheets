# Editor web para Google Sheets

**Autor:** Alvaro Siles Estrada — Ingeniero de Sistemas · Full Stack Developer · 15 años de experiencia
**Licencia:** MIT · **Estado:** prototipo funcional

---

## Descripción breve (tarjeta)

Aplicación web para editar hojas de Google Sheets desde una interfaz propia, sin iniciar sesión con Google. Arquitectura serverless con frontend en JavaScript nativo y una API JSON en Google Apps Script protegida por token.

**Etiquetas:** JavaScript · HTML5 · CSS3 · Google Apps Script · Google Sheets · API REST · Serverless · UX

---

## Descripción completa

El sistema convierte una hoja de Google Sheets en una aplicación de edición web. Un script de Google Apps Script vinculado a la hoja se publica como aplicación web y ofrece dos operaciones protegidas por token: **leer todas las pestañas** y **guardar las celdas modificadas**.

El frontend es un único archivo HTML, sin dependencias ni compilación, que reproduce la experiencia de una hoja de cálculo profesional:

- cuadrícula con encabezados fijos;
- pestañas inferiores;
- barra de fórmula;
- navegación con teclado;
- seguimiento visual de los cambios antes de guardarlos.

## Problema que resuelve

Para editar una hoja de Google Sheets hace falta una cuenta de Google con permisos sobre el archivo, y la opción "Publicar en la web" solo permite lectura. Esta solución habilita lectura **y escritura** desde una página propia, con un control de acceso simple, sin administrar cuentas ni permisos de Google por persona y sin mantener un servidor.

## Objetivo

Usar Google Sheets como almacenamiento ligero y editable desde la web, con una interfaz a medida y coste de infraestructura nulo.

## Público objetivo

Equipos pequeños, emprendimientos y profesionales que ya trabajan con Google Sheets y necesitan una página sencilla para consultar y actualizar datos sin dar acceso directo al archivo.

## Mi participación técnica

Diseño y desarrollo integral del proyecto:

- **Arquitectura:** definición del modelo serverless (página estática + Apps Script + Google Sheets) y del contrato de la API.
- **Backend:** API JSON en Google Apps Script con lectura multipestaña, escritura incremental y control de acceso por token.
- **Frontend:** interfaz tipo hoja de cálculo en JavaScript nativo, gestión del estado de edición, navegación con teclado y diseño visual con tema claro y oscuro.
- **Seguridad y despliegue:** gestión del secreto fuera del código, configuración de la aplicación web de Apps Script y documentación técnica y legal.

## Funcionalidades destacadas

- **Lectura multipestaña** en una sola petición.
- **Edición tipo hoja de cálculo:** encabezados de fila y columna fijos, celda activa resaltada y barra de fórmula con su referencia (`C7`).
- **Cambios pendientes visibles:** celdas en amarillo, contador en **Guardar** e indicador por pestaña.
- **Guardado incremental:** solo se envían las celdas modificadas, sin pisar fórmulas ni datos no editados.
- **Productividad con teclado:** `Ctrl+S`, `Enter` y flechas.
- **Acceso por token** mediante una ventana modal; el token nunca está en el código fuente.
- **Experiencia cuidada:** indicador de conexión, pantalla de carga, avisos, tema claro y oscuro automático y diseño adaptable.
- **Prevención de pérdida de datos:** aviso al cerrar con cambios sin guardar.

## Tecnologías utilizadas

| Categoría | Tecnologías |
|---|---|
| Frontend | HTML5, CSS3 (variables CSS, `sticky`, `backdrop-filter`, `color-mix`), JavaScript nativo ES2017+ (`fetch`, `async/await`, `localStorage`) |
| Backend | Google Apps Script (`SpreadsheetApp`, `ContentService`), aplicación web serverless |
| Datos | Google Sheets |
| Diseño | Tipografía Inter, iconos SVG en línea, tema claro y oscuro |
| Infraestructura | Hosting estático (GitHub Pages), implementaciones versionadas de Apps Script |
| Herramientas | Git, GitHub |

## Arquitectura y decisiones técnicas

- **Serverless de coste cero:** página estática + API en Apps Script + Google Sheets como almacenamiento.
- **API JSON mínima y explícita:** `GET` para leer todas las pestañas y `POST` con una lista de cambios `{fila, columna, valor}` por pestaña.
- **CORS resuelto sin proxy:** los `POST` se envían como `text/plain` para evitar el *preflight* que Apps Script no admite, manteniendo el JSON en el cuerpo.
- **Estado de edición en cliente:** los cambios se agrupan por pestaña y celda y se conservan al navegar entre pestañas.
- **Cero dependencias:** sin frameworks ni compilación. El código está organizado en secciones claras (configuración, estado, utilidades, render, edición, comunicación, eventos).
- **Render seguro:** los valores se asignan como texto, nunca como HTML.

## Integraciones

- **Google Apps Script:** aplicación web ejecutada con la identidad del propietario y protegida por token.
- **Google Sheets:** lectura de valores formateados y escritura en la hoja vinculada.
- **Google Fonts:** tipografía Inter.

## Seguridad

- Token validado en el servidor en cada petición.
- El secreto queda fuera del frontend y del repositorio, y se guarda solo en el navegador de cada persona.
- Prevención de XSS en el render de celdas.
- Política de seguridad, privacidad y términos de uso documentados (`SECURITY.md`, `PRIVACY.md`, `TERMS.md`).

## Retos técnicos

- **CORS con Apps Script:** habilitar escrituras desde el navegador sin servidor intermedio.
- **Integridad de los datos:** pasar de reescribir rangos completos a escribir solo las celdas modificadas.
- **Secretos en un sitio estático y repositorio público:** sacar el token del código y pedirlo en tiempo de ejecución.
- **Ciclo de despliegue de Apps Script:** versionar las implementaciones manteniendo una URL estable.

## Mejoras futuras

- Autenticación por persona y roles.
- Detección de conflictos de edición concurrente.
- Escritura por lotes (`setValues`) para optimizar cuotas.
- Soporte de fórmulas, formatos y gestión de filas y pestañas.
- Paginación para hojas grandes, auditoría de cambios y pruebas automatizadas.

## Estado del proyecto

- **Backend:** desplegado y operativo; lectura y escritura verificadas.
- **Frontend:** funcional y conectado a la hoja real (ver capturas).
- **Publicación web:** preparada para hosting estático; la publicación en GitHub Pages está pendiente.

## Capturas

Capturas de la aplicación real en funcionamiento (1440 × 900, escala 2×).

1. **Vista principal** — `01-vista-principal.png`
   Hoja cargada desde Google Sheets: estado "Conectado · 2 hojas", barra de fórmula, cuadrícula y pestañas.
   ![Vista principal](01-vista-principal.png)

2. **Funcionalidad principal: edición** — `02-funcionalidad-principal.png`
   Edición en curso con datos de demostración: celdas modificadas resaltadas, 12 cambios pendientes en **Guardar**, indicador en la pestaña y barra de fórmula en `C7`.
   ![Edición](02-funcionalidad-principal.png)

3. **Funcionalidad complementaria: acceso por token** — `03-funcionalidad-complementaria.png`
   Primer ingreso: ventana modal de acceso y estado "Sin token".
   ![Acceso por token](03-funcionalidad-complementaria.png)
