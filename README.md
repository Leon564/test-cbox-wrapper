# CBox Chat Wrapper

Una aplicación Next.js que envuelve el chat de CBox en pantalla completa y permite inyectar código directamente en el textarea del chat.

## Características

✅ **Iframe en pantalla completa**: El chat ocupa toda la ventana del navegador  
✅ **Inyección de código sin CORS**: Componente que permite enviar código al textarea del chat  
✅ **API proxy**: Para manejar peticiones sin problemas de CORS  
✅ **Interfaz intuitiva**: Botón flotante y atajos de teclado para facilidad de uso  

## Instalación

```bash
npm install
# o
pnpm install
```

## Uso

### Desarrollo
```bash
npm run dev
# o
pnpm dev
```

### Producción
```bash
npm run build
npm start
```

## Características principales

### 1. Iframe en pantalla completa
El chat se muestra ocupando toda la ventana del navegador para una experiencia inmersiva.

### 2. Inyección de código
Hay varias maneras de inyectar código en el textarea del chat:

#### Botón flotante
- Haz clic en el botón azul con el icono de código (esquina superior derecha)
- Se abrirá un modal donde puedes pegar tu código
- Haz clic en "Inyectar" para enviarlo al chat

#### Atajos de teclado
- **Ctrl + Shift + I**: Abrir/cerrar el panel de inyección
- **Escape**: Cerrar el panel

### 3. Manejo de CORS

La aplicación incluye un proxy API en `/api/proxy` que:
- Evita problemas de CORS al hacer peticiones al servidor de CBox
- Mantiene las cookies y headers originales
- No interfiere con los estilos o funcionalidad del chat original

## Solución de problemas

### El código no se inyecta
1. **Verifica que el iframe haya cargado completamente**
2. **Revisa la consola del navegador** para errores CORS
3. **Asegúrate de que el selector del textarea sea correcto**
4. **Si hay CORS**, el sistema intentará usar el proxy automáticamente

### El botón flotante no aparece
1. **Verifica que no haya errores de JavaScript** en la consola
2. **Asegúrate de que el componente IframeWrapper** se esté utilizando correctamente

## Seguridad

- El proxy solo permite peticiones a dominios de CBox (`*.cbox.ws`)
- No se almacenan credenciales ni datos sensibles
- Las peticiones mantienen los headers de seguridad originales

## Tecnologías

- **Next.js 16.1.6**: Framework de React
- **React 19**: Biblioteca de UI  
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **API Routes**: Proxy server integrado
