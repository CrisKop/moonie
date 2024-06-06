import { createContext, useContext, useEffect } from 'react';
import { useState } from 'react';
import { useChat } from "./ChatContext"
import { useAuth } from "./AuthContext"
import {
  deleteMessagerequest,
  editMessagerequest,
  sendMessageRequest
} from '../api/message';
import { useSocket } from './SocketContext';
import { clearUserNotificationsRequest } from '../api/chat';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error('useTasks must be used within a ChatProvider');
  }

  return context;
};

export function MessageProvider({ children }) {
  const [MessageDropDown, setMessageDropDown] = useState(["", false, []]);
  const [DeleteMessageDialogOpen,  setDeleteMessageDialogOpen] = useState(false)
  const [EditingMessage, setEditingMessage] = useState(false)
  const [retrySendingDialog, setRetrySendingDialog] = useState(false)

  const {CurrentOppenedChat, setCurrentOppenedChat, userChats, setUserChats, chatcontainerRef } = useChat();
  
  const {user,userNotifications, setUserNotifications, showNotification, clearUserNotifications} = useAuth();

  const {socket} = useSocket()

  const [sendingMessageData, setSendingMessageData] = useState([])
    

  //#region Enviar mensaje
  const sendMessage = async (data) => {
    try {

      function generarStringAleatorio(longitud) {
        return [...Array(longitud)].map(() => String.fromCharCode(Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 65 : 97))).join('');
      }

      const actualdate = new Date(Date.now())
      const dateNowMongo = actualdate.toISOString()

      let temporalid;
      if(data.id){
        temporalid = data.id
      } else {
        temporalid = `temporal-${generarStringAleatorio(5)}`
      }

      const temporaldata = {
        _id: temporalid,
        message: data.message,
        files: null,
        senderID: {
          _id: data.senderID,
          username: user.username,
          avatarURL: user.avatarURL
        },
        chatID: data.chatID,
        createdAt: dateNowMongo,
        updatedAt: dateNowMongo,
        deleted: false,
        edited: false
      }

   

      // Concatenar los nuevos mensajes con los mensajes existentes
      let newMessages;
      if(data.id){
        newMessages = CurrentOppenedChat.messages
      } else {
        newMessages = CurrentOppenedChat.messages.concat(temporaldata);
        setSendingMessageData(temporaldata)
      }
  
      // Actualizar el estado de CurrentOppenedChat con los nuevos mensajes
      setCurrentOppenedChat({
        ...CurrentOppenedChat,
        messages: newMessages
      });


      data.socketID = socket.id

      data.senderData = {
        _id: data.senderID,
        username: user.username,
        avatarURL: user.avatarURL
      }

      const res = await sendMessageRequest(data);

    // Busca el mensaje temporal en CurrentOppenedChat.messages y actualiza su _id
const updatedMessages = newMessages.map(message => {
  if (message._id === temporaldata._id) {
    return {
      ...message,
      _id: res.data._id // Actualiza el _id del mensaje
    };
  }
  return message;
});

console.log(updatedMessages, "actualizados")

// Actualiza el estado de CurrentOppenedChat con los mensajes actualizados
setCurrentOppenedChat({
  ...CurrentOppenedChat,
  messages: updatedMessages
});

      const updatedUserChats = userChats.map(chat => {
        if (chat._id === res.data.chatID) {
          // Actualiza el campo chatdata del chat que coincide con el chatID
          return {
            ...chat,
            chatdata: {
              ...chat.chatdata,
              lastMessageID: res.data._id,
              lastMessage: res.data.message,
              lastMessageCreatedAt: res.data.createdAt,
              lastMessageSentBy: user.username,
              lastMessageDeleted: false
            }
          };
        } else {
          return chat; // Devuelve el chat sin modificar
        }
      });

      updatedUserChats.sort((a, b) => {
        // Convertir las fechas de los últimos mensajes a objetos Date
        const firstLastMessageDate = a.chatdata.lastMessageCreatedAt ? new Date(a.chatdata.lastMessageCreatedAt) : null;
        const secondLastMessageDate = b.chatdata.lastMessageCreatedAt ? new Date(b.chatdata.lastMessageCreatedAt) : null;
        const firstCreatedAt = new Date(a.createdAt);
        const secondCreatedAt = new Date(b.createdAt);
      
        // Si ambos chats tienen mensajes más recientes, comparar las fechas de los últimos mensajes
        if (firstLastMessageDate && secondLastMessageDate) {
          return secondLastMessageDate - firstLastMessageDate; // Orden descendente para que el más reciente esté primero
        }
      
        // Si solo uno de los chats tiene un mensaje más reciente
        if (firstLastMessageDate && !secondLastMessageDate) {
          if (secondCreatedAt > firstLastMessageDate) {
            return 1; // El chat sin último mensaje pero con creación más reciente se pone primero
          }
          return -1; // El chat con último mensaje se pone primero
        }
        
        if (!firstLastMessageDate && secondLastMessageDate) {
          if (firstCreatedAt > secondLastMessageDate) {
            return -1; // El chat sin último mensaje pero con creación más reciente se pone primero
          }
          return 1; // El chat con último mensaje se pone primero
        }
      
        // Si ninguno de los chats tiene mensajes más recientes, comparar las fechas de creación de los chats
        return secondCreatedAt - firstCreatedAt; // Orden descendente para que el más reciente esté primero
      });

      updatedUserChats.sort((a, b) => {
        if (a.type === "global" && b.type !== "global") {
            return -1; // a viene primero que b
        } else if (a.type !== "global" && b.type === "global") {
            return 1; // b viene primero que a
        } else {
            return 0; // no hay preferencia entre a y b
        }
    });
      
      // Actualiza el estado con los chats modificados
      setUserChats(updatedUserChats);
    } catch (error) {
      console.log(error, "error sending message")
      setRetrySendingDialog(true)
      console.error("error enviando mensaje");
    }
  };


  //#region Eliminar mensaje
  const deleteMessage = async (messageid) => {
    try {
      const res = await deleteMessagerequest({
        messageid
      })


      console.log(res, "res")
  
      const mensajesactuales = CurrentOppenedChat.messages.map(mensaje => {
        if (mensaje._id === res.data._id) {
            return { ...mensaje, message: null, deleted: true };
        } else {
            return mensaje;
        }
    });

      setCurrentOppenedChat(prevChat => ({
        ...prevChat,
        messages: mensajesactuales
      }))

      showNotification("Mensaje eliminado", true)

    } catch (error) {
      console.log(error, "deletechat")
      showNotification("Error eliminando", false)
    }


  }


  //#region Editar mensaje
  const editMessage = async (data) => {
    try {
      const res = await editMessagerequest({
        data
      })


      console.log(res, "res")
  
      const mensajesactuales = CurrentOppenedChat.messages.map(mensaje => {
        if (mensaje._id === res.data._id) {
            return { ...mensaje, message: res.data.message, edited: true };
        } else {
            return mensaje;
        }
    });

      setCurrentOppenedChat(prevChat => ({
        ...prevChat,
        messages: mensajesactuales
      }))

      showNotification("Mensaje editado", true)

    } catch (error) {
      console.log(error, "deletechat")
      showNotification("Error editando", false)
    }


  }



   //#region SOCKETS ==========




    


   //#region Mensaje recibido
    socket.on("message", (data) => {


      console.log('Client socket ID:', socket.id);
      console.log('Received socket ID:', data.socketID);
      
    if (socket.id === data.socketID) {
    return console.log("SOn iguales!")
  }
  
  
  console.log(data)

  console.log(CurrentOppenedChat, "current")

  let messagetoadd = data.response

  messagetoadd.senderID = data.senderData


  if(CurrentOppenedChat._id && CurrentOppenedChat._id === data.response.chatID){

    console.log(CurrentOppenedChat._id === data.response.chatID, CurrentOppenedChat._id, data.response.chatID, "prueba fix cambio")

   let newMessages = CurrentOppenedChat.messages.concat(messagetoadd);

    setCurrentOppenedChat({
      ...CurrentOppenedChat,
      messages: newMessages
    });
  }

  if(userChats.length > 0){
    const updatedUserChats = userChats.map(chat => {
      if (chat._id === data.response.chatID) {

        console.log(chat)
        // Actualiza el campo chatdata del chat que coincide con el chatID
        return {
          ...chat,
          chatdata: {
            ...chat.chatdata,
            lastMessageID: data.response._id,
            lastMessage: data.response.message,
            lastMessageCreatedAt: data.response.createdAt,
            lastMessageSentBy: data.senderData.username,
            lastMessageDeleted: false
          }
        };
      } else {
        return chat; // Devuelve el chat sin modificar
      }
    });

    updatedUserChats.sort((a, b) => {
      // Convertir las fechas de los últimos mensajes a objetos Date
      const firstLastMessageDate = a.chatdata.lastMessageCreatedAt ? new Date(a.chatdata.lastMessageCreatedAt) : null;
      const secondLastMessageDate = b.chatdata.lastMessageCreatedAt ? new Date(b.chatdata.lastMessageCreatedAt) : null;
      const firstCreatedAt = new Date(a.createdAt);
      const secondCreatedAt = new Date(b.createdAt);
    
      // Si ambos chats tienen mensajes más recientes, comparar las fechas de los últimos mensajes
      if (firstLastMessageDate && secondLastMessageDate) {
        return secondLastMessageDate - firstLastMessageDate; // Orden descendente para que el más reciente esté primero
      }
    
      // Si solo uno de los chats tiene un mensaje más reciente
      if (firstLastMessageDate && !secondLastMessageDate) {
        if (secondCreatedAt > firstLastMessageDate) {
          return 1; // El chat sin último mensaje pero con creación más reciente se pone primero
        }
        return -1; // El chat con último mensaje se pone primero
      }
      
      if (!firstLastMessageDate && secondLastMessageDate) {
        if (firstCreatedAt > secondLastMessageDate) {
          return -1; // El chat sin último mensaje pero con creación más reciente se pone primero
        }
        return 1; // El chat con último mensaje se pone primero
      }
    
      // Si ninguno de los chats tiene mensajes más recientes, comparar las fechas de creación de los chats
      return secondCreatedAt - firstCreatedAt; // Orden descendente para que el más reciente esté primero
    });

    updatedUserChats.sort((a, b) => {
      if (a.type === "global" && b.type !== "global") {
          return -1; // a viene primero que b
      } else if (a.type !== "global" && b.type === "global") {
          return 1; // b viene primero que a
      } else {
          return 0; // no hay preferencia entre a y b
      }
  });
    
    // Actualiza el estado con los chats modificados
    setUserChats(updatedUserChats);
  }
  
  
 return;
  

})


//#region Notificaciones
socket.on("notificationsChange", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log("notification socket", data)


  if(userNotifications){

    if(CurrentOppenedChat._id && CurrentOppenedChat._id === data.chatID){

      console.log("notification 22222222")
      
      const res = clearUserNotifications(data.chatID)
  
      const filteredNotifications = userNotifications.filter(n => n.chatid !== CurrentOppenedChat._id)
      setUserNotifications(filteredNotifications)
  
      
    } else {
    setUserNotifications(data.response)
    }
  }

 

})




//#region Mensaje eliminado
socket.on("messageDeleted", (data) => {


  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);
  
if (socket.id === data.socketID) {
return console.log("SOn iguales!")
}

if(CurrentOppenedChat._id && CurrentOppenedChat._id === data.message.chatID){
const mensajesactuales = CurrentOppenedChat.messages.map(mensaje => {
  if (mensaje._id === data.message._id) {
      return { ...mensaje, message: null, deleted: true };
  } else {
      return mensaje;
  }
});

setCurrentOppenedChat(prevChat => ({
  ...prevChat,
  messages: mensajesactuales
}))

}


if(userChats.length > 0){
const updatedUserChats = userChats.map(chat => {
  if (chat._id === data.message.chatID) {

    console.log(chat)
    // Actualiza el campo chatdata del chat que coincide con el chatID

    if(chat.chatdata.lastMessageID && chat.chatdata.lastMessageID === data.message._id){
    return {
      ...chat,
      chatdata: {
        ...chat.chatdata,
        lastMessage: "",
        lastMessageDeleted: true,
      }
    };
  } else {
    return chat; // Devuelve el chat sin modificar
    }
  } else {
    return chat; // Devuelve el chat sin modificar
  }
});


setUserChats(updatedUserChats);
}


})


//#region Mensaje eliminado
socket.on("messageEdited", (data) => {


  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);
  
if (socket.id === data.socketID) {
return console.log("SOn iguales!")
}

if(CurrentOppenedChat._id && CurrentOppenedChat._id === data.message.chatID){
const mensajesactuales = CurrentOppenedChat.messages.map(mensaje => {
  if (mensaje._id === data.message._id) {
      return { ...mensaje, message: data.message.message, edited: true };
  } else {
      return mensaje;
  }
});

setCurrentOppenedChat(prevChat => ({
  ...prevChat,
  messages: mensajesactuales
}))

}


if(userChats.length > 0){
  const updatedUserChats = userChats.map(chat => {
    if (chat._id === data.message.chatID) {
  
      console.log(chat)
      // Actualiza el campo chatdata del chat que coincide con el chatID
  
      if(chat.chatdata.lastMessageID && chat.chatdata.lastMessageID === data.message._id){
      return {
        ...chat,
        chatdata: {
          ...chat.chatdata,
          lastMessage: data.message.message,
        }
      };
    } else {
      return chat; // Devuelve el chat sin modificar
      }
    } else {
      return chat; // Devuelve el chat sin modificar
    }
  });
  
  
  setUserChats(updatedUserChats);
  }


})





  return (
    <MessageContext.Provider value={{ sendingMessageData, retrySendingDialog, setRetrySendingDialog, sendingMessageData, setSendingMessageData, editMessage, EditingMessage, setEditingMessage, deleteMessage, DeleteMessageDialogOpen,  setDeleteMessageDialogOpen, MessageDropDown, setMessageDropDown, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
}