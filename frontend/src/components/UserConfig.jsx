import React, {useEffect, useState} from 'react'
import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"
import {useForm} from 'react-hook-form'
import { useSocket } from '../context/SocketContext';

function UserConfig() {

    const {user, changeUserData} = useAuth();

    const {socket} = useSocket();

    const {register, handleSubmit, formState: {errors}} = useForm();

    const {UserConfigOpen, setUserConfigOpen, userChats} = useChat();

    const [LoadingChange, setLoadingChange] = useState(false)

    const openUserConfig = () => {
        setUserConfigOpen(!UserConfigOpen)
    }

    const changeAvatar = () => {
      var avatarInput = document.getElementById('avatarInput')

      avatarInput.click()
    }


    useEffect(() => {
        setUserConfigOpen(false)
    }, [])



    useEffect(() => {
        var userconfig = document.getElementById('userconfig')

        if(UserConfigOpen === false){
            userconfig.classList.add('configmove')
        } else {
            userconfig.classList.remove('configmove')
        }
    }, [UserConfigOpen])


    const handlePFPUpload = (event) => {
      const file = event.target.files[0]; // Obtener el primer archivo seleccionado
  
      if (file) {
        const reader = new FileReader(); // Crear un lector de archivos
  
        reader.onload = (e) => {
          const img = document.getElementById('pfpImage');
          setFile(file)
          img.src = e.target.result; // Actualizar el estado de la imagen con la URL del archivo
        };
  
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
      }
    };


    const [file, setFile] = useState()


    const onSubmit = handleSubmit(data => {

      setLoadingChange(true)

      var P_element = document.getElementById('statusInput')
      
      let uniqueMemberIds = []

      if(userChats){
        // Extraer los _id de cada miembro en un array
const memberIds = userChats
.map(group => group.members.map(member => member.id)) // Mapear a los _id de los miembros
.flat(); // Aplanar el array de arrays a un solo array

// Crear un nuevo array con _id únicos usando un Set
 uniqueMemberIds = [...new Set(memberIds)];
      }

       const formData = new FormData()

       formData.append('avatar', file)
       formData.append('status', P_element.textContent)
       formData.append('socketID', socket.id)
       formData.append('userstosendSocket', JSON.stringify(uniqueMemberIds))

      changeUserData(formData).then(() => {
        setLoadingChange(false)
      })
    })


 

const configAvatar = user.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : user.avatarURL
const configStatus = user.status === null ? "No hay un estado actualmente." : user.status;

useEffect(() => {
  var P_element = document.getElementById('statusInput')
  var img = document.getElementById('pfpImage');
  setFile()
  img.src = configAvatar; // Actualizar el estado de la imagen con la URL del archivo


  P_element.textContent = configStatus
}, [UserConfigOpen])


  return (
    <section id='userconfig' className="userconfig">
    <div className="ucnav">
    <i onClick={openUserConfig} className="icon ri-arrow-left-s-line"></i>
    <h1>Perfil</h1>
    </div>

    <form onSubmit={onSubmit} className="config">
    <div onClick={changeAvatar} className="pfp hover">
      
      <input onChange={handlePFPUpload} type="file" name="avatarInput" id="avatarInput" className=' hidden'  accept="image/jpeg, image/png"/>
      <img id='pfpImage' src={configAvatar} alt="" />
      <div className='pfpchangehover'>
        Cambiar Avatar
      </div>
    
    </div>

    <main>
    <h1 className="categorytitle">
      Nombre de usuario
    </h1>

    <p className="maintext">
      {user.username}
    </p>
    </main>


    <main   className='hover'>
    <h1 className="categorytitle">
      Estado <i className="ri-edit-box-line"></i>
    </h1>

    <p className="maintext" id='statusInput' contentEditable suppressContentEditableWarning>
      {configStatus}
    </p>
    </main>


    <button type="submit" 
    className={`${LoadingChange === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed px-10' : 'bg-yellow-400 text-black hover:bg-yellow-200'}`}
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

export default UserConfig