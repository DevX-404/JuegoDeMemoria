🎮 Proyecto: Mini Juego de Memoria con API en Node.js (Full-Stack Simulado)

Este proyecto transforma un juego de memoria simple creado con React y TypeScript (Vite) en una aplicación con arquitectura Cliente-Servidor. El objetivo es demostrar la integración de un frontend (React) que consume una API backend (Node.js + Express) para obtener datos dinámicos.

🚀 Arquitectura del Proyecto

El proyecto está dividido en dos partes principales, reflejando una configuración Full-Stack moderna:

Componente

Tecnología

Rol

Frontend

React, TypeScript, Vite

Interfaz de Usuario, Lógica del Juego, Consumo de API.

Backend

Node.js, Express, ES Modules

Servir datos dinámicos (categorías de emojis).

Datos

data.json

Fuente de datos para el backend.

📦 Cambios Clave y Archivos Editados

Los siguientes archivos fueron modificados para establecer la comunicación entre React y Node.js:

1. Backend (server.js y data.json)

data.json: Se creó para almacenar colecciones de emojis clasificados por categorías (animales, comida, corazones, etc.).

server.js:

Implementado con Node.js y Express.

Se configuró el uso de ES Modules (import) para alinearse con la configuración moderna de Vite/React.

Lee el archivo data.json al iniciar.

Expone el endpoint /api/categories para que el frontend pueda solicitar todas las colecciones de emojis disponibles.

2. Frontend (React/TypeScript)

types.ts: Se añadieron interfaces (CategoryKey, EmojiCategories) para tipar la data que viene de la API.

Funcion/LogicaJuego.ts: La función inicializarCartas se modificó para aceptar la lista de emojis como argumento, en lugar de usar una lista fija.

App.tsx (Componente Principal):

Consumo de API: Usa useEffect para hacer un fetch a http://localhost:3000/api/categories al cargar.

Selección de Categoría: Muestra botones dinámicos basados en la respuesta de la API.

Gestión del Juego: Reinicia y genera el tablero usando los emojis de la categoría seleccionada por el usuario.

⚙️ Cómo Exponer el Juego (Pasos de Ejecución)

Para que el profesor pueda ver el proyecto funcionando, ambas partes (servidor y cliente) deben ejecutarse al mismo tiempo.

Requisitos Previos

Asegúrate de haber instalado las dependencias necesarias de Node.js en la carpeta raíz de tu proyecto:

# Instalar las dependencias del servidor Node.js
npm install express cors


Paso 1: Iniciar el Servidor Backend (Node.js)

Abre una terminal y dirígete a la carpeta donde se encuentra server.js (probablemente src/server).

# Navega a la carpeta del servidor si es necesario
cd [ruta-a-server]

# Ejecuta el servidor Node.js
node server.js


Resultado esperado: Deberías ver el mensaje: Servidor Express corriendo en http://localhost:3000

Paso 2: Iniciar la Aplicación Frontend (React/Vite)

Abre una segunda terminal y dirígete a la carpeta raíz de tu proyecto (donde está package.json).

# Navega a la carpeta raíz del proyecto
cd [ruta-raiz-proyecto]

# Ejecuta la aplicación React
npm run dev


Resultado esperado: Deberías ver la URL de Vite (ej. http://localhost:5173).

Demostración al Profesor

Muestra la interfaz del juego en el navegador.

Explica que los botones de categoría (Animales, Comida, etc.) se cargan dinámicamente desde el servidor de Node.js.

Muestra la Terminal 1 (server.js) y señala que, cada vez que la página de React se carga o se selecciona una categoría, el servidor registra una "Petición recibida en /api/categories", demostrando la comunicación HTTP entre el cliente y el servidor.