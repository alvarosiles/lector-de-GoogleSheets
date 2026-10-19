# Política de seguridad

**Proyecto:** Editor web para Google Sheets
**Responsable:** Alvaro Siles Estrada

## Versiones soportadas

| Versión | Soporte |
|---|---|
| 1.x | ✅ |
| 0.x | ❌ |

## Reportar una vulnerabilidad

Si encuentras un problema de seguridad, **no abras un issue público**. Repórtalo de forma privada desde la pestaña **Security → Report a vulnerability** del repositorio en GitHub o mediante el perfil [github.com/alvarosiles](https://github.com/alvarosiles).

Incluye, si es posible:

- una descripción del problema y de su impacto;
- los pasos para reproducirlo;
- la versión o el commit afectados.

Se confirmará la recepción del reporte y se informará del avance de la corrección.

## Modelo de seguridad

| Aspecto | Implementación |
|---|---|
| Autenticación | Token compartido enviado en cada petición y comparado en el servidor (`apps-script.gs`) |
| Autorización | Sin roles: un token válido concede lectura y escritura sobre todas las pestañas |
| Ejecución del backend | La aplicación web de Apps Script se ejecuta con la identidad y los permisos del propietario |
| Almacenamiento del token | Constante `TOKEN` en el editor de Apps Script; `localStorage` en el navegador de cada persona usuaria |
| Render de datos | Los valores se asignan como texto (`input.value`, `textContent`), nunca como HTML, para prevenir XSS |
| Transporte | HTTPS (servicios de Google) |

## Buenas prácticas para quien despliega

1. **Nunca subas el token al repositorio.** Mantén `PON-TU-TOKEN-AQUI` en `apps-script.gs` y escribe la clave real solo en el editor de Apps Script.
2. **Usa un token largo y aleatorio**, de 20 caracteres o más, que no sea una palabra ni un nombre.
3. **Rota el token** si se expone o si alguien deja de necesitar acceso: cámbialo en Apps Script y publica una **nueva versión** de la implementación.
4. **Comparte la URL `/exec` y el token solo con personas autorizadas.**
5. **Activa el historial de versiones de Google Sheets** como mecanismo de recuperación.
6. **Revisa periódicamente** los accesos y las implementaciones activas en Apps Script.

## Limitaciones conocidas

- No hay límite de intentos ni bloqueo ante tokens incorrectos.
- No hay permisos diferenciados por persona ni registro de auditoría.
- El token en `localStorage` es accesible para cualquier script que se ejecute en el mismo origen.
- No hay validación del contenido de los cambios (tipos, rangos ni tamaño de la petición).

Estas mejoras figuran en la [hoja de ruta](README.md#13-hoja-de-ruta).
