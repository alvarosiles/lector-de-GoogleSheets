# Changelog

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto usa [versionado semántico](https://semver.org/lang/es/).

## 1.0.0 — 2026-10-19

### Añadido
- **Backend en Google Apps Script** (`apps-script.gs`), con API JSON:
  - `GET` con lectura de todas las pestañas;
  - `POST` con escritura incremental por celda;
  - control de acceso por token.
- **Editor web** (`index.html`) con interfaz tipo hoja de cálculo:
  - cuadrícula con encabezados fijos y pestañas inferiores;
  - barra de fórmula y navegación con teclado;
  - seguimiento de cambios pendientes y guardado con `Ctrl+S`.
- Ventana modal de acceso por token, con persistencia en `localStorage`.
- Indicador de conexión, pantalla de carga, avisos y aviso de cambios sin guardar.
- Tema claro y oscuro automático y diseño adaptable.
- Documentación: `README.md`, `version-portafolio.md`, `SECURITY.md`, `PRIVACY.md`, `TERMS.md` y este `CHANGELOG.md`.
- Capturas de la aplicación en `presentacion/`.

### Cambiado
- Se reemplazó la vista de solo lectura incrustada (`iframe`) por el editor propio.
- El aviso de copyright de `LICENSE` pasa a mostrar el nombre completo del autor.

### Seguridad
- El token de acceso se retiró del código del repositorio: se pide en tiempo de ejecución y vive solo en el editor de Apps Script y en el navegador de cada persona usuaria.

### Eliminado
- Archivo `CNAME` de dominio personalizado.

## 0.1.0 — 2026-02-08

### Añadido
- Versión inicial: `index.html` que incrusta la versión publicada en la web de la hoja de Google Sheets (solo lectura).
- Licencia MIT.
- Archivo `CNAME` para dominio personalizado.
