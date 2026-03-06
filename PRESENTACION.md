
1. Usuario ──────▶ Postman ──────▶ "Crear contacto Juan"
                                          │
2.                                        ▼
                               contactoRoutes.js
                                    "POST /api/contactos"
                                          │
3.                                        ▼
                              contactoController.js
                                   "Guardar Juan"
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
4.                 MongoDB                           eventEmitter.js
               "Juan guardado"                      "Avisar a todos"
                                                          │
5.                                                        ▼
                                                    Redis (Pub/Sub)
                                                   "¡Nuevo contacto!"
                                                          │
6.                                                        ▼
                                                  socketHandler.js
                                                "Enviar a navegadores"
                                                          │
7.                                                        ▼
                                                    index.html
                                              "Mostrar Juan en lista"
```