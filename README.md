# Encuentra tu Coche

Aplicación web para guardar la ubicación de un vehículo aparcado, visualizar su posición en un mapa y consultar historial de aparcamientos. Incluye autenticación básica para habilitar sincronización remota.

## Descripción

En entornos urbanos es común olvidar dónde se aparcó el coche. Este proyecto busca resolver ese problema con una interfaz simple y rápida:

- Guardar la posición actual del vehículo.
- Ver distancia y tiempo transcurrido desde el aparcamiento.
- Mostrar mapa con ubicación del coche y del usuario.
- Finalizar sesión de aparcamiento.
- Consultar historial local de registros.
- Sincronizar datos en "nube" cuando hay sesión iniciada.

## Funcionalidades principales

- Registro de aparcamiento con geolocalización del navegador.
- Seguimiento en tiempo real de distancia al vehículo.
- Cronómetro de sesión activa.
- Mapa interactivo con Leaflet.
- Historial de aparcamientos en localStorage.
- Inicio/cierre de sesión con Express Session.
- Notificaciones con SweetAlert2 (login/logout y confirmaciones).

## Tecnologías usadas

- Node.js
- Express
- EJS
- Express Session
- Bootstrap 5
- Bootstrap Icons
- Leaflet
- SweetAlert2
- localStorage (cliente)

## Estructura del proyecto

- app.js
- bin/www
- routes/index.js
- middlewares/auth.js
- views/index.ejs
- views/mapa.ejs
- views/historial.ejs
- views/login.ejs
- views/partials/nav.ejs
- views/partials/footer.ejs
- public/javascripts/app.js
- public/stylesheets/style.css
- .env

## Requisitos previos

- Node.js 18 o superior
- npm

## Instalación

1. Clonar repositorio.
2. Entrar en la carpeta del proyecto.
3. Instalar dependencias:

```bash
npm install
```

## Configuración de entorno

Crear o revisar el archivo .env con:

```env
PORT=5000
```

## Ejecución

Modo desarrollo (recomendado):

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Abrir en navegador:

- http://localhost:5000

## Flujo de uso

1. En Inicio, pulsar "Aparcar Vehículo Aquí" para guardar ubicación.
2. Se activa el seguimiento con tiempo y distancia.
3. En Mapa, visualizar ubicación del coche y del usuario.
4. En Historial, revisar aparcamientos finalizados.
5. Opcional: iniciar sesión para habilitar sincronización remota.

## Credenciales de prueba actuales

Usuario: Admin  
Contraseña: 1234

## Rutas principales

- GET /
- GET /mapa
- GET /historial
- GET /login
- POST /login
- GET /logout
- POST /api/guardar

## Estado actual del proyecto

- Funcional para uso local.
- Sincronización remota implementada en memoria de servidor (demostración).
- Pendiente: persistencia remota real en base de datos.

## Mejoras recomendadas

- Migrar autenticación a contraseñas hasheadas y usuarios en base de datos.
- Usar variable de entorno para el secret de sesión.
- Cambiar logout a método POST con protección CSRF.
- Guardar historial remoto en MongoDB o PostgreSQL.
- Añadir tests automáticos (unitarios e integración).
- Incorporar PWA completa (manifest + service worker + offline robusto).

## Autor

Hamza Satori

## Licencia

ISC
