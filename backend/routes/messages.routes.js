import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {  createMessage, deleteMessage, getChatMessages, editMessage, searchMessages  } from "../controllers/messages.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";

const router = Router();

router.post("/", authRequired, createMessage)
router.get("/getchatmessages", authRequired, getChatMessages)
router.get("/searchmessages", authRequired, searchMessages)
router.post("/deletemessage", authRequired, deleteMessage)
router.post("/editmessage", authRequired, editMessage)
//router.post("/findChat", authRequired, findChat)
//router.get("/levels", authRequired, getProfileLevels)
//router.get("/allmessages", getMessages)
//router.get("/levels/:id", getTask)
//router.get("/levels/:id/preview", getLevelPreview)
//router.post("/levels", authRequired, validateSchema(createTaskSchema), createTask)
//router.delete("/levels/:id", authRequired, deleteTask)
//router.put("/levels/:id", authRequired, updateTask)

export default router