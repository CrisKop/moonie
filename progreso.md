# Backend

 ✅ Setup
 ✅ MongoDB
 ✅ Usuarios
    ✅ Registro
    ✅ Creación de token
    ✅ Login
    ✅ Validación de token
    ✅ Validación de datos con zod
 ✅ Chats
    ✅ Crear chat nuevo
    ✅ Obtener lista de chats del usuario
    ✅ Obtener chat en específico
    ✅ Paginación de sugerencias de nuevos chats
        ✅ Filtrar chats ya existentes
    ✅ Eliminar chat
    ✅ Grupos
       ✅ Añadir miembros
       ✅ Remover miembros
 ✅ Mensajes
    ✅ Crear nuevo mensaje
    ✅ Obtener mensajes de un chat
    ✅ Editar mensajes
    ✅ Eliminar mensajes
    ✅ Buscar Mensajes
 ✅ Información de usuario
    ✅ Editar información
        ✅ Estado
        ✅ Avatar
 ✅ Dar información
    ✅ Chat
    ✅ Grupo
    ✅ Estados
 ✅ Cambios en tiempo real
    ✅ Chats dm
        ✅ Mensajes
        ✅ Cambio de información de usuarios
    ✅ Grupos
        ✅ Mensajes
        ✅ Cambio de información de grupo
        ✅ Expulsión o adición de miembros
        ✅ Cambio de administradores
 ✅ Notificaciones en tiempo real
    ✅ Mensajes
        ✅ Hora de llegada
        ✅ Contenido
        ✅ Mensaje editado
        ✅ Mensaje eliminado
        ✅ Cantidad de mensajes nuevos

 # Frontend

 ✅ Configuración inicial
 ✅ Registro
 ✅ Uso de context
 ✅ Login
 ✅ Protected Routes
 ✅ Obtener datos del usuario y mostrarlos en diferentes nav
 ✅ ChatPage
    ✅ Diseño de lista de chats
    ✅ Diseño de chat activo
    ✅ Diseño de barra de información de chat
    ✅ Dinamismo para abrir y cerrar secciones de chatpage
    ✅ Adaptación a celular
    ✅ Cambio de chat
    ✅ Cargar información de chat
       ✅ Mensajes
          ✅ Enviar mensajes
          ✅ Cargar mensajes
          ✅ Buscar Mensajes
          ✅ Separar mensajes por dias
 ✅ Obtener la lista de chats
 ✅ Buscar chat
 ✅ Cuadro emergente para encontrar nuevos usuarios
    ✅ Paginación
 ✅ Carga de información del usuario del chat para la barra de información
 ✅ Información de usuario
    ✅ Editar información
        ✅ Estado
        ✅ Foto de perfil
 ✅ Chat
    ✅ Crear chat
    ✅ Grupos
        ✅ Crear grupo
        ✅ Lista de miembros
        ✅ Añadir miembros
        ✅ Remover miembros
        ✅ Editar grupo
           ✅ Nombre
           ✅ Descripción
           ✅ Foto
           ✅ Administradores
    ✅ Eliminar chat
    ✅ Eliminar mensaje
    ✅ Editar mensaje
 ✅ Presentación
 ✅ Loading states
    ✅ Carga de lista de chats
    ✅ Carga de chat seleccionado
    ✅ Mensajes
       ✅ Estado enviado de mensaje
       ✅ Editar mensaje
       ✅ Eliminar mensaje
       ✅ Busqueda de mensajes
    ✅ Crear chat o grupo
    ✅ Cargar nuevos potenciales contactos
    ✅ Eliminar chat
    ✅ Cargar añadir o eliminar miembro
    ✅ Cargar cambio de informacion
       ✅ Perfil
       ✅ Grupo
    ✅ NOTIFICACIONES
 ✅ Chat global
 ✅ Cambios en tiempo real
    ✅ Lista de chats
        ✅ Prioridad al chat con mensaje reciente
        ✅ Información básica de mensaje
    ✅ Chats dm
        ✅ Mensajes
        ✅ Cambio de información de usuarios
    ✅ Grupos
        ✅ Mensajes
        ✅ Cambio de información de grupo
        ✅ Expulsión o adición de miembros
        ✅ Cambio de administradores
 ✅ Notificaciones en tiempo real
    ✅ Mensajes
        ✅ Hora de llegada
        ✅ Contenido
        ✅ Mensaje editado
        ✅ Mensaje eliminado
        ✅ Cantidad de mensajes nuevos
 ✅ Mejorar diseño
    ✅ Login
    ✅ Register
 ✅ Crear landing page

 # Retoques

 ❌ RETOQUES FINALES

 # Datos para recordar

 Cuando envío mensajes, puedo enviar el socket a la id del chat y verificar de quien es el mensaje, por si tiene multiples monosesiones

 mis chats tienen su valor members, que es un array con las ids de los usuarios miembros de los chats, puedo filtrar los miembros de todos los chats que tiene ese usuario y mandar a cada uno una señal individual de cambio de avatar para hacer que le llegue a cada usuario sin filtro en el cliente

 SOLARA
 MOONIE