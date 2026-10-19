# Editor web para Google Sheets

**Repositorio:** `ss` · **Licencia:** MIT · **Estado:** prototipo funcional

---

## Descripción breve (tarjeta)

Aplicación web que permite editar una hoja de Google Sheets desde una interfaz propia, sin iniciar sesión con Google. Usa un frontend en HTML/CSS/JavaScript nativo y un backend serverless en Google Apps Script que expone la hoja como API JSON.

**Etiquetas:** JavaScript · HTML5 · CSS3 · Google Apps Script · Google Sheets · API REST · Serverless · GitHub Pages

---

## Descripción completa

El sistema convierte una hoja de Google Sheets en una pequeña aplicación de edición web. Un script de Google Apps Script vinculado a la hoja se publica como aplicación web y ofrece dos operaciones: leer todas las pestañas y guardar celdas modificadas. Un token compartido protege ambas.

El frontend, un único archivo HTML sin dependencias ni proceso de compilación, reproduce la experiencia de una hoja de cálculo:

- cuadrícula con encabezados fijos;
- pestañas inferiores;
- barra de fórmula;
- navegación con teclado;
- seguimiento visual de los cambios pendientes antes de guardarlos.

## Problema que resuelve

Para editar una hoja de Google Sheets hace falta una cuenta de Google con permisos sobre el archivo, y la opción "Publicar en la web" solo ofrece lectura. La primera versión del proyecto incrustaba esa vista de solo lectura en un `iframe`. Esta solución permite leer **y escribir** desde una página propia y controlar el acceso con un token, sin gestionar cuentas ni permisos de Google para cada persona.

## Objetivo

Usar Google Sheets como almacenamiento de datos ligero y editable desde la web, con una interfaz propia, sin servidor dedicado ni base de datos tradicional.

## Público objetivo

Equipos pequeños o personas que ya trabajan con Google Sheets y necesitan una página web sencilla para consultar y actualizar datos, sin dar acceso directo al archivo ni exigir cuentas de Google.

## Mi participación técnica

- **Confirmado por el historial de git:** todos los commits del repositorio pertenecen a la cuenta del autor (Alvaro Siles).
- **Pendiente de confirmar:** el reparto concreto de responsabilidades (diseño, desarrollo del frontend, desarrollo del backend, despliegue). El historial no lo detalla.

## Funcionalidades destacadas

- **Lectura multipestaña:** carga todas las pestañas de la hoja en una sola petición.
- **Edición tipo hoja de cálculo:** cuadrícula con encabezados de fila y columna fijos, celda activa resaltada y barra de fórmula con su referencia (p. ej. `C7`).
- **Cambios pendientes visibles:** celdas modificadas en amarillo, contador en el botón **Guardar** e indicador en las pestañas con cambios sin guardar.
- **Guardado incremental:** solo se envían las celdas modificadas, de modo que no se sobrescriben fórmulas ni datos no editados.
- **Productividad con teclado:** `Ctrl+S` para guardar y `Enter`/flechas para moverse entre celdas.
- **Acceso por token:** se introduce en una ventana modal y no se escribe en el código fuente.
- **Experiencia cuidada:** indicador de conexión, pantalla de carga, avisos de éxito o error, tema claro/oscuro automático y diseño adaptable.
- **Protección ante pérdida de datos:** aviso al recargar o cerrar con cambios sin guardar.

## Tecnologías utilizadas

| Categoría | Tecnologías |
|---|---|
| Frontend | HTML5, CSS3 (variables CSS, `sticky`, `backdrop-filter`, `color-mix`), JavaScript nativo (ES2017+, `fetch`, `async/await`, `localStorage`) |
| Backend | Google Apps Script (`SpreadsheetApp`, `ContentService`) como aplicación web serverless |
| Datos | Google Sheets |
| Diseño | Tipografía Inter (Google Fonts), iconos SVG en línea, tema claro/oscuro |
| Infraestructura | GitHub Pages (hosting previsto), despliegue de aplicaciones web de Google Apps Script |
| Control de versiones | Git, GitHub |

## Arquitectura y características técnicas

- **Arquitectura cliente-servidor sin servidor propio:** página estática + API serverless en Apps Script + Google Sheets como almacenamiento.
- **API JSON mínima:** `GET` para leer todas las pestañas y `POST` con una lista de cambios `{fila, columna, valor}` por pestaña.
- **Solución a CORS:** los `POST` se envían como `text/plain` para evitar el *preflight*, que Apps Script no admite, manteniendo el JSON en el cuerpo.
- **Estado de edición en cliente:** los cambios se agrupan por pestaña y por celda antes de enviarse, y se conservan al cambiar de pestaña.
- **Cero dependencias:** sin frameworks, sin npm y sin compilación. El frontend completo vive en un solo archivo organizado en secciones (configuración, estado, utilidades, render, edición, comunicación, eventos).
- **Render seguro:** los valores de las celdas se asignan como texto (`value`, `textContent`), no como HTML.

## Integraciones

- **Google Apps Script:** aplicación web ejecutada con la identidad del propietario y accesible públicamente, protegida por token.
- **Google Sheets:** lectura de valores formateados y escritura celda a celda en la hoja vinculada al script.
- **Google Fonts:** carga de la tipografía Inter.

## Seguridad

- Acceso controlado por token compartido, validado en el servidor en cada petición.
- El token no se incluye en el frontend ni en el repositorio: el archivo del backend lleva un marcador con un aviso explícito.
- El token se guarda localmente en el navegador de cada persona (`localStorage`).
- **Limitación reconocida:** no hay roles ni permisos por persona; quien conoce el token tiene acceso completo de lectura y escritura.

## Retos técnicos identificados

- **CORS con Apps Script:** resolver la falta de soporte de *preflight* sin un servidor intermedio.
- **Evitar pisar datos:** pasar de reescribir rangos completos a guardar solo las celdas modificadas, para no sobrescribir fórmulas ni contenido no editado.
- **Gestión del secreto en un sitio estático y repositorio público:** sacar el token del código y pedirlo en tiempo de ejecución.
- **Ciclo de despliegue de Apps Script:** cada cambio de código exige publicar una nueva versión de la implementación para que la URL `/exec` lo use.

## Mejoras futuras recomendadas

- Autenticación por persona (por ejemplo, tokens individuales o Google Sign-In) con roles de lectura y escritura.
- Detección de conflictos de edición concurrente, por ejemplo comparando el valor original antes de escribir.
- Escritura por lotes (`setValues` sobre rangos) para reducir llamadas y consumo de cuota.
- Soporte de fórmulas, formatos, eliminación de filas o columnas y gestión de pestañas.
- Paginación o carga bajo demanda para hojas grandes.
- Límite de intentos o rotación del token y registro de cambios (auditoría).
- Pruebas automatizadas y versionado del manifiesto `appsscript.json`.

## Estado real del proyecto

- **Backend:** desplegado y operativo. Lectura verificada el 19/10/2026 y escritura verificada el mismo día durante el desarrollo.
- **Frontend:** funcional en local; las capturas se tomaron de la aplicación real conectada a la hoja.
- **Publicación web:** pendiente. GitHub Pages no respondía en la fecha de verificación (404) y el dominio personalizado fue retirado del repositorio.
- **Calidad:** sin pruebas automatizadas.

## Capturas

Capturas de la aplicación real en funcionamiento (1440 × 900, escala 2×), conectada a la hoja de Google Sheets del proyecto.

1. **Vista principal** — `01-vista-principal.png`
   Hoja cargada desde Google Sheets: indicador "Conectado · 2 hojas", barra de fórmula con la celda activa, cuadrícula y pestañas inferiores.
   ![Vista principal](01-vista-principal.png)

2. **Funcionalidad principal: edición** — `02-funcionalidad-principal.png`
   Edición en curso con datos de demostración escritos en la interfaz (**sin guardar**): celdas modificadas resaltadas, contador de 12 cambios pendientes en **Guardar**, indicador en la pestaña y barra de fórmula mostrando la celda `C7`.
   ![Edición](02-funcionalidad-principal.png)

3. **Funcionalidad complementaria: acceso por token** — `03-funcionalidad-complementaria.png`
   Primer ingreso sin token: ventana modal de acceso sobre la interfaz desenfocada y estado de conexión "Sin token".
   ![Acceso por token](03-funcionalidad-complementaria.png)

> Nota: los datos que aparecen en la hoja (por ejemplo, "aaaaaaa dd") son contenido de prueba existente; la tabla Producto/Cantidad/Precio de la captura 2 es de demostración y no se guardó.
