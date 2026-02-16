# Cbox Wrapper - Docker Reverse Proxy

Este proyecto incluye un reverse proxy para Cbox que funciona tanto en desarrollo local con Docker como en producción en Vercel.

## 🚀 Características

- **Reverse Proxy con Next.js API Routes**: Funciona automáticamente en Vercel
- **Docker Compose**: Para desarrollo y testing local
- **Nginx**: Load balancer y proxy reverso con rate limiting
- **CORS configurado**: Permite el acceso desde cualquier origen
- **Caching optimizado**: Para recursos estáticos y assets

## 📦 Despliegue en Vercel

El proyecto está configurado para desplegarse automáticamente en Vercel. El proxy funcionará sin necesidad de Docker:

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente Next.js
3. El API route en `/api/proxy` manejará el proxying
4. ¡Listo! Tu aplicación funcionará con el proxy

## 🐳 Uso con Docker (Desarrollo Local)

### Prerequisitos

- Docker
- Docker Compose

### Iniciar el proyecto

```bash
# Construir y levantar los contenedores
docker-compose up --build

# O en modo detached (background)
docker-compose up -d --build
```

La aplicación estará disponible en:
- **http://localhost** - A través de Nginx
- **http://localhost:3000** - Directamente Next.js

### Detener los contenedores

```bash
docker-compose down
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Solo Next.js
docker-compose logs -f nextjs

# Solo Nginx
docker-compose logs -f nginx
```

## 📁 Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   └── proxy/
│   │       ├── route.ts              # Proxy principal de Cbox
│   │       └── cbox/
│   │           └── [...path]/
│   │               └── route.ts      # Proxy para recursos adicionales
│   └── page.tsx                       # Página principal con iframe
├── nginx/
│   ├── nginx.conf                     # Configuración de Nginx
│   └── logs/                          # Logs de Nginx
├── Dockerfile                         # Imagen de Next.js
├── docker-compose.yml                 # Orquestación de servicios
└── next.config.ts                     # Configuración de Next.js con proxy

```

## 🔧 Configuración

### Next.js Proxy

El proxy está configurado en `app/api/proxy/route.ts` y maneja:
- Solicitudes GET y POST a Cbox
- Reemplazo de URLs para que apunten al proxy
- Headers apropiados para CORS
- User-Agent y Referer para compatibilidad

### Nginx

La configuración de Nginx incluye:
- **Rate limiting**: 10 req/s para API, 30 req/s general
- **Gzip compression**: Para reducir tamaño de transferencia
- **Caching**: Para recursos estáticos
- **Security headers**: X-Frame-Options, X-XSS-Protection, etc.
- **Health check**: Endpoint en `/health`

## 🛠️ Personalización

### Cambiar el Box ID

Edita el iframe en `app/page.tsx`:

```tsx
<iframe
  src="/api/proxy?boxid=TU_BOX_ID&boxtag=TU_TAG"
  // ...
/>
```

O usa la URL limpia configurada en rewrites:

```tsx
<iframe src="/cbox" />
```

### Modificar Rate Limiting

Edita `nginx/nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

## 🔍 Troubleshooting

### El iframe no carga

1. Verifica que el contenedor esté corriendo: `docker-compose ps`
2. Revisa los logs: `docker-compose logs -f`
3. Asegúrate de que el puerto 80 no esté en uso

### Error de CORS

El proxy debe manejar CORS automáticamente. Si hay problemas:
1. Verifica que `Access-Control-Allow-Origin: *` esté en los headers
2. Revisa la configuración en `next.config.ts`

### Problemas de rendimiento

1. Ajusta el rate limiting en `nginx.conf`
2. Aumenta el cache time para recursos estáticos
3. Considera usar un CDN para assets

## 📝 Notas

- El proxy reescribe las URLs de Cbox para que pasen por nuestro servidor
- En producción (Vercel), solo se usa el API route de Next.js
- En desarrollo local, Docker + Nginx proveen un entorno más completo
- Los logs de Nginx se guardan en `nginx/logs/`

## 🔐 Seguridad

- Rate limiting activado por defecto
- Headers de seguridad configurados
- CORS configurado (ajusta según necesites)
- Client body size limitado a 10MB

## 📚 Recursos

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Deployment](https://vercel.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
