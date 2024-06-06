import React, {useEffect, useState} from 'react'
import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"
import {useForm} from 'react-hook-form'
import { useSocket } from '../context/SocketContext';

function GroupConfig() {

    const {user} = useAuth();

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {socket} = useSocket()

    const {GroupConfigOpen, setGroupConfigOpen} = useChat();

    const { CurrentChatData, changeGroupInfo } = useChat();

    const [LoadingChange, setLoadingChange] = useState(false)

    const openGroupConfig = () => {
        setGroupConfigOpen(!GroupConfigOpen)
    }

    const changeAvatar = () => {
      var iconInput = document.getElementById('iconInput')

      iconInput.click()
    }


    useEffect(() => {
        setGroupConfigOpen(false)
    }, [])



    useEffect(() => {
        var GroupConfig = document.getElementById('GroupConfig')

        if(GroupConfigOpen === false){
            GroupConfig.classList.add('groupconfigmove')
        } else {
            GroupConfig.classList.remove('groupconfigmove')
        }
    }, [GroupConfigOpen])


    const handlePFPUpload = (event) => {
      const file = event.target.files[0]; // Obtener el primer archivo seleccionado
  
      if (file) {
        const reader = new FileReader(); // Crear un lector de archivos
  
        reader.onload = (e) => {
          const img = document.getElementById('iconImage');
          setFile(file)
          img.src = e.target.result; // Actualizar el estado de la imagen con la URL del archivo
        };
  
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
      }
    };


    const [file, setFile] = useState()


    const onSubmit = handleSubmit(data => {

      setLoadingChange(true)

      var nameInput = document.getElementById('nameInput')
      var descInput = document.getElementById('descriptionInput')

       const formData = new FormData()

       formData.append('icon', file)
       formData.append('name', nameInput.textContent)
       formData.append('description', descInput.textContent)
       formData.append('chatid', CurrentChatData.id)
       formData.append('socketID', socket.id)

       changeGroupInfo(formData).then(() => {
        setLoadingChange(false)
       })
    })


 console.log(CurrentChatData)

const configAvatar = CurrentChatData.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : CurrentChatData.avatarURL
const configStatus = CurrentChatData.description.length === 0 ? "No hay una descripción actualmente." : CurrentChatData.description;

useEffect(() => {
  var P_element = document.getElementById('descriptionInput')
  var img = document.getElementById('iconImage');
  setFile()
  img.src = configAvatar; // Actualizar el estado de la imagen con la URL del archivo


  P_element.textContent = configStatus
}, [GroupConfigOpen])


  return (
    <section id='GroupConfig' className="GroupConfig">
    <div className="ucnav">
    <h1>Editar Grupo</h1>
    <i onClick={openGroupConfig} className="icon ri-arrow-right-s-line"></i>
    </div>

    <form onSubmit={onSubmit} className="config">
    <div onClick={changeAvatar} className="pfp hover">
      
      <input onChange={handlePFPUpload} type="file" name="iconInput" id="iconInput" className=' hidden'  accept="image/jpeg, image/png"/>
      <img id='iconImage' src={configAvatar} alt="" />
      <div className='pfpchangehover'>
        Cambiar Foto
      </div>
    
    </div>

    <main className='hover'>
    <h1 className="categorytitle">
      Nombre de grupo <i className="ri-edit-box-line"></i>
    </h1>

    <p className="maintext" id='nameInput' contentEditable suppressContentEditableWarning>
      {CurrentChatData.name}
    </p>
    </main>


    <main   className='hover'>
    <h1 className="categorytitle">
      Descripción <i className="ri-edit-box-line"></i>
    </h1>

    <p className="maintext" id='descriptionInput' contentEditable suppressContentEditableWarning>
      {configStatus}
    </p>
    </main>


    <button type="submit" 
    className={` ${LoadingChange === true ? 'bg-gray-700 text-black cursor-not-allowed px-10' : 'bg-yellow-400 text-black hover:bg-yellow-200'}`}
    disabled={LoadingChange === true}
    >
         {LoadingChange === true ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                     Aplicar
                    </>
                  )}
    </button>
    </form>
  </section>
  )
}

export default GroupConfig