# Política de privacidad

**Proyecto:** ss — Editor web para Google Sheets
**Responsable:** Alvaro Siles Estrada
**Vigente desde:** 19 de octubre de 2026

Esta política describe qué datos trata la aplicación, dónde se almacenan y con qué terceros se comunican. Se basa en el funcionamiento real del código de este repositorio.

## 1. Resumen

- La aplicación **no tiene servidor ni base de datos propios**.
- **No usa cookies, analítica, publicidad ni rastreadores.**
- Los datos que se editan se guardan **únicamente en la hoja de Google Sheets** de quien despliega la aplicación.
- El token de acceso se guarda **solo en el navegador** de cada persona usuaria.

## 2. Datos que se tratan

| Dato | Dónde se almacena | Finalidad |
|---|---|---|
| Contenido de la hoja de cálculo (valores de las celdas y nombres de las pestañas) | En la hoja de Google Sheets del propietario de la implementación | Mostrar y editar la información |
| Token de acceso | En el `localStorage` del navegador (clave `tokenHoja`) | Evitar pedir el token en cada visita |
| Cambios pendientes de guardar | En la memoria de la página mientras está abierta | Permitir revisar los cambios antes de guardarlos |

La aplicación no solicita nombre, correo electrónico ni ningún otro dato personal. Si alguien introduce datos personales en la hoja, esos datos quedan bajo la responsabilidad del propietario de la hoja.

## 3. Terceros

Al usar la aplicación, el navegador se comunica con estos servicios de Google:

| Servicio | Motivo | Datos implicados |
|---|---|---|
| **Google Apps Script** (`script.google.com`) | API de lectura y escritura | Token y contenido de las celdas leídas o modificadas |
| **Google Sheets** | Almacenamiento de los datos | Contenido de la hoja |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | Tipografía de la interfaz | Datos técnicos de la petición (como la dirección IP y el navegador) |

Estos servicios se rigen por la [Política de Privacidad de Google](https://policies.google.com/privacy). El hosting estático de la página (por ejemplo, GitHub Pages) puede registrar datos técnicos de acceso según su propia política.

## 4. Conservación y eliminación

- **Datos de la hoja:** permanecen en Google Sheets hasta que el propietario los modifique o elimine.
- **Token:** permanece en el navegador hasta que se cambie con el botón 🔑 o se borren los datos del sitio en el navegador.
- **Cambios no guardados:** se descartan al cerrar o recargar la página.

## 5. Responsabilidades de quien despliega la aplicación

Quien implementa su propia copia (backend en Apps Script y frontend en su hosting) actúa como responsable de los datos de su hoja. Debe:

- informar a sus usuarios sobre el tratamiento de los datos que introduzcan;
- custodiar el token y compartirlo solo con personas autorizadas;
- cumplir la normativa de protección de datos que le sea aplicable.

## 6. Seguridad

Las medidas de seguridad y las limitaciones conocidas están descritas en [SECURITY.md](SECURITY.md).

## 7. Cambios en esta política

Cualquier modificación se publicará en este archivo y quedará reflejada en el [historial de cambios](CHANGELOG.md).

## 8. Contacto

Para consultas sobre privacidad: [github.com/alvarosiles](https://github.com/alvarosiles).
