import React, {useEffect, useState} from 'react'
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import DeleteMessageDialog from './DeleteMessageDialog'
import { useMessage } from '../context/MessageContext';
import RetrySendingDialog from './RetrySendingDialog'

function CurrentChat() {

    const { CurrentOppenedChat } = useChat();

    const {user, userNotifications, clearUserNotifications} = useAuth();

    const { InfoOpen, setInfoOpen, CurrentChatData, setCurrentChatData, chatcontainerRef, LoadingCurrentChat, LeftBarShow, setLeftBarShow } = useChat()

    const { MessageDropDown, setMessageDropDown, EditingMessage, setEditingMessage} = useMessage(); // recordar que inicia ["", false]



    //#region Mensaje temporal
    useEffect(() => {
      if(CurrentOppenedChat.length === 0 ) return;
      if(CurrentOppenedChat.messages.length === 0) return;
      const newMessages = CurrentOppenedChat.messages; // Obtén los nuevos mensajes del contexto
      const messagedata = newMessages[newMessages.length - 1]; // Obtén el último mensaje agregado
  
      const chatcontainer = document.getElementById('chat');
      if (chatcontainer) {
        const newMessage = chatcontainer.querySelector(`[message-id="${messagedata._id}"]`);

      if(!messagedata._id.includes("temporal-")) {
        if(newMessage && newMessage.classList.contains("semitransparent")){
          newMessage.classList.remove('semitransparent')
        }
        return;
      }


        if (newMessage) {
          newMessage.classList.add('semitransparent'); // Agrega la clase al nuevo mensaje
        }
      }
    
    }, [CurrentOppenedChat.messages]); 



    //#region openMessageDropDown
    const openMessageDropDown = (event, message, ownornot) => {
      event.preventDefault()

      if(message.deleted === true) return;

      if(ownornot !== "ownmessage") return;
      setMessageDropDown([message._id, true, message])
      const dropdown = document.getElementById('messagedropdown');

      dropdown.style.left = event.clientX - 15 + "px"
      dropdown.style.top = event.clientY - 3 + "px"
    }

    const handleInfoOpen = () => {
      setInfoOpen(!InfoOpen)
    }

  

    //#region Convertir hora mongodb
    const convertTo12HourFormat = (dateString) => {
      const createdAt = new Date(dateString);
      let hours = createdAt.getHours();
      const minutes = createdAt.getMinutes();
      let ampm = 'AM';
    
      // Convertir horas a formato de 12 horas y establecer AM/PM
      if (hours >= 12) {
        ampm = 'PM';
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


    //#region Scroll hasta abajo
    useEffect(() => {
       console.log(CurrentOppenedChat, "Current Chat state changed")

       scrollToBottom();
 
    
       // Función para desplazar el chat hasta el final
       function scrollToBottom() {
           var chatContainer = document.getElementById('chat');
           chatContainer.scrollTop = chatContainer.scrollHeight;
       }

       if(window.innerWidth < 1280 && CurrentOppenedChat.length < 1){




      setLeftBarShow(true)
        
      }

      if(CurrentOppenedChat._id && userNotifications){

        const CurrentChatInNotifications = userNotifications.filter(n => n.chatid === CurrentOppenedChat._id)
        
        if(CurrentChatInNotifications){
        clearUserNotifications(CurrentOppenedChat._id)
        }

      }

    }, [CurrentOppenedChat])


    //#region CurrentChatData vh change
    useEffect(() => {

   
      var chat = document.getElementById("chat")

      if(CurrentChatData.length === 0){
        chat.style.height = "100vh"
      } else {
        if(window.innerWidth < 1280) {
         chat.style.height = "calc(100vh - 185px)"
          //chat.style.height = "calc(100vh - 130px)"
        } else {
        chat.style.height = "calc(100vh - 130px)"
        }
      }

       if(EditingMessage === true){
        setEditingMessage(false)
      }
     
    }, [CurrentChatData])


   //#region chat zone edit vh change
    useEffect(() => {

      if(EditingMessage === true){
        var chat = document.getElementById("chat")
        chat.style.height = "calc(100vh - 170px)"
      } else {
        var chat = document.getElementById("chat")

        if(CurrentChatData.length === 0){
          chat.style.height = "100vh"
        } else {

          if(window.innerWidth < 1280){
           // chat.style.height = "calc(100vh - 130px)"
             chat.style.height = "calc(100vh - 185px)"
          }else {
        chat.style.height = "calc(100vh - 130px)"
          }
        }
      }
    }, [EditingMessage])


    //#region Colores por nombre
    function textoAColorHex(texto) {
      // Generar un valor hash único basado en el texto
      let hash = 0;
      for (let i = 0; i < texto.length; i++) {
          hash = texto.charCodeAt(i) + ((hash << 5) - hash);
      }
  
      // Convertir el hash a un color hexadecimal
      let color = "#";
      for (let j = 0; j < 3; j++) {
          let value = (hash >> (j * 8)) & 0xFF;
          value = Math.floor(value * 0.7 + 0x40); // Asegura una tonalidad más clara
          color += ("00" + value.toString(16)).substr(-2);
      }
  
      return color;
  }

    let diaDeEnvio = "";
    
 
  return (

   <section className="chat" id="chat" ref={chatcontainerRef}>

    <DeleteMessageDialog/>

    <RetrySendingDialog/>

{
  //#region Presentacion
}
    {CurrentChatData.length === 0 && (
      <>
      <section className="presentation">
    


      <main>
      <div className="logo">
        <img src="/img/moonie.png" alt="" />
        </div>
        <h1>
          {"Zona de inicio de Moonie"}
        </h1>


        <p>
          Aplicación en ALPHA, desarrollado por CrisKop
        </p>

        <div className="icons">
        <a href="https://github.com/CrisKop" target="_blank" rel="noopener noreferrer"><i className="hover ri-github-fill"></i></a>
        <a href="https://www.instagram.com/gold_cris__/" target="_blank" rel="noopener noreferrer"><i className="hover ri-instagram-line"></i></a>
        </div>
        </main>


        <main>
        <p>Si te interesa unirte a la comunidad y ayudar, únete al servidor de discord</p>
        <iframe src="https://discord.com/widget?id=1248059298131480666&theme=dark" width="350" height="300" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
        </main>

        <h3>
          <i className="ri-git-repository-private-line"></i>
        {"Moonie no te pedirá credenciales de otros sitios"}
        </h3>
      </section>
      </>
    )}
    

    {LoadingCurrentChat === true && CurrentChatData.length !== 0 ? (
      <>
    {
      //#region Skeleton loading
    }

      {[...Array(10)].map((_, index) => (
        <div key={index}  className="oppenedchatmessage" style={{ minWidth: "240px", alignSelf: Math.random() > 0.5 ? 'flex-end' : 'flex-start' }}>
        <div className="messagedata Loading">
        <div className="messageinfo">
        
    <p className="text">____________________</p>
    <p className="hora">00:00 pm</p>

        </div>
      </div>
      </div>
      ))}

<div className="loader"></div>
      </>
    ) : (
    <>
    {
      //#region Inicio de chat (sin mensajes)
    }
    {CurrentOppenedChat.messages && CurrentOppenedChat.messages.length === 0 ? (
    <div onClick={handleInfoOpen} className={`hover ${CurrentChatData.name ? "chatstart" : "hidden"}`}>
    {CurrentChatData.length !== 0 && (
      <>
        <div className="pfp">
          <img src={CurrentChatData.avatarURL} alt="" />
        </div>
        <main>
          <h1 className="selectable chatname">{CurrentChatData.name}</h1>
          <p className="selectable texto">Este es el inicio del chat!</p>
        </main>
      </>
    )}
  </div>
    ):(
      <>
  {
    //#region Inicio de chat con mensajes
  }
<div onClick={handleInfoOpen} className={`hover ${CurrentChatData.name ? "chatstart" : "hidden"}`}>
  {CurrentChatData.length !== 0 && (
    <>
      <div className="pfp">
        <img src={CurrentChatData.avatarURL} alt="" />
      </div>
      <main>
        <h1 className="selectable chatname">{CurrentChatData.name}</h1>
        <p className="selectable texto">Este es el inicio del chat!</p>
      </main>
    </>
  )}
</div>

{ CurrentOppenedChat.messages &&
CurrentOppenedChat.messages.map((m, index) => {

  const ownornot = m.senderID ? (m.senderID._id === user.id ? "ownmessage" : "notownmessage") : "notownmessage"

  const obtenerDiaDeEnvio = (createdAt) => {
    const fecha = new Date(createdAt);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-ES', { month: 'long' });
    return `${dia} de ${mes}`;
  };

  let mensajeDiaDeEnvio = obtenerDiaDeEnvio(m.createdAt)

  

  if(diaDeEnvio.length < 1){
    diaDeEnvio = "primerdia"
  }

  const avatar =  m.senderID ? (m.senderID.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : m.senderID.avatarURL) : "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png"

  return (
    <React.Fragment key={index}>


    {diaDeEnvio !== mensajeDiaDeEnvio && (
      <div className="nuevoDia">
        <div className="lineaizq"></div>
        <p>
      {
         diaDeEnvio = mensajeDiaDeEnvio
      }
       </p>

       <div className="lineader"></div>
      </div>
    )}



    <div onContextMenu={(e) => openMessageDropDown(e, m, ownornot)} key={index} className={`oppenedchatmessage ${ownornot}`}>
    

    {CurrentOppenedChat.type !== "dm" && m.senderID && m.senderID._id !== user.id && (
    <div className="pfp"><img src={avatar} alt="" /></div>
  )}


  {
    //#region Message data
  }
    <div className="messagedata">


    {CurrentOppenedChat.type !== "dm" && m.senderID && m.senderID._id !== user.id && (
      <h1 className="sendername" style={{ color: textoAColorHex(m.senderID.username) }}>
    {m.senderID.username}
</h1>
    )}

  { m.files !== null && 
   <div className="messageImage"><img src="https://media.istockphoto.com/id/1283442304/es/vector/icono-vectorial-de-personas-multitudinizas-pictograma-de-grupo-de-personas-silueta-negra-del.jpg?s=612x612&w=0&k=20&c=93vzHD2xsk7yK61JMvsUcPF-LIphOdmQod-t-i-KgoI=" alt="" /></div>}
 
    
    <div className="messageinfo" message-id={m._id}>
      {m.deleted !== true && m.edited !== true && (
        <>
    <p className="selectable text">{m.message}</p>
    <p className="hora">{convertTo12HourFormat(m.createdAt)}</p>
    </>
      ) }
      
      {m.deleted === true && (
        <p className="text deleted"><i className="ri-chat-delete-line"></i> Mensaje eliminado</p>
      )
    }

{m.edited === true && m.deleted !== true && (
                <>
                <p className="selectable text">{m.message}</p>
                <p className="hora">{convertTo12HourFormat(m.createdAt)}<br></br>Editado</p>
                </>
      )
    }

    
    </div>

    </div>
    
  </div>  
  </React.Fragment>
  )

})
}


    </>
    )}
    </>
    )}

    </section>
 
    
  
  )}

export default CurrentChat