import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useMessage } from '../context/MessageContext';

function DropDown() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { MessageDropDown, setMessageDropDown} = useMessage(); // recordar que inicia ["", false]
  // Primer string es la id del chat, y false es que no está abierto
  const {EditingMessage, setEditingMessage} = useMessage();

  const {DeleteMessageDialogOpen,  setDeleteMessageDialogOpen} = useMessage();


  const openDeleteMessageDialog = () => {
    setDeleteMessageDialogOpen(true)
    setMessageDropDown([MessageDropDown[0], false, MessageDropDown[2]])
  }

  const editMessage = async () => {
    setEditingMessage(true)
    setMessageDropDown([MessageDropDown[0], false, MessageDropDown[2]])

    var messageInput = document.getElementById('messageInput')

    messageInput.value = MessageDropDown[2].message;
    messageInput.focus();
  }


  // Función para establecer la posición del DropDown


  useEffect(() => {
    const handleClickOutside = (event) => {
      const element = document.getElementById('messagedropdown');

      if(element === null) return;

      // Verificar si el clic ocurrió fuera del elemento específico
      if (!element.contains(event.target)) {
        // El clic ocurrió fuera del elemento, ejecutar la acción deseada
        if(EditingMessage === false || DeleteMessageDialogOpen === false){
        setMessageDropDown([MessageDropDown[0], false, MessageDropDown[2]]);
        }
      }
    };

    // Agregar un event listener para detectar clics en todo el documento
    document.addEventListener('click', handleClickOutside);

    // Eliminar el event listener al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [EditingMessage]);


  /* useEffect(() => {

    console.log(MessageDropDown)
  }, [MessageDropDown]) */

  return (
    <div id="messagedropdown" style={{ display: MessageDropDown[1] === true ? 'block' : 'none' }}>
      <ul className="menu">
      <li onClick={editMessage} className="menu-item">
          <button>Editar mensaje</button>
        </li>
        <li onClick={openDeleteMessageDialog} className="menu-item">
          <button>Eliminar mensaje</button>
        </li>
      </ul>
    </div>
  );
}

export default DropDown;
