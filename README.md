# API de Gestión de Contactos

API REST sencilla para gestionar contactos, construida con Node.js, Express y MongoDB.

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [MongoDB](https://www.mongodb.com/) corriendo localmente o una URI de MongoDB Atlas

## Instalación

1. Clona el repositorio o descarga los archivos

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   Crea un archivo `.env` en la raíz del proyecto (o edita el existente):
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/contactos_db
   ```

## Ejecución

**Modo desarrollo** (con reinicio automático):
```bash
npm run dev
```

**Modo producción**:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Estructura del proyecto

```
api-node/
├── src/
│   ├── config/
│   │   └── db.js              # Configuración de conexión a MongoDB
│   ├── controllers/
│   │   └── contactoController.js  # Lógica de negocio
│   ├── models/
│   │   └── Contacto.js        # Esquema de Mongoose
│   ├── routes/
│   │   └── contactoRoutes.js  # Definición de rutas
│   └── index.js               # Punto de entrada de la aplicación
├── .env                       # Variables de entorno (no incluir en git)
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

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

Cada contacto tiene los siguientes campos:

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
    "empresa": "Tech Corp",
    "notas": "Cliente VIP"
  }'
```

### Obtener todos los contactos
```bash
curl http://localhost:3000/api/contactos
```

### Obtener un contacto por ID
```bash
curl http://localhost:3000/api/contactos/ID_DEL_CONTACTO
```

### Actualizar un contacto
```bash
curl -X PUT http://localhost:3000/api/contactos/ID_DEL_CONTACTO \
  -H "Content-Type: application/json" \
  -d '{
    "telefono": "555-9999"
  }'
```

### Eliminar un contacto
```bash
curl -X DELETE http://localhost:3000/api/contactos/ID_DEL_CONTACTO
```

## Respuestas de la API

### Respuesta exitosa (crear contacto)
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "nombre": "María García",
  "email": "maria@ejemplo.com",
  "telefono": "555-1234",
  "empresa": "Tech Corp",
  "notas": "Cliente VIP",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Respuesta de error
```json
{
  "mensaje": "El email ya está registrado"
}
```

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
- **dotenv** - Manejo de variables de entorno
- **cors** - Middleware para habilitar CORS

## Licencia

ISC
