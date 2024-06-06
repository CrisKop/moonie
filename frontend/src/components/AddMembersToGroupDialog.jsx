import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"
import { useSocket } from '../context/SocketContext';

export default function MyModal(props) {
  const {AddMembersToGroupDialog,  setAddMembersToGroupDialog, createChat, userChats, editGroupMembers } = useChat();
  const {user} = useAuth();

  const {socket} = useSocket()


  const [currentSearch, setCurrentSearch] = useState("")
  const [currentSelect, setCurrentSelect] = useState([])
  const { LeftBarShow, setLeftBarShow } = useChat()
  const {CurrentChatData, setCurrentChatData } = useChat();

  const [DialogOpen, setDialogOpen] = useState(false)

  const [LoadingAdd, setLoadingAdd] = useState(false)
 // const {dialogButtons} = useDash();



    function addOrRemoveUserToArray(userid) {

      const selected = currentSelect.some(id => userid.includes(id))

      if(selected === true){
        const updatedSelect = currentSelect.filter(id => id !== userid);
        setCurrentSelect(updatedSelect);
      }else {
        setCurrentSelect([...currentSelect, userid])
      }
    }


  function closeModal() {
    setAddMembersToGroupDialog([AddMembersToGroupDialog[0], false])
    setCurrentSelect([])
  }

  function redirect(link){
    window.href = link
  }


  function addMembersFunc(){

    if(currentSelect.length < 1) return;

    setLoadingAdd(true)

      const usersofgroup = [...currentSelect]

    const data = {
     process: "add",
     chatid: CurrentChatData.id,
     memberid: usersofgroup,
     socketID: socket.id
    }
 
     editGroupMembers(data).then(() => {
      setLoadingAdd(false)
      closeModal()
      setCurrentSelect([])
     })
 
   
   }

   useEffect(() => {

    if(AddMembersToGroupDialog[1] === true){
        setDialogOpen(true)
    } else {
        setDialogOpen(false)
    }

   }, [AddMembersToGroupDialog])
 
 
 
 
   function closeModal() {
     setAddMembersToGroupDialog([[], false])
   }

  useEffect(() => {
    if(AddMembersToGroupDialog === false){
        setCurrentSelect([])

    }
  }, [AddMembersToGroupDialog])

 /* useEffect(() => {
    console.log(userChats, "jej")
  }, [userChats]) */
  

  return (
    <>

     {/* <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
        >
          Open dialog
        </button>
      </div>
  */}

      <Transition appear show={DialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40"  />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="dialogpanel fit-content max-w-md transform overflow-hidden p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    Selecciona usuarios para añadir:
                  </Dialog.Title>

                  <div className="newChatsOnList">
                  {/*dialogButtons.map((link, index) => (
  <button
    key={index} // Asegúrate de proporcionar una clave única para cada elemento en la lista
    type="button"
    className="inline-flex justify-center rounded-md border border-transparent bg-yellow-300 px-4 py-2 text-sm font-medium text-black hover:bg-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    onClick={() => redirect(link.link)} // Aquí asegúrate de envolver la llamada a la función en una función de flecha para que no se ejecute inmediatamente
  >
     {link.text}
  </button>
))*/}

{ userChats &&
    
    userChats.filter(u => u.type === "dm").map((u, index) => {

        let notuser = u.members ? u.members.filter(m => m.id != user.id)[0] : null;
        
        let membersidArray = [];

        if(CurrentChatData.members){ 
          
          CurrentChatData.members.map(m => {
                membersidArray.push(m.id);
            
        });

      }
      
    
        // console.log(notuser, "notuser")
         let chatdata = u.chatdata.name === null ? (
             {
                 id: u._id,
                 name: notuser.username,
                 avatarURL: u.type === "dm" ? notuser.avatarURL : u.chatdata.icon,
                 description: u.type === "dm" ? notuser.status : u.chatdata.description,
                 lastMessage: u.chatdata.lastMessage,
                 lastMessageCreatedAt: u.chatdata.lastMessageCreatedAt,
                 lastMessageSentBy: u.chatdata.lastMessageSentBy
             }
         ) : u.chatdata
     
         chatdata.avatarURL = chatdata.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : (!chatdata.avatarURL ? chatdata.icon : chatdata.avatarURL)
      return(

<React.Fragment key={index}>
{CurrentChatData.members && !membersidArray.includes(notuser.id) && (
  <>
<div onClick={() => addOrRemoveUserToArray(notuser.id)} className='newChatOnList hover'>
<div className="">
<div className="pfp"><img src={chatdata.avatarURL} alt="" /></div>
                    <p className="text-sm">
                      {chatdata.name}
                    </p>
                  </div>

      <button
      type="button"
       // Aquí asegúrate de envolver la llamada a la función en una función de flecha para que no se ejecute inmediatamente
    >


    { currentSelect.some(id => notuser.id.includes(id)) ?
      <i className="ri-checkbox-fill"></i> : <i className="ri-checkbox-blank-line"></i>
    }
    </button>
    </div>
    </>
    )}
</React.Fragment>
      )
    })

  }


    {currentSelect.length < 1 && currentSelect.length > 0 && <p className='text-center text-red-500'>Mínimo 1 usuario</p>}

    {userChats.length <= 1 &&  <p className='text-center textoboton'>No se encontraron usuarios</p>}

             
                  </div>

                 <div className='flex gap-5 justify-center'>
                 <button
    type="button"
    className={`inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium ${currentSelect.length < 1 || LoadingAdd === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-yellow-300 text-blue-900 hover:bg-yellow-200'}`}
    onClick={addMembersFunc}
    disabled={currentSelect.length < 1 || LoadingAdd === true}
>
{LoadingAdd === true ? (
    <div className="loader"></div>
  ) : (
    <>
      Invitar Seleccionados
    </>
  )}
</button>  

                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-10 py-2 text-sm font-medium text-blue-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                    </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
