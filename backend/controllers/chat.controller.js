import Chats from '../models/chats.model.js';
import {getUserData, get10Users, deletechat, getUsername} from '../controllers/auth.controller.js';
import {io} from '../app.js'




export const createChat = async(req,res) => {
  const {members, socketID} = req.body;
  const creator = req.user.id;

  const notcreator = members.filter(m => m !== creator)

  try {
  /*  const chat = await Chats.findOne({
      members: { $all: members}
    })

    if(chat) {

      const chatMembersData = await Promise.all(chat.members.map(async member => {
        return await getUserData(member);
    }));
  
    chat.members = chatMembersData;
      return res.status(200).json(chat);
    }
    */

    const type = members.length < 3 ? "dm" : "group"

    const newChat = new Chats({
      type,
      chatdata: type === "dm" ? {name: null, icon: null, description: null, lastMessage: "", lastMessageCreatedAt: ""} : {name: "Nuevo grupo", owner: req.user.id, administrators: [], description: "", icon: "", lastMessage: "", lastMessageCreatedAt: ""},
      members: members
    })

    const response = await newChat.save();

    const chatMembersData = await Promise.all(response.members.map(async member => {
      return await getUserData(member);
  }));

  response.members = chatMembersData;

  notcreator.forEach(m => {
    console.log(m.toString(), "hola")
    io.to(m.toString()).emit("newChat", {response, socketID})
  })

    return res.status(200).json(response);
  } catch (error) {
    console.log(error)
    return res.status(500).json(["Error al crear chat"]);
  }
}

export const findUserChats = async (req, res) => {
    const userid = req.user.id;

    try {
        const chats = await Chats.find({
          $or: [
            { members: userid },
            { type: "global" }
        ]
    });

    if (!chats.length) {
      return res.status(200).json([]);
  }

    chats.sort((a, b) => {
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

    

    chats.sort((a, b) => {
      if (a.type === "global" && b.type !== "global") {
          return -1; // a viene primero que b
      } else if (a.type !== "global" && b.type === "global") {
          return 1; // b viene primero que a
      } else {
          return 0; // no hay preferencia entre a y b
      }
  });

        const allChats = [];

        for (const chat of chats) {
          if(!chat.members) {allChats.push(chat); } else {
            const chatMembersData = await Promise.all(chat.members.map(async member => {
                return await getUserData(member);
            }));

            chat.members = chatMembersData;
            allChats.push(chat);
          }
        }

        // Enviamos todos los chats poblados en la respuesta
        return res.status(200).json(allChats);
    } catch (error) {
        console.log(error);
        return res.status(500).json(["Error encontrando chats de usuario"]);
    }
}




export const findChat = async(req,res) => {
  const {chatid} = req.query

  try {
    const chat = await Chats.findOne({ _id: chatid})

    if(!chat) return res.status(200).json(["Chat no encontrado"]);

    return res.status(200).json(chat)
    
  } catch (error) {
    console.log(error);
    return res.status(500).json(["Error en busqueda de chat"]);
  }
}

export const findChatFunc = async(chatid) => {

  try {
    const chat = await Chats.findOne({ _id: chatid})

    if(!chat) return null;

    return chat;
    
  } catch (error) {
    console.log(error);
    return null;
  }
}


export const findNewUsers = async(req, res) => {
  const {page, search} = req.query;
  const currentUser = req.user.id; // Obtiene el ID del usuario actual

  try {
    const result = await get10Users(page, search, currentUser);

    if(result === null){
      return res.status(500).json(["No hay mas usuarios"]);
    }

    
    // Busca chats donde el usuario actual y los usuarios encontrados en result estén presentes
    const chats = await Chats.find({
        members: { $in: req.user.id } // Busca chats donde el usuario actual y los usuarios encontrados en result estén presentes
    });

    console.log(chats)
    
 

    const usersWithChats = result.filter(user => {
      return !chats.some(chat => {
          const chatMembers = chat.members.map(member => member.toString());
          return chatMembers.includes(user._id.toString());
      });
  });

    return res.status(200).json(usersWithChats)
  } catch (error) {
    console.log(error);
    return res.status(500).json(["Error buscando 10 nuevos usuarios"]);
  }
}


export const updateLastMessage = async(chatID, message, createdAt, senderID, messageid, deleted) => {
try {

  const senderusername = await getUsername(senderID)

  const chat = await Chats.findOneAndUpdate(
    { _id: chatID }, 
    {     $set: { 
      'chatdata.lastMessageID': messageid,
      'chatdata.lastMessage': message,
      'chatdata.lastMessageDeleted': deleted,
      'chatdata.lastMessageCreatedAt': createdAt,
      'chatdata.lastMessageSentBy':senderusername,
  }
}, 
    { new: true }
);
  if(!chat) return null;

  return chat;
} catch (error) {
  console.log(error)
  return ["Error actualizando mensaje (error catch)"]
}
}


export const userChatDelete = async (req, res) => {
  const userid = req.user.id;
  const {chatid} = req.body;


  const request = await deletechat(userid, chatid.chatid, chatid.date);

  if(request === null){
    return res.status(500).json(["No se eliminó el chat"]);
  }

  return res.status(200).json(request)
}


export const editGroupInfo = async (req, res) => {
  let { name, description, chatid, socketID } = req.body;

  description = description === "No hay una descripción actualmente." ? "" : description
  
  // Verificar si se proporcionó un archivo
  let imageUrl = '';
  if (req.file) {
    // Si se proporcionó un archivo, obtener la URL de Cloudinary
    imageUrl = req.file.path; // En CloudinaryStorage, el campo 'path' contiene la URL del archivo en Cloudinary
  } else {
    // Si no se proporcionó un archivo, puedes manejarlo según tus necesidades. Por ejemplo, puedes asignar una imagen predeterminada.
    imageUrl = ""
  }



  // Actualizar la información del usuario en la base de datos
  try {

    if(imageUrl.length < 1){
      const updatedUserStatus = await Chats.updateOne({
         _id: chatid 
        }, 
        { 
          $set: {
             'chatdata.name': name,
             'chatdata.description': description,
            }
         });
         io.to(chatid.toString()).emit("groupInfoChange", {  socketID: socketID, id: chatid, name: name, description: description, avatarURL: "No change" })
      return res.status(200).json({ id: chatid, name: name, description: description, avatarURL: null });
    }

    const updatedUserStatus = await Chats.updateOne({
      _id: chatid 
     }, 
     { 
       $set: {
          'chatdata.name': name,
          'chatdata.description': description,
          'chatdata.icon': imageUrl
         }
      });
      io.to(chatid.toString()).emit("groupInfoChange", {  socketID: socketID, id: chatid, name: name, description: description, avatarURL: imageUrl })
    return res.status(200).json({ id: chatid, name: name, description: description, avatarURL: imageUrl });
   
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error updating group information.' });
  }
};




export const editGroupMembers = async(req, res) => {
  const {process, chatid, memberid, socketID} = req.body;

  console.log(process)

  try {
    
    if(!process)  return res.status(500).json({ error: 'No especificado el proceso' });
  
    if(process.length < 1)  return res.status(500).json({ error: 'Proceso no especificado correctamente' });
  
    if(process === "remove"){

      const chatreq = await Chats.findById(chatid)

      if(!chatreq) return res.status(500).json({ error: 'Chat no encontrado' });

      let updatedMembers = chatreq.members.filter(m => m !== memberid)

      chatreq.members = updatedMembers

      const end = await chatreq.save();


          const chatMembersData = await Promise.all(end.members.map(async member => {
              return await getUserData(member);
    }));

          end.members = chatMembersData;

          io.to(memberid.toString()).emit('groupKicked', { socketID: socketID, id: chatid})
          io.to(chatid.toString()).emit("membersChange", { socketID: socketID, id: chatid, members: chatMembersData})
      return res.status(200).json(end)

    }


    if(process === "add"){
    
      const chatreq = await Chats.findById(chatid)

      if(!chatreq) return res.status(500).json({ error: 'Chat no encontrado' });

      console.log(chatreq.members)
      let updatedMembers = [...chatreq.members, ...memberid]

     chatreq.members = updatedMembers

      const end = await chatreq.save();


          const chatMembersData = await Promise.all(end.members.map(async member => {
              return await getUserData(member);
    }));

          end.members = chatMembersData;


          io.to(chatid.toString()).emit("membersChange", {  process: process , socketID: socketID, id: chatid, members: chatMembersData})

          memberid.map(m => {
            io.to(m.toString()).emit('groupInvited', { socketID: socketID, id: chatid, response:end})
          })
    
      return res.status(200).json(end)
    }



    res.status(500).json({ error: 'Invalid process' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'No se pudo editar miembros' });
  }
}




export const editGroupAdministrators = async(req, res) => {
  const {process, chatid, memberid, socketID} = req.body;

  console.log(process)

  try {
    
    if(!process)  return res.status(500).json({ error: 'No especificado el proceso' });
  
    if(process.length < 1)  return res.status(500).json({ error: 'Proceso no especificado correctamente' });
  
    if (process === "remove") {
      try {
          const updatedChat = await Chats.findOneAndUpdate(
              { _id: chatid },
              { $pull: { "chatdata.administrators": memberid } },
              { new: true }
          );
  
          if (!updatedChat) {
              return res.status(500).json({ error: 'Chat no encontrado' });
          }
  
          io.to(chatid.toString()).emit("groupAdministratorsChange", {  socketID: socketID, id: chatid, administrators: updatedChat.chatdata.administrators})
          return res.status(200).json(updatedChat);
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: 'Error al actualizar el chat' });
      }
  }


    if (process === "add") {
      try {
          const updatedChat = await Chats.findOneAndUpdate(
              { _id: chatid },
              { $push: { "chatdata.administrators": memberid } },
              { new: true }
          );
  
          if (!updatedChat) {
              return res.status(500).json({ error: 'Chat no encontrado' });
          }


          console.log(updatedChat)
  
          io.to(chatid.toString()).emit("groupAdministratorsChange", {  socketID: socketID, id: chatid, administrators: updatedChat.chatdata.administrators})
          return res.status(200).json(updatedChat);
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: 'Error al actualizar el chat' });
      }
  }


  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'No se pudo editar administradores' });
  }
}

