# API de Gestión de Contactos

API REST con actualizaciones en tiempo real para gestionar contactos, construida con Node.js, Express, MongoDB, Redis y WebSockets.

## Características

- CRUD completo de contactos
- Actualizaciones en tiempo real via WebSockets
- Arquitectura Pub/Sub con Redis
- Frontend incluido que se actualiza automáticamente

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) corriendo localmente o en Docker
- [Redis](https://redis.io/) corriendo localmente o en Docker

## Instalación

1. Clona el repositorio o descarga los archivos

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/contactos_db

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=
   ```

## Ejecución

1. Asegúrate de que MongoDB y Redis estén corriendo:
   ```bash
   # Si usas Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   docker run -d -p 6379:6379 --name redis redis
   ```

2. Inicia la aplicación:

   **Modo desarrollo** (con reinicio automático):
   ```bash
   npm run dev
   ```

   **Modo producción**:
   ```bash
   npm start
   ```

3. Accede a:
   - **Frontend**: http://localhost:3000
   - **API**: http://localhost:3000/api/contactos

## Estructura del proyecto

```
api-node/
├── src/
│   ├── index.js                    # Punto de entrada
│   ├── config/
│   │   ├── db.js                   # Conexión MongoDB
│   │   └── redis.js                # Conexión Redis (publisher/subscriber)
│   ├── controllers/
│   │   └── contactoController.js   # Lógica CRUD + emisión de eventos
│   ├── models/
│   │   └── Contacto.js             # Esquema Mongoose
│   ├── routes/
│   │   └── contactoRoutes.js       # Definición de rutas REST
│   ├── services/
│   │   └── eventEmitter.js         # Publicador de eventos a Redis
│   └── websocket/
│       └── socketHandler.js        # Socket.io + suscripción Redis
├── public/
│   └── index.html                  # Frontend en tiempo real
├── .env                            # Variables de entorno
├── .env.example                    # Ejemplo de variables
├── .gitignore
├── package.json
└── README.md
```

## Arquitectura de tiempo real

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Postman   │────▶│  Express    │────▶│   MongoDB   │
│   (CRUD)    │     │  API REST   │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           │ Publica evento
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │  (Pub/Sub)  │
                    └──────┬──────┘
                           │
                           │ Suscribe
                           ▼
                    ┌─────────────┐
                    │  Socket.io  │
                    │ (WebSocket) │
                    └──────┬──────┘
                           │
                           │ Emite evento
                           ▼
                    ┌─────────────┐
                    │  Frontend   │
                    │   (HTML)    │
                    └─────────────┘
```

## Flujo de eventos

1. Usuario hace POST/PUT/DELETE desde Postman
2. Controlador guarda en MongoDB
3. Controlador publica evento a Redis (`contactos:eventos`)
4. Socket handler escucha Redis y emite a clientes WebSocket
5. Frontend recibe evento y actualiza la UI automáticamente

## Eventos en tiempo real

| Evento | Descripción |
|--------|-------------|
| `CONTACTO_CREADO` | Se creó un nuevo contacto |
| `CONTACTO_ACTUALIZADO` | Se actualizó un contacto |
| `CONTACTO_ELIMINADO` | Se eliminó un contacto |

## Endpoints de la API

### Base URL
```
http://localhost:3000/api/contactos
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/contactos` | Obtener todos los contactos |
| GET | `/api/contactos/:id` | Obtener un contacto por ID |
| POST | `/api/contactos` | Crear un nuevo contacto |
| PUT | `/api/contactos/:id` | Actualizar un contacto |
| DELETE | `/api/contactos/:id` | Eliminar un contacto |

## Modelo de datos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre` | String | Sí | Nombre del contacto |
| `email` | String | Sí | Email (único) |
| `telefono` | String | No | Número de teléfono |
| `empresa` | String | No | Nombre de la empresa |
| `notas` | String | No | Notas adicionales |
| `createdAt` | Date | Auto | Fecha de creación |
| `updatedAt` | Date | Auto | Fecha de actualización |

## Ejemplos de uso

### Crear un contacto
```bash
curl -X POST http://localhost:3000/api/contactos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "telefono": "555-1234",
    "empresa": "Tech Corp"
  }'
```

### Actualizar un contacto
```bash
curl -X PUT http://localhost:3000/api/contactos/ID_DEL_CONTACTO \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García Actualizada"
  }'
```

### Eliminar un contacto
```bash
curl -X DELETE http://localhost:3000/api/contactos/ID_DEL_CONTACTO
```

## Archivos clave

| Archivo | Descripción |
|---------|-------------|
| `src/controllers/contactoController.js` | CRUD + emisión de eventos a Redis |
| `src/websocket/socketHandler.js` | Puente entre Redis y clientes WebSocket |
| `src/services/eventEmitter.js` | Publica eventos al canal Redis |
| `public/index.html` | Frontend que escucha y renderiza en tiempo real |

## Códigos de estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Error de validación |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **Mongoose** - ODM para MongoDB
- **Socket.io** - WebSockets en tiempo real
- **ioredis** - Cliente Redis para Pub/Sub
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para habilitar CORS

## Licencia

ISC
