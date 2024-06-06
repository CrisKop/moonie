import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getNotifications, clearNotifications  } from "../controllers/notifications.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createTaskSchema } from "../schemas/task.schema.js";

const router = Router();

router.get("/", authRequired, getNotifications)
router.post("/clear", authRequired, clearNotifications)
//router.post("/findChat", authRequired, findChat)
//router.get("/levels", authRequired, getProfileLevels)
//router.get("/allmessages", getMessages)
//router.get("/levels/:id", getTask)
//router.get("/levels/:id/preview", getLevelPreview)
//router.post("/levels", authRequired, validateSchema(createTaskSchema), createTask)
//router.delete("/levels/:id", authRequired, deleteTask)
//router.put("/levels/:id", authRequired, updateTask)

export default router