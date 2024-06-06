import { createContext, useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import {
  createChatRequest,
  getNewChatsRequest,
  getUserChatsRequest,
  getChatInfoRequest,
  deleteChatRequest,
  editGroupInfoRequest,
  editGroupMembersRequest,
  editGroupAdministratorsRequest,
  getUserNotificationsRequest
} from '../api/chat';

import {
  getChatMessages
} from '../api/message'
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useTasks must be used within a ChatProvider');
  }

  return context;
};

export function ChatProvider({ children }) {
  const [errors, setErrors] = useState({});
  const [userChats, setUserChats] = useState([]);
  const [newChatDialogOpen,  setnewChatDialogOpen] = useState(false)
  const [ InfoOpen, setInfoOpen ] = useState(false)
  const [ LeftBarShow, setLeftBarShow ] = useState(false)
  const [ CurrentOppenedChat, setCurrentOppenedChat] = useState([])
  const [ CurrentChatData, setCurrentChatData] = useState([])
  const [newChatsList, setNewChatsList] = useState([])
  const [UserConfigOpen, setUserConfigOpen] = useState(false)
  const [ChatListDropDown, setChatListDropDown] = useState(["", false]);
  const [DeleteChatDialogOpen,  setDeleteChatDialogOpen] = useState(false)
  const [CreateGroupDialogOpen,  setCreateGroupDialogOpen] = useState(false)
  const [GroupConfigOpen, setGroupConfigOpen] = useState(false)
  const [messageConfigOpen, setmessageConfigOpen] = useState(false)
  const [groupUserDialog, setGroupUserDialog] = useState([[], false])
  const [LeaveGroupDialog,  setLeaveGroupDialog] = useState(["", false])
  const [AddMembersToGroupDialog,  setAddMembersToGroupDialog] = useState([[], false])

  //Loading States

  const [LoadingChatList, setLoadingChatList] = useState(true)
  const [LoadingCurrentChat, setLoadingCurrentChat] = useState(true)
  const [LoadingCreateChat, setLoadingCreateChat] = useState(false)
  const [LoadingDeleteChat, setLoadingDeleteChat] = useState(false)

  //REFS

  const chatcontainerRef = useRef(null);

  const {user, setUserNotifications, userNotifications, setUser, isAuthenticated, showNotification} = useAuth()

  const {socket} = useSocket()


  const joinSocketRoom = (id) => {
    socket.emit("join_room", id)
  }

  const leaveSocketRoom = (id) => {
    socket.emit("leave_room", id)
  }


  useEffect(() => {
    if(isAuthenticated === true){
      setCurrentChatData([])
      setCurrentOppenedChat([])
    }
  }, [isAuthenticated])


  //#region Crear chat
  const createChat = async (members) => {
    try {
      setLoadingCreateChat(true)
      const res = await createChatRequest({members: members, socketID: socket.id})
      if (res.status === 200) {
        const newChat = res.data

        const updatedUserChats = [...userChats, newChat]

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

        joinSocketRoom(res.data._id)

      const messagesres = await getChatAndMessages(res.data._id, res)
      setLoadingCreateChat(false)
      showNotification("Chat creado", true)
      return newChat
      }
    } catch (error) {
      showNotification("Error creando chat", false)
    }
  }

  //#region Obtener todos los chats
  const getUserChats = async (userID) => {
    try {
      setLoadingChatList(false)
      const res = await getUserChatsRequest(userID);

      const notis = await getUserNotificationsRequest()

      setUserNotifications(notis.data.chats)



      //Hacer un .map para conectar al usuario a todos sus chats
      const jointoRooms = res.data.map(chat => {
        return joinSocketRoom(chat._id)
      })
      // Y a su propio id
      joinSocketRoom(user.id)



      setUserChats(res.data);
      setLoadingChatList(true)
    } catch (error) {
      console.error(error);
    }

  };

//#region Obtener nuevos contactos
  const getNewChats = async (page, search) => {
    try {
      const res = await getNewChatsRequest(page, search)
      console.log(res.data)
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

//#region Obtener mensajes (y chat)
  const getChatAndMessages = async (chatID, chatobject) => {
    try {
      setLoadingCurrentChat(true)
      let res;
      if(!chatobject){
       res = await getChatInfoRequest(chatID)
      } else {
        res = chatobject
      }

      if(res.data[0] === "Chat no encontrado"){
        return null;
      }

      const ChatDeletionData = user.deletedchats.filter(c => c[0] === chatID)

      const lastChatDeletion = ChatDeletionData.length > 0 ? ChatDeletionData[0][2] : null;

      console.log(lastChatDeletion)

      const messagesres = await getChatMessages(chatID, lastChatDeletion)


      const currentOC = res.data

      currentOC.messages = messagesres.data;

      console.log(currentOC, "GetChatAndMessages function")

      setCurrentOppenedChat(currentOC)

      setLoadingCurrentChat(false)

      return currentOC;

      //setCurrentOppenedChat()
    } catch (error) {
      console.error(error);
    }
  }

//#region Eliminar chat
  const deleteChat = async (chatid, date) => {
    try {
      setLoadingDeleteChat(true)
      const res = await deleteChatRequest({
        chatid,
        date
      })

      user.deletedchats = res.data;
      
      setCurrentOppenedChat([])
      setLoadingDeleteChat(false)
      setUser(user)
      console.log(user)
      showNotification("Chat eliminado", true)
    } catch (error) {
      showNotification("Error eliminando chat", false)
      return console.log(error, "deletechat")
    }


  }

//#region Editar info grupo
  const changeGroupInfo = async (data) => {

    try{
    const res = await editGroupInfoRequest(data)

    setCurrentChatData(prevChat => ({
     ...prevChat, // Copia el estado anterior
     name: res.data.name, // Actualiza el status con el valor del resultado de la solicitud
     avatarURL: res.data.avatarURL !== null ? res.data.avatarURL : prevChat.avatarURL, // Actualiza el avatarURL solo si no es nulo
     description: res.data.description
 }));

 console.log(userChats, "uwuwuwuwuwuwuwu")
 const updatedUserChats = userChats.map(chat => {

  if (chat._id === res.data.id) {
    // Actualiza el campo chatdata del chat que coincide con el chatID
    return {
      ...chat,
      chatdata: {
        ...chat.chatdata,
        name: res.data.name,
        description: res.data.description,
        avatarURL: res.data.avatarURL !== null ? res.data.avatarURL : chat.chatdata.avatarURL,
        icon: res.data.avatarURL !== null ? res.data.avatarURL : chat.chatdata.avatarURL
      }
    };
  } else {
    return chat; // Devuelve el chat sin modificar
  }
});

console.log(updatedUserChats, "2222222222222222222222222")

// Actualiza el estado con los chats modificados
setUserChats(updatedUserChats);
showNotification("Grupo actualizado", true)

    } catch(e) {
      showNotification("Error actualizando grupo", false)
    }
 }

//#region Editar mimebros grupo
 const editGroupMembers = async (data) => {
  try{
  const res = await editGroupMembersRequest(data)

  console.log(res.data)

  const updatedChats = userChats.map(chat => {
    // Verifica si este chat es el que necesitas modificar
    if (chat._id === res.data._id) {
      console.log(chat)
        // Si es así, devuelve un nuevo objeto con el atributo members actualizado
        return {
            ...chat,
            members: res.data.members
        };
    } else {
        // Si no es el chat que necesitas modificar, simplemente devuelve el chat sin cambios
        return chat;
    }
});

 setUserChats(updatedChats)
 showNotification("Miembros editados", true)
} catch(e){
  showNotification("Error en la acción", false)
  return console.log(e)
}
 }


//#region Editar Admins grupo
 const editGroupAdministrators = async (data) => {
  try{
  const res = await editGroupAdministratorsRequest(data)

  console.log(res.data)

  const updatedChats = userChats.map(chat => {
    // Verifica si este chat es el que necesitas modificar
    if (chat._id === res.data._id) {
        // Si es así, devuelve un nuevo objeto con el atributo chatdata actualizado
        return {
            ...chat,
            chatdata: {
                ...chat.chatdata,
                administrators: res.data.chatdata.administrators
            }
        };
    } else {
        // Si no es el chat que necesitas modificar, simplemente devuelve el chat sin cambios
        return chat;
    }
});

 setUserChats(updatedChats)
 setCurrentChatData({
  ...CurrentChatData,
  administrators: res.data.chatdata.administrators
});

showNotification("Administradores editados", true)
  } catch(e) {
    showNotification("Error en la acción", false)
    return console.log(e)
  }
 }


 //#region SOCKETS==========





 //#region Nuevo chat

 socket.on("newChat", (data) => {


  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);
  
if (socket.id === data.socketID) {
return console.log("SOn iguales!")
}

console.log("Nuevo chat recibido")
console.log(userChats, "userchats")

if(userChats){

const updatedUserChats =[...userChats, data.response]

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

joinSocketRoom(data.response._id)
return setUserChats(updatedUserChats);
}

  

 })

//#region Cambio de info USUARIO

 socket.on("userDataChange", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Cambio de datos de un usuario recibido");
  console.log(userChats, "userchats");

  if (userChats) {
    // Modificar los miembros de userChats cuyo .id sea igual a data.userid
    const updatedUserChats = userChats.map(group => ({
      ...group,
      members: group.members.map(member => 
        member.id === data.userid
          ? {
              ...member,
              status: data.status,
              ...(data.avatarURL !== "No change" && { avatarURL: data.avatarURL })
            }
          : member
      )
    }));

    // Actualiza el estado con el nuevo userChats modificado
    setUserChats(updatedUserChats);
  }

  if (CurrentChatData && CurrentChatData.id && CurrentChatData.type === "dm") {
    setCurrentChatData({
      ...CurrentChatData,
      description: data.status,
      ...(data.avatarURL !== "No change" && { avatarURL: data.avatarURL })
    });
  }
});



//#region Cambio de info GRUPO

socket.on("groupInfoChange", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Cambio de información de un grupo recibido");
  console.log(userChats, "userchats");

  if (userChats) {
    // Modificar los miembros de userChats cuyo .id sea igual a data.userid
    const updatedUserChats = userChats.map(chat => {

      if (chat._id === data.id) {
        // Actualiza el campo chatdata del chat que coincide con el chatID
        return {
          ...chat,
          chatdata: {
            ...chat.chatdata,
            name: data.name,
            description: data.description,
            ...(data.avatarURL !== "No change" && { avatarURL: data.avatarURL }),
            ...(data.avatarURL !== "No change" && { icon: data.avatarURL })
          }
        };
      } else {
        return chat; // Devuelve el chat sin modificar
      }
    });

    // Actualiza el estado con el nuevo userChats modificado
    setUserChats(updatedUserChats);
  }

  if (CurrentChatData && CurrentChatData.id && CurrentChatData.type === "group") {
    setCurrentChatData({
      ...CurrentChatData,
      name: data.name,
      description: data.description,
      ...(data.avatarURL !== "No change" && { avatarURL: data.avatarURL }),
      ...(data.avatarURL !== "No change" && { icon: data.avatarURL })
    });
  }
});


//#region Cambio de administradores

socket.on("groupAdministratorsChange", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Cambio de administradores de un grupo recibido");
  console.log(userChats, "userchats");


    if (userChats) {
      // Modificar los miembros de userChats cuyo .id sea igual a data.userid
      const updatedChats = userChats.map(chat => {
        // Verifica si este chat es el que necesitas modificar
        if (chat._id === data.id) {
            // Si es así, devuelve un nuevo objeto con el atributo chatdata actualizado
            return {
                ...chat,
                chatdata: {
                    ...chat.chatdata,
                    administrators: data.administrators
                }
            };
        } else {
            // Si no es el chat que necesitas modificar, simplemente devuelve el chat sin cambios
            return chat;
        }

    
    });
  
     setUserChats(updatedChats)
    }


    if (CurrentChatData && CurrentChatData.id && CurrentChatData.type === "group" && CurrentChatData.id === data.id) {
      console.log(CurrentChatData)
      setCurrentChatData({
        ...CurrentChatData,
        administrators: data.administrators
      });
    }
  

});




//#region Cambio de miembros

socket.on("membersChange", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Cambio de miembros de un grupo recibido");
  console.log(userChats, "userchats");
  console.log(user, "usuario en cambio")

  const usuarioencambio = user

if(data.id === usuarioencambio.id){
    if (userChats) {


      // Modificar los miembros de userChats cuyo .id sea igual a data.userid
      const updatedChats = userChats.map(chat => {
        // Verifica si este chat es el que necesitas modificar
        if (chat._id === data.id) {
            // Si es así, devuelve un nuevo objeto con el atributo chatdata actualizado
            return {
                ...chat,
                chatdata: {
                    ...chat.chatdata,
                    members: data.members
                }
            };
        } else {
            // Si no es el chat que necesitas modificar, simplemente devuelve el chat sin cambios
            return chat;
        }

    
    });
  
     setUserChats(updatedChats)
    

  }



    if (CurrentChatData && CurrentChatData.id && CurrentChatData.type === "group" && CurrentChatData.id === data.id) {

   
      setCurrentChatData({
        ...CurrentChatData,
        members: data.members
      });
    
    }
  }
  

});




//#region Usuario expulsado

socket.on("groupKicked", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  // Verificar si el socket ID recibido coincide con el socket ID actual
  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Usuario expulsado de un grupo recibido");
  console.log(CurrentChatData);
  console.log(CurrentOppenedChat, "oppened");

  // Verificar si userChats está definido y no es nulo
  if (userChats) {
    // Filtrar los chats para excluir el chat con el ID especificado en data.id
    const updatedChats = userChats.filter(c => c._id !== data.id);

    // Función para salir de la sala del socket
    leaveSocketRoom(data.id);

    // Actualizar el estado de userChats
    setUserChats(updatedChats);
  }

  // Verificar si el chat actual es el que se está eliminando y si cumple con las condiciones
  if (CurrentChatData && CurrentChatData.id && CurrentChatData.type === "group" && CurrentChatData.id === data.id) {
    // Utilizar callbacks para asegurarse de obtener el estado más reciente
    setCurrentOppenedChat([]);
    setCurrentChatData([]);
  }
});



//#region Usuario invitado

socket.on("groupInvited", (data) => {
  console.log('Client socket ID:', socket.id);
  console.log('Received socket ID:', data.socketID);

  if (socket.id === data.socketID) {
    return console.log("Son iguales!");
  }

  console.log(data);
  console.log("Usuario invitado a un grupo recibido");
  console.log(userChats, "userchats");


    if (userChats) {


      // Modificar los miembros de userChats cuyo .id sea igual a data.userid
      const updatedChats = [data.response, ...userChats]

      updatedChats.sort((a, b) => {
        if (a.type === "global" && b.type !== "global") {
            return -1; // a viene primero que b
        } else if (a.type !== "global" && b.type === "global") {
            return 1; // b viene primero que a
        } else {
            return 0; // no hay preferencia entre a y b
        }
    });

      joinSocketRoom(data.id)
     setUserChats(updatedChats)
    

    }
  

});
 
 



  return (
    <ChatContext.Provider value={{LoadingDeleteChat, LoadingCreateChat, setLoadingCreateChat, setLoadingCurrentChat, LoadingCurrentChat, LoadingChatList, setLoadingChatList, editGroupAdministrators, AddMembersToGroupDialog,  setAddMembersToGroupDialog, LeaveGroupDialog,  setLeaveGroupDialog, editGroupMembers, groupUserDialog, setGroupUserDialog, chatcontainerRef, messageConfigOpen, setmessageConfigOpen, changeGroupInfo, GroupConfigOpen, setGroupConfigOpen, CreateGroupDialogOpen,  setCreateGroupDialogOpen, deleteChat, DeleteChatDialogOpen,  setDeleteChatDialogOpen, ChatListDropDown, setChatListDropDown, UserConfigOpen, setUserConfigOpen, newChatsList, setNewChatsList, CurrentChatData, setCurrentChatData, CurrentOppenedChat, setCurrentOppenedChat, getChatAndMessages, InfoOpen, setInfoOpen, LeftBarShow, setLeftBarShow, userChats, setUserChats, createChat, getUserChats, getNewChats, errors, setErrors, newChatDialogOpen, setnewChatDialogOpen }}>
      {children}
    </ChatContext.Provider>
  );
}