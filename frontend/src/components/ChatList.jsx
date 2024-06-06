import React, { useEffect , useState } from 'react'
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import NewChatDialog from "./NewChatDialog"
import DeleteChatDialog from "./DeleteChatDialog"
import UserConfig from './UserConfig';
import ChatDropDown from './ChatDropDown'
import CreateGroupDialog from "./CreateGroupDialog"



function ChatList() {

    const {  getUserChats, userChats, getChatAndMessages, CurrentChatData, setCurrentChatData, LoadingChatList, setLoadingChatList } = useChat();

    const {userNotifications,user} = useAuth();

    const { LeftBarShow, setLeftBarShow } = useChat()

    const {ChatListDropDown, setChatListDropDown} = useChat(); // recordar que inicia ["", false]

    const {newChatDialogOpen,  setnewChatDialogOpen} = useChat();

    const [ChatSearch, setChatSearch] = useState("")


    //#region Click derecho a un chat




    //#region (openChatDropDown)
    const openChatDropDown = (event, chatid) => {
      event.preventDefault()
      setChatListDropDown([chatid, true])
      const dropdown = document.getElementById('chatdropdown');

      dropdown.style.left = event.clientX + 175 + "px"
      dropdown.style.top = event.clientY - 3 + "px"
    }



    //#region Abrir chat (click izq)
    const openChat = (chatid, chatdata) => {
      if(window.innerWidth < 1270){
        setLeftBarShow(!LeftBarShow)
        }

       

        if(CurrentChatData.id && CurrentChatData.id !== chatid){
          getChatAndMessages(chatid)
          setCurrentChatData(chatdata)
          return;
        }

        if(!CurrentChatData.id){
          getChatAndMessages(chatid)
          setCurrentChatData(chatdata)
          return;
        }





    }


    //#region Convertir hora mongodb
    const convertTo12HourFormat = (dateString) => {

      if(dateString.length < 1){
        return ""
      }

      const createdAt = new Date(dateString);
      let hours = createdAt.getHours();
      const minutes = createdAt.getMinutes();
      let ampm = 'am';
    
      // Convertir horas a formato de 12 horas y establecer AM/PM
      if (hours >= 12) {
        ampm = 'pm';
      }
      if (hours > 12) {
        hours -= 12;
      }
    
      // Formatear los minutos con un cero delante si es necesario
      const formattedMinutes = String(minutes).padStart(2, '0');
    
      // Construir la cadena de tiempo en formato de 12 horas
      const time12Hours = `${hours}:${formattedMinutes} ${ampm}`;
    
      return time12Hours;
    }


  /*  useEffect(() => {
      console.log(user)
      console.log(userChats)
    }, []) */


    //#region (f)Verificar si está eliminado
    function verificarChatEliminado(chatid, mongoTimestamp){

      if(ChatSearch.length > 0){
        return false;
      }

      if(!mongoTimestamp && mongoTimestamp.length < 1){
        mongoTimestamp = "2020-05-07T05:02:44.037Z"
      }

      // Busca el índice del elemento con el mismo chatid en el array deletedchats
const existingIndex = user.deletedchats.findIndex(entry => entry[0] === chatid);

// Verifica si ya existe un elemento con el mismo chatid
if (existingIndex !== -1) {

  const coincidence = user.deletedchats.filter(c => c[0] === chatid)


  // Si existe, actualiza el segundo elemento del array
     //funcion para verificar si el tiempo del ultimo mensaje del chat es anterior a la fecha de eliminación del chat.
     const mongoDate = new Date(mongoTimestamp);
     const now = parseInt(coincidence[0][1]);
     return mongoDate < now;
} else {
  // Si no existe, agrega el nuevo array completo
  return false;
}
    }


//#region Inicio componente
  return (
    <section className="chats">


     <UserConfig/>

    <CreateGroupDialog/>

  <NewChatDialog/>

  <DeleteChatDialog/>


 {LoadingChatList === false ? (
  <>
  {
    //#region Skeleton loading
  }
<div className="loader mediumsize my-5"></div>

<React.Fragment>
      {[...Array(5)].map((_, index) => (
        <a className="chat" key={index}>
          <div className="pfp Loading"><img src="" alt="" /></div>
          <main>
            <div className="info1">
              <div className="name Loading">Nombre de usuario</div>
              <div className="hora Loading">00:00pm</div>
            </div>
            <div className="info2">
              <div className="message Loading">Loading_________________________________________________</div>
            </div>
          </main>
        </a>
      ))}
    </React.Fragment>

  </>
 ) : (



<>
{
  //#region Verificar si hay contactos
}
    {userChats.length === 0 ? (
   <>
     <div className="flex flex-col gap-1 text-center">
       <a  onClick={() => {setnewChatDialogOpen(!newChatDialogOpen)}} className="hover px-4 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-600">Agregar contacto</a>
     </div>
   </>
 ) : (
   <>

    {
      //#region Map de chats
    }
   { userChats && 
   userChats.map((u, index) => {

    let notuser = u.members ? u.members.filter(m => m.id != user.id)[0] : null;
    

    //#region Definicion de chatdata
   // console.log(notuser, "notuser")
    let chatdata = u.chatdata.name === null ? (
        {
            id: u._id,
            name: notuser.username,
            avatarURL: u.type === "dm" ? notuser.avatarURL : u.chatdata.icon,
            description: u.type === "dm" ? notuser.status : u.chatdata.description,
            lastMessageID: u.chatdata.lastMessageID,
            lastMessage: u.chatdata.lastMessage,
          
            lastMessageCreatedAt: u.chatdata.lastMessageCreatedAt,
            lastMessageSentBy: u.chatdata.lastMessageSentBy
        }
    ) : u.chatdata

    chatdata.id = u._id

    chatdata.lastMessageDeleted = u.chatdata.lastMessageDeleted ? u.chatdata.lastMessageDeleted : false;

    console.log(chatdata.lastMessageDeleted)

    const compareMembers = (a, b) => {
      // Verifica si el propietario del chat tiene la ID
      const isAOwner = u.chatdata.owner === a.id;
      const isBOwner = u.chatdata.owner === b.id;
  
      // Si a es propietario pero b no lo es, a debe ir primero
      if (isAOwner && !isBOwner) {
          return -1;
      }
      // Si b es propietario pero a no lo es, b debe ir primero
      else if (!isAOwner && isBOwner) {
          return 1;
      }
      // Verifica si a es administrador
      const isAAdmin = u.chatdata.administrators.includes(a.id);
      // Verifica si b es administrador
      const isBAdmin = u.chatdata.administrators.includes(b.id);
  
      // Si a es administrador pero b no lo es, a debe ir primero
      if (isAAdmin && !isBAdmin) {
          return -1;
      }
      // Si b es administrador pero a no lo es, b debe ir primero
      else if (!isAAdmin && isBAdmin) {
          return 1;
      }
      // En cualquier otro caso, no cambia el orden
      else {
          return 0;
      }
  };

    chatdata.members = u.members === null ? null : u.type === "group" ? u.members.sort(compareMembers) : u.members

        chatdata.administrators = u.type === "group" ? u.chatdata.administrators : null;

    chatdata.type = u.type

    chatdata.avatarURL = chatdata.avatarURL === null || (!chatdata.avatarURL && !chatdata.icon) ? (u.type !== "dm" ? "https://cdn.pixabay.com/photo/2016/11/14/17/39/group-1824145_640.png" : "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png") : (!chatdata.avatarURL ? chatdata.icon : chatdata.avatarURL)


    const foundChat = userNotifications ? userNotifications.find(chat => chat.chatid === chatdata.id) : null
    if(u.type === "group"){
     // console.log(chatdata)
    }

    const ChatEliminado = verificarChatEliminado(chatdata.id, chatdata.lastMessageCreatedAt)
  //  console.log(chatdata, "chatdata")

   if(ChatEliminado !== true || u.type === "global"){
    return (

      <React.Fragment key={index}>
        {
          //#region Cada uno de los chats
        }
      { chatdata.name.toLowerCase().includes(ChatSearch) && (
      <a onContextMenu={(e) => openChatDropDown(e, u._id)} onClick={() => openChat(u._id, chatdata)} className={`chat hover ${CurrentChatData.id && CurrentChatData.id === u._id ? "chatTargetted" : ""}`}>

        

       <div className="pfp"><img src={chatdata.avatarURL} alt="" /></div>
       
       <main>
       <div className="info1">
         <div className="name">{chatdata.name}</div>
         
         <div className="hora">{convertTo12HourFormat(chatdata.lastMessageCreatedAt)}</div>
         </div>
 
         <div className="info2">
         <div className="message">
          {
            //#region Formato grupos
          }
         {u.type !== "dm" && chatdata.lastMessage.length >= 0 && (
          <>
          {chatdata.lastMessageDeleted && chatdata.lastMessageDeleted === true ? (
         <>
         <p className="text deleted"><i className="ri-chat-delete-line"></i> Mensaje eliminado</p>
         </>
          ) : (
                   <>
                   {chatdata.lastMessageSentBy && (
                     <b>{chatdata.lastMessageSentBy === user.username ? "Tú: " : `${chatdata.lastMessageSentBy}: `}</b>
                   )}
                   {chatdata.lastMessage}
                 </>
          )}
            </> 
)}


{
  //#region Formato dm
}
{u.type === "dm" && chatdata.lastMessage.length >= 0 && (
  <>
             {chatdata.lastMessageDeleted && chatdata.lastMessageDeleted === true ? (
         <>
         <p className="text deleted"><i className="ri-chat-delete-line"></i> Mensaje eliminado</p>
         </>
          ) : (
                   <>
                   {chatdata.lastMessage}
                 </>
          )}
  </>
)}
          </div>
          { u.type !== "global" && 

         <>
         {userNotifications && userNotifications.length > 0 && foundChat && (
      <div className="quantity">{foundChat.quantity}</div>
    )}
        </>
      }
         </div>
        
       </main>
     </a>
     )}


     { u.type === "global" && 

<>
{
  //#region Barra de busqueda
}
{userChats && userChats.length > 1 ? (
<div className="chatlistsearch">
<input onChange={(e) => {setChatSearch(e.target.value.toLowerCase())}} type="text" name="chatlistsearch" id="chatlistsearch" placeholder='Buscar' />
<i className="icon ri-search-line"></i>
</div>
) : (
  <>
  <div className="flex flex-col gap-1 text-center">
    <a  onClick={() => {setnewChatDialogOpen(!newChatDialogOpen)}} className="hover px-4 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-600">Agregar contacto</a>
  </div>
</>
)}
</>

     }
     </React.Fragment>
     
     )
    }
   })
   
}
 
    
   </>
 )}
 </>
  )}
 
     
 
    </section>
  )
}

export default ChatList