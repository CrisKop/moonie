import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext"
import { Link } from "react-router-dom";
import DropDown from "../components/ConfigDropDown"
import { useAuth } from "../context/AuthContext"
import ChatList from "../components/ChatList";
import CurrentChat from "../components/CurrentChat";
import SendMessageForm from "../components/SendMessageForm";
import RightBar from "../components/RightBar";
import ChatDropDown from "../components/ChatDropDown"
import ChatNav from "../components/ChatNav";
import MessageDropDown from "../components/MessageDropDown"

function ChatPage() {
  const { getUserChats, createChat, userChats } = useChat();
  const { InfoOpen, setInfoOpen } = useChat()
  const { LeftBarShow, setLeftBarShow } = useChat()
  const {isAuthenticated, user, loading, notificationRef, NotificationData, setNotificationData} = useAuth();
  const {UserConfigOpen, setUserConfigOpen} = useChat();


  //#region Obtener chats al cargar
  useEffect(() => {
     
    async function getUserChatsAtLoad(){
      getUserChats({"userID":user.id})
    }
    getUserChatsAtLoad()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setInfoOpen(false)
    }, 1);

  }, [])


  useEffect(() => {
    // Función de manejo de redimensionamiento de la ventana
    const handleResize = () => {

     if(window.innerWidth < 1279){
        setLeftBarShow(false)
      }
    };

    handleResize()

    if(window.innerWidth < 1279){
      setLeftBarShow(true)
    } 

  }, []); // Se ejecuta solo una vez al montar el componente


  //#region Barra derecha useEffect
    useEffect(() => {
      var InfoContainer = document.querySelector('.rightbar');
      var backbtn = document.getElementById('rightbarBack')

      InfoContainer.style.display = InfoOpen === true ? 'flex' : 'none';
      backbtn.style.display = InfoOpen === true ? 'flex' : 'none';
    }, [InfoOpen])

//#region Barra izquierda useEffect
    useEffect(() => {
      var rightbarBack = document.getElementById('rightbarBack')
      var ChatsContainer = document.getElementById('chatcontainer')

      rightbarBack.classList.contains('movechat') ? rightbarBack.classList.remove('movechat') : rightbarBack.classList.add('movechat')
      ChatsContainer.classList.contains('movechat') ? ChatsContainer.classList.remove('movechat') : ChatsContainer.classList.add('movechat')
    }, [LeftBarShow])

    
    const userAvatar = user.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : user.avatarURL

    const openUserConfig = () => {
      setUserConfigOpen(!UserConfigOpen)
  }


  //#region Inicio componente
  return (

    <section className="chatContainer">



    <div className="notification" ref={notificationRef}>
      {NotificationData[1] === true ? (
        <div className="check">
           <i className="text-white ri-checkbox-circle-fill"></i>
           <p>{NotificationData[0]}</p>
        </div>
      ) : (
        <div className="error">
            <i className="text-white ri-error-warning-fill"></i>
            <p>{NotificationData[0]}</p>
        </div>
      )}
    </div>
   
<section className="leftbar">


{ loading === false ? (
    <div className="profilenav">
      
      <div className="pfp hover" onClick={openUserConfig}><img src={userAvatar} alt="" /></div>

      <section className="buttonsContainer">
      <DropDown/>
      </section>
    </div>
) : (
  <div className="profilenav">
      
  <div className="pfp hover Loading"> <img src="" alt="" /></div>
</div>
)}



    <ChatList/>

    <ChatDropDown/>

   </section>

   <section className="opennedChat" id="chatcontainer">

 
<ChatNav/>


  <CurrentChat />


  <MessageDropDown/>
 
 
     <SendMessageForm/>
  

   </section>
   


    <RightBar/>
    
  
    </section>
  )
}

export default ChatPage