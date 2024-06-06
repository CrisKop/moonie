import React, {useState, useEffect} from 'react'
import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"

function DropDown() {
    const [open, setOpen] = useState(false);
    const {isAuthenticated, logout, user} = useAuth();
    const {newChatDialogOpen,  setnewChatDialogOpen, CreateGroupDialogOpen, setCreateGroupDialogOpen} = useChat();

    const handlenewChatOpen = () => {
     setnewChatDialogOpen(!newChatDialogOpen)
      handleOpen()
    }

    const openCreateGroupDialog = () => {
      setCreateGroupDialogOpen(true)
      handleOpen()
    }

    const {UserConfigOpen, setUserConfigOpen} = useChat();

    const openUserConfig = () => {
        setUserConfigOpen(!UserConfigOpen)
        handleOpen()
    }

    const handleOpen = () => {
      if(open === false){

        var openbutton = document.getElementById('opendrop')
        openbutton.classList.add('buttontarget')
        setOpen(true)

      } else {
        var openbutton = document.getElementById('opendrop')
        openbutton.classList.remove('buttontarget')
        setOpen(false)
      }
    };

    useEffect(() =>{
      const handleClickOutside = (event) => {
        const element = document.getElementById('dropdown');
      
        if(element === null) return;
        // Verificar si el clic ocurrió fuera del elemento específico
        if (!element.contains(event.target)) {
          // El clic ocurrió fuera del elemento, ejecutar la acción deseada
          var openbutton = document.getElementById('opendrop')
          openbutton.classList.remove('buttontarget')
          setOpen(false)
        }
      };
      
      // Agregar un event listener para detectar clics en todo el documento
      document.addEventListener('click', handleClickOutside);
    }, [])

  
  
    return (
      <div id='dropdown' className="dropdown">
        <button onClick={handleOpen}>  <i id='opendrop' className="icon ri-more-2-line"></i></button>
        {open ? (
          <ul className="menu">
               <li className="menu-item">
              <button onClick={handlenewChatOpen}>Nuevo Contacto</button>
            </li>
            <li className="menu-item">
              <button onClick={openCreateGroupDialog}>Nuevo Grupo</button>
            </li>
            <li className="menu-item">
              <button onClick={openUserConfig}>Ajustes de usuario</button>
            </li>
            <li className="menu-item">
              <button onClick={() => {logout();}}>Cerrar Sesión</button>
            </li>
          </ul>
        ) : null}
      </div>
    )
}

export default DropDown