import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"
import { useSocket } from '../context/SocketContext';

export default function MyModal(props) {
  const {groupUserDialog,  setGroupUserDialog, CurrentChatData, userChats, setUserChats, deleteChat, editGroupMembers, editGroupAdministrators } = useChat();
  const {user, setUser} = useAuth();

  const {socket} = useSocket();

  const [Dialogopen, setDialogOpen] = useState(false)

  const {ChatListDropDown, setChatListDropDown} = useChat();

  const [LoadingAdmin, setLoadingAdmin] = useState(false)
  const [LoadingKick, setLoadingKick] = useState(false)
 // const {dialogButtons} = useDash();


  function kickUserFunc(chatid, userid){

    setLoadingKick(true)
   const data = {
    process: "remove",
    chatid: chatid,
    memberid: userid,
    socketID: socket.id
   }

    editGroupMembers(data).then(() => {
      setLoadingKick(false)
      closeModal()
    })


  }



  function addAdministrator(chatid, userid){


    setLoadingAdmin(true) 
    const data = {
     process: "add",
     chatid: chatid,
     memberid: userid,
     socketID: socket.id
    }
 
    editGroupAdministrators(data).then(() => {
      setLoadingAdmin(false)
      closeModal()
    })

   }


   function removeAdministrators(chatid, userid){

    setLoadingAdmin(true)
    const data = {
     process: "remove",
     chatid: chatid,
     memberid: userid,
     socketID: socket.id
    }
 
    editGroupAdministrators(data).then(() => {
      setLoadingAdmin(false)
      closeModal()
    })
 

   }




  function closeModal() {
    setGroupUserDialog([[], false])
  }

  function redirect(link){
    window.href = link
  }

  useEffect(() => {
   // console.log(groupUserDialog)
    setDialogOpen(groupUserDialog[1])
  }, [groupUserDialog])



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

      <Transition appear show={Dialogopen} as={Fragment}>
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
                <Dialog.Panel className="dialogpanel fit-content max-w-md transform overflow-hidden p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-center dialogtitle"
                  >
                    {groupUserDialog[0].id && (
                        <>
                        <div className="pfp"><img src={groupUserDialog[0].avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png"  : groupUserDialog[0].avatarURL} alt="" /></div>
                        {groupUserDialog[0].username}
                        </>
                    )}
                  </Dialog.Title>

                  <div className='flex flex-col gap-5 justify-center'>
                 {/*
                  <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-10 py-2 text-sm font-medium text-blue-900 hover:bg-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {}}
                    >
                      <i className="ri-message-fill"></i> Enviar Mensaje 
                    </button>
                    */
                  }

                    { CurrentChatData && CurrentChatData.owner && CurrentChatData.owner === user.id && (
                      <>

                      { CurrentChatData && CurrentChatData.administrators && !CurrentChatData.administrators.includes(groupUserDialog[0].id) ? (
                            <button
                            type="button"
                            className={`${LoadingAdmin === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300'} inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                            onClick={() => {addAdministrator(CurrentChatData.id, groupUserDialog[0].id)}}
                            disabled={LoadingAdmin === true}
                          >
                      
                             {LoadingAdmin === true ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                           <i className="ri-hammer-fill"></i>Añadir administrador
                    </>
                  )}

                          </button>
                      ) : (
                        <button
                        type="button"
                        className={`${LoadingAdmin === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-300 text-red-900 hover:bg-red-400'} inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                        onClick={() => {removeAdministrators(CurrentChatData.id, groupUserDialog[0].id)}}
                        disabled={LoadingAdmin === true}
                      >
                           {LoadingAdmin === true ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                           <i className="ri-hammer-fill"></i>Eliminar administrador
                    </>
                  )}
                      </button>
                      ) }

                      </>
                    )}

                    { CurrentChatData && groupUserDialog[0].id && groupUserDialog[0].id !== CurrentChatData.owner && groupUserDialog[0].id !== user.id && (CurrentChatData.owner === user.id || (CurrentChatData.administrators && (CurrentChatData.administrators.includes(user.id) && (groupUserDialog[0].id && !CurrentChatData.administrators.includes(groupUserDialog[0].id))))) &&
                  <button
                      type="button"
                      className={`${LoadingKick === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-300 text-red-900 hover:bg-red-400'} inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                      onClick={() => {kickUserFunc(CurrentChatData.id, groupUserDialog[0].id)}}
                      disabled={LoadingKick === true}
                    >
                         {LoadingKick === true ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                           Expulsar del grupo
                    </>
                  )}
                    </button>
                    }

                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-10 py-2 text-sm font-medium text-blue-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
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
