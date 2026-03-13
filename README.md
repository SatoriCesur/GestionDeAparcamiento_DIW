# Encuentra tu Coche



<p align="center">
	Aplicación web para registrar un vehículo aparcado, seguir distancia/tiempo en tiempo real y consultar historial de ubicaciones.
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node" />
	<img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express" />
	<img src="https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap" />
	<img src="https://img.shields.io/badge/Leaflet-Map-199900?logo=leaflet&logoColor=white" alt="Leaflet" />
	<img src="https://img.shields.io/badge/Licencia-ISC-blue" alt="Licencia" />
</p>

## Demo online

<p align="center">https://gestiondeaparcamiento-diw.onrender.com/</p>

## Tabla de contenidos

1. [Resumen](#resumen)
2. [Funcionalidades](#funcionalidades)
3. [Stack técnico](#stack-técnico)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Instalación y ejecución](#instalación-y-ejecución)
6. [Variables de entorno](#variables-de-entorno)
7. [Flujo de uso](#flujo-de-uso)
8. [Rutas principales](#rutas-principales)
9. [Estado del proyecto](#estado-del-proyecto)
10. [Roadmap](#roadmap)
11. [Autor y licencia](#autor-y-licencia)

## Resumen

Este proyecto ayuda a encontrar un coche aparcado en ciudad mediante geolocalización del navegador.

Objetivos principales:

- Registrar coordenadas del vehículo en el momento de aparcar.
- Mostrar distancia y tiempo transcurrido de la sesión activa.
- Visualizar la posición en mapa interactivo.
- Mantener historial local y sincronización remota con sesión iniciada.

## Funcionalidades

| Módulo | Descripción |
|---|---|
| Aparcamiento | Guarda ubicación actual del vehículo con fecha/hora. |
| Seguimiento | Calcula distancia al coche y cronómetro en vivo. |
| Mapa | Muestra coche y usuario con Leaflet. |
| Historial | Lista aparcamientos finalizados desde localStorage. |
| Autenticación | Login/Logout para habilitar sincronización en servidor. |
| Alertas | Notificaciones con SweetAlert2 para eventos clave. |

## Stack técnico

- Backend: Node.js, Express, EJS, express-session
- Frontend: Bootstrap 5, Bootstrap Icons, SweetAlert2
- Mapas: Leaflet + OpenStreetMap
- Persistencia: localStorage (cliente) + memoria de servidor (demo)

## Estructura del proyecto

```text
Mi_coche/
	app.js
	bin/
		www
	middlewares/
		auth.js
	routes/
		index.js
		users.js
	views/
		index.ejs
		mapa.ejs
		historial.ejs
		login.ejs
		error.ejs
		partials/
			nav.ejs
			footer.ejs
	public/
		javascripts/
			app.js
		stylesheets/
			style.css
	.env
	package.json
```

## Instalación y ejecución

Requisitos:

- Node.js 18 o superior
- npm

Instalación:

```bash
npm install
```

Desarrollo:

```bash
npm run dev
```

Producción local:

```bash
npm start
```

## Variables de entorno

Archivo `.env`:

```env
PORT=5000
```

## Flujo de uso

1. Inicia sesión (opcional) para habilitar sincronización remota.
2. Pulsa "Aparcar Vehículo Aquí" para guardar la posición.
3. Revisa tiempo y distancia en la pantalla principal.
4. Consulta la ubicación en la vista Mapa.
5. Finaliza sesión para enviar el registro al historial.

Credenciales de prueba actuales:

- Usuario: `Admin`
- Contraseña: `1234`

## Rutas principales

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/` | Pantalla principal |
| GET | `/mapa` | Vista de mapa |
| GET | `/historial` | Vista de historial |
| GET | `/login` | Formulario de acceso |
| POST | `/login` | Autenticación |
| GET | `/logout` | Cierre de sesión |
| POST | `/api/guardar` | Sincronización remota |

## Estado del proyecto

- Aplicación funcional para flujo local completo.
- Autenticación básica operativa.
- Sincronización remota disponible para demostración.

Limitaciones actuales:

- Persistencia remota en memoria (se reinicia al apagar servidor).
- Logout implementado por GET (recomendable migrarlo a POST).

## Roadmap

- Persistencia real en base de datos (MongoDB/PostgreSQL).
- Hash de contraseñas y gestión de usuarios real.
- CSRF para autenticación/logout.
- Tests de integración y unitarios.
- Modo PWA completo con manifest y service worker.

## Autor y licencia

- Autor: Hamza Satori
- Licencia: ISC
