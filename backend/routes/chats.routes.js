import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {  createChat, findUserChats, findChat, findNewUsers, userChatDelete, editGroupInfo, editGroupMembers, editGroupAdministrators } from "../controllers/chat.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const {cloud_name, api_key, api_secret} = process.env;

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

const router = Router();

router.post("/", authRequired, createChat)
router.post("/deleteChat", authRequired, userChatDelete)
router.get("/getuserchats", authRequired, findUserChats)
router.get("/findchat", authRequired, findChat)
router.get("/getnewchats", authRequired, findNewUsers)
router.post('/editgroupinfo', authRequired, upload.single('icon'), editGroupInfo)
router.post('/editgroupmembers', authRequired, editGroupMembers)
router.post('/editgroupadministrators', authRequired, editGroupAdministrators)
//router.get("/levels", authRequired, getProfileLevels)
//router.get("/allmessages", getMessages)
//router.get("/levels/:id", getTask)
//router.get("/levels/:id/preview", getLevelPreview)
//router.post("/levels", authRequired, validateSchema(createTaskSchema), createTask)
//router.delete("/levels/:id", authRequired, deleteTask)
//router.put("/levels/:id", authRequired, updateTask)

export default router