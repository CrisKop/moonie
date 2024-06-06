import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createServer } from 'http';
import { Server } from 'socket.io'
import dotenv from 'dotenv';
dotenv.config();

const {cloud_name, api_key, api_secret} = process.env;

const {backend_url, frontend_url, socket_url, backend_local_url, frontend_local_url, socket_local_url} = process.env;

// Configurar Cloudinary
cloudinary.config({ 
  cloud_name, 
  api_key, 
  api_secret 
});

// Configurar Multer con Cloudinary como almacenamiento
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars', // Carpeta en la que se almacenarán las imágenes en Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'] // Formatos de archivo permitidos
  }
});
export const upload = multer({ storage });

import authRoutes from './routes/auth.routes.js';
import chatsRoutes from './routes/chats.routes.js';
import messagesRoutes from './routes/messages.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'
import { authRequired } from './middlewares/validateToken.js';
import User from './models/user.model.js';

const app = express();

app.use(cors({
    origin: [backend_url, frontend_url, socket_url,backend_local_url, frontend_local_url, socket_local_url],
    credentials: true
  }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.method, req.url, req.query);
  next();
});



app.use("/api/auth", authRoutes);
app.use("/api/chats", chatsRoutes); 
app.use("/api/messages", messagesRoutes); 
app.use("/api/notifications", notificationsRoutes)

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [backend_url, frontend_url, socket_url,backend_local_url, frontend_local_url, socket_local_url],
    methods: ["GET", "POST"],
    credentials: true
  }
});

server.listen(9502, () => {
  console.log('Socket.IO server listening on port 9502');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("join_room", (data) => {
    socket.join(data)
    console.log("Room joined:", data)
  })

  socket.on("leave_room", (data) => {
    socket.leave(data)
    console.log("Room leaved:", data)
  })


});

export {io};

export default app;