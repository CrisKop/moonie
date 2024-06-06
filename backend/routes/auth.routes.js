import { Router } from "express";
import { login, register, logout, editUserInfo, verifyToken} from '../controllers/auth.controller.js';
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
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

router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)
router.post('/logout', logout)

router.post('/edituserinfo', authRequired, upload.single('avatar'), editUserInfo)

router.get("/verify", verifyToken)
export default router;