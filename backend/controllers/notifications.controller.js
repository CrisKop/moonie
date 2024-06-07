import User from '../models/user.model.js';
import Chats from '../models/chats.model.js';
import Noti from '../models/notifications.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { io } from '../app.js';

 export const getNotifications = async (req, res) => {
    const user = req.user

    try {
      
       
       const userNotifications = await Noti.findOne({user: user.id})
       
       if(!userNotifications){
        return res.status(200).json([])
      }
      console.log(userNotifications)
      return res.status(200).json(userNotifications)
   } catch (error) {
      console.log(error)
      return res.status(500).json(["error"])
   }
   }


   
   export const clearNotifications = async (req, res) => {
      const user = req.user
      const {chatid} = req.body

      console.log(req.body)


      const editres = await editNotificationsFunc(user.id, chatid, false)

      if(editres){
      return res.status(200).json(editres.chats);
      } else {
         return res.status(500).json(["No se pudo eliminar las notificacions"])
      }

   }

   export const editNotificationsFunc = async (user, chatid, add) => {
      if (!user || !chatid || add === undefined) {
        console.error("Faltan parámetros requeridos");
        return null;
      }
    
      let notificationEdited = null;
    
      if (add === true) {
        notificationEdited = await Noti.findOneAndUpdate(
          { user: user, 'chats.chatid': chatid },
          { $inc: { 'chats.$.quantity': 1 } },
          { new: true }
        );
       // console.log("Incrementar cantidad:", notificationEdited);
    
        if (!notificationEdited) {
          notificationEdited = await Noti.findOneAndUpdate(
            { user: user, 'chats.chatid': { $ne: chatid } },
            { $push: { chats: { chatid: chatid, quantity: 1 } } },
            { new: true }
          );
         // console.log("Agregar nuevo chat:", notificationEdited);
        }
    
        if (!notificationEdited) {
          notificationEdited = await Noti.create({
            user: user,
            chats: [{ chatid: chatid, quantity: 1 }]
          });
         // console.log("Crear nuevo usuario con chat:", notificationEdited);
        }
      } else if (add === false) {
        notificationEdited = await Noti.findOneAndUpdate(
          { user: user },
          { $pull: { chats: { chatid: chatid } } },
          { new: true }
        );
     //   console.log("Eliminar chat:", notificationEdited);
      }
    
      if (!notificationEdited) {
      //  console.error("No se editó nada");
        return null;
      }

    
    
      return notificationEdited;
    };
    
    