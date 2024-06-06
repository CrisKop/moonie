import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

function DropDown() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { ChatListDropDown, setChatListDropDown, userChats, LeaveGroupDialog,  setLeaveGroupDialog} = useChat(); // recordar que inicia ["", false]
  // Primer string es la id del chat, y false es que no está abierto

  const {DeleteChatDialogOpen,  setDeleteChatDialogOpen} = useChat();

  const [isGroup, setIsGroup] = useState(false)

  const [isOwner, setIsOwner] = useState(false)


  const openDeleteChatDialog = () => {
    setDeleteChatDialogOpen(true)
    setChatListDropDown([ChatListDropDown, false])
  }




  // Función para establecer la posición del DropDown


  useEffect(() => {
    const handleClickOutside = (event) => {
      const element = document.getElementById('chatdropdown');

      if(element === null) return;

      // Verificar si el clic ocurrió fuera del elemento específico
      if (!element.contains(event.target)) {
        // El clic ocurrió fuera del elemento, ejecutar la acción deseada
        setChatListDropDown([ChatListDropDown[0], false]);
      }
    };

    // Agregar un event listener para detectar clics en todo el documento
    document.addEventListener('click', handleClickOutside);

    // Eliminar el event listener al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    
    if(ChatListDropDown[0].length < 1) return;

    const chatfound = userChats.find(chat => chat._id === ChatListDropDown[0])

    const chattype = chatfound ? chatfound.type : null;

    const isOwner = chatfound ? (chatfound.chatdata.owner === user.id ? true : false) : null;

    if(chattype === "group"){
      setIsGroup(true)
    } else {
      setIsGroup(false)
    }

    if(isOwner === true){
      setIsOwner(true)
    } else {
      setIsOwner(false)
    }

    console.log(ChatListDropDown)
  }, [ChatListDropDown])


  const openLeaveDialog = async () => {
    setLeaveGroupDialog([LeaveGroupDialog[0], true])
    setChatListDropDown([ChatListDropDown[0], false]);
  }


  return (
    <div id="chatdropdown" style={{ display: ChatListDropDown[1] === true ? 'block' : 'none' }}>
      <ul className="menu">

        
        {isGroup === false ? (
          <>
        <li onClick={openDeleteChatDialog} className="menu-item">
          <button>Eliminar chat</button>
        </li>
        </>
        ) : (
          <>
          {isOwner !== true && (
          <li onClick={openLeaveDialog} className="menu-item">
          <button>Salir del grupo</button>
        </li>
          )}
        </>
        )}
      </ul>
    </div>
  );
}

export default DropDown;
