# Moonie | Chat App

# https://chat.criskop.com

## Descripción
<!-- Aquí puedes escribir la descripción de tu proyecto -->
Moonie es una aplicación de chat fullstack creada con React que permite a los usuarios comunicarse en tiempo real.

## Tecnologías Usadas
- **Frontend**: Vite, React, Tailwind, SCSS, headlessui, axios, gsap
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **WebSocket**: Socket.io

## Capturas de la App
<!-- Añade aquí capturas de pantalla de tu aplicación -->
<div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
  <img src="https://criskop.com/img/moonie.png" alt="Pantalla de inicio de sesión" width="45%" style="margin: 1%;">
  <img src="https://chat.criskop.com/img/screenshot.png" alt="Pantalla principal de chat" width="45%" style="margin: 1%;">
</div>

## Licencia MIT con Atribución

Moonie está licenciado bajo la Licencia del Instituto Tecnológico de Massachusetts con atribución **(MIT with Attribution)**, Esto significa:

* Puedes usar, modificar el software libremente
* Distribuir el software requiere de mención o crédito al autor original u origen del código visible.
* El código fuente debe ser libre igualmente.
* Las versiones distribuidas o modificadas, deben mantener los mismos términos de licencia.

## Contribuir ❤️

¡Siempre hay manera de mejorar, si quieres ayudarnos a hacerlo a través de una idea, sugiriendo, has encontrado un error, o simplemento quieres ayudar, sigue estos pasos:

  1. Haz un fork del repositorio
  2. Crea una nueva rama con tu contribución 🌱
  3. Envía un pull request 🌟

  * Dentro de la carpeta backend no existe un archivo llamado ".env", crealo, son las variables y credenciales privadas, puedes poner propias y modificar las existentes para poder iniciar el proyecto correctamente:

  ```env
  # Configuración de la API de cloudinary (subida de imagenes/avatars)
  cloud_name=
  api_key=
  api_secret=

  # Configuración de la cuenta de MongoDB
  user=
  pass=

  # Configuración de CORS para desarrollo local
  backend_local_url=http://localhost:9500
  frontend_local_url=http://localhost:9501
  socket_local_url=http://localhost:9502

  # Configuración de CORS para dominio de producción
  backend_url=https://chatapi.criskop.com
  frontend_url=https://chat.criskop.com
  socket_url=https://chatsocket.criskop.com
  ```

## Contacto 👤

Si tienes alguna pregunta o quieres entrar a la comunidad del equipo de desarrollo, eres bienvenido en nuestra comunidad de discord:

https://discord.gg/pYcBdAuNub

¡Esperamos que disfrutes Moonie tanto como disfrutamos desarrollandolo! ❤️

---

Esto es un proyecto personal con ánimo de aprendizaje, siéntete libre de contribuir en lo que puedas, ¡cada aporte lo valoro!
