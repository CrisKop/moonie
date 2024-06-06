import Msgs from '../models/messages.model.js';
import fs from 'fs';
import fspromises from 'fs/promises'
import { findChatFunc, updateLastMessage } from './chat.controller.js';
import mongoose from 'mongoose';
import { io } from '../app.js';
import { getUsername } from './auth.controller.js';
import { editNotificationsFunc } from './notifications.controller.js';


export const createMessage = async(req,res) => {
    const { message, senderID, chatID, socketID, senderData} = req.body;
  

    try {
      
  
      const newMessage = new Msgs({
        message,
        senderID,
        chatID
      })

      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
          const response = await newMessage.save();
      
          if (response) {
              const resultado = await updateLastMessage(chatID, message, response.createdAt, senderID, response._id, false);
      
              if (resultado === null) {
                  await session.abortTransaction();
                  session.endSession();
                  return res.status(500).json(["Error al crear mensaje (resultado null)"]);
              }
          } else {
              await session.abortTransaction();
              session.endSession();
              return res.status(500).json(["Error al crear mensaje"]);
          }
      
          await session.commitTransaction();
          session.endSession();
          

          const findChatMembers = await findChatFunc(chatID)


          if(findChatMembers !== null){
            const memberstosendnoti = findChatMembers.members.filter(m => m !== senderID)

 

            memberstosendnoti.map(async (m) => {
              const editNotifications = await editNotificationsFunc(m, chatID, true)

              console.log(editNotifications, "editNotif")

              if(editNotifications){
                console.log(m, "notification")
                io.to(m.toString()).emit("notificationsChange", {response: editNotifications.chats, socketID, chatID})
              }
            })
           
          }

      

          io.to(response.chatID.toString()).emit("message", {response, senderData, socketID})
          console.log("mensaje enviado", response.chatID.toString())
          console.log(socketID, "id del socket del sender")
          return res.status(200).json(response);
      
          // Aquí puedes enviar la respuesta de éxito si ambas operaciones se realizan correctamente
      
      } catch (error) {
          await session.abortTransaction();
          session.endSession();
          // Manejar el error de manera adecuada
          return res.status(500).json(["Error al crear mensaje"]);
      }
  

    } catch (error) {
      console.log(error)
      return res.status(500).json(["Error al crear mensaje"]);
    }
  }




  export const getChatMessages = async(req,res) => {
    const {chatid, lastchatdeletion} = req.query;

    const verifyChatDeletion = async (mongoTimestamp, deletionDate) =>{
      const mongodate = new Date(mongoTimestamp);
      const DelDate = parseInt(deletionDate)

      return mongodate < DelDate;
    }

    if(!chatid) return res.status(500).json(["No fue enviada una id"]);
  
    try {
  

      const count = await Msgs.countDocuments({ chatID: chatid });
if (count === 0) {
  return res.status(200).json([]);
}

const lastdeletionchatDate = new Date(parseInt(lastchatdeletion));

console.log(lastdeletionchatDate)

let messages;

if(isNaN(lastdeletionchatDate)){
  messages = await Msgs.find({
    chatID: chatid
  })
    .populate({
      path: 'senderID',
      select: '_id username avatarURL'
    })
} else {
  messages = await Msgs.find({
    chatID: chatid ,
    createdAt: {$gte: lastdeletionchatDate }
  })
    .populate({
      path: 'senderID',
      select: '_id username avatarURL'
    })
}

      if(!messages) return res.status(500).json(["Mensajes no encontrados"]);
  
      return res.status(200).json(messages)
    } catch (error) {
      console.log(error);
      return res.status(500).json(["Error al obtener mensajes"]);
    }
  }


  export const deleteMessage = async (req, res) => {
    const {messageid:data} = req.body
    try {
      const message = await Msgs.findOneAndUpdate(
        { _id: data.messageid }, 
        {     $set: { 
          message: null,
          deleted: true
      }
    }, 
        { new: true }
    );

      if(!message) return res.status(500).json(["No se eliminó nada"]);

      const resultado = await updateLastMessage(message.chatID, "", message.createdAt, message.senderID, message._id, true);

      io.to(message.chatID.toString()).emit("messageDeleted", {message, socketID: data.socketID})
      return res.status(200).json(message)
    } catch (error) {
      console.log(error)
     return res.status(500).json(["No se eliminó bien"]);
    }
  }



  export const editMessage = async (req, res) => {
    const {data} = req.body
    try {
      const message = await Msgs.findOneAndUpdate(
        { _id: data.messageid }, 
        {     $set: { 
          message: data.content,
          edited: true
      }
    }, 
        { new: true }
    );

      if(!message) return res.status(500).json(["No se editó nada"]);

      const deletedornot = message.deleted ? message.deleted : false;
      const resultado = await updateLastMessage(message.chatID, message.message, message.createdAt, message.senderID, message._id, deletedornot);


      io.to(message.chatID.toString()).emit("messageEdited", {message, socketID: data.socketID})
      return res.status(200).json(message)
    } catch (error) {
      console.log(error)
     return res.status(500).json(["No se editó bien"]);
    }
  }


  export const searchMessages = async (req,res) => {
    const {chatid, search} = req.query;

    try {
      const messagesreq = await Msgs.find({
        chatID: chatid,
        message: { $regex: search, $options: 'i' }
    }).populate({
        path: 'senderID',
        select: 'username _id avatarURL'
    });
  
      if(!messagesreq) return res.status(200).json([])
  
        return res.status(200).json(messagesreq)
    } catch (error) {
      console.log(error)
      return res.status(500).json(["Hubo error buscando los mensajes"])
    }

  }

