import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"

export default function MyModal(props) {
  const {DeleteChatDialogOpen,  setDeleteChatDialogOpen, setCurrentChatData, userChats, setUserChats, deleteChat } = useChat();
  const {user, setUser} = useAuth();

  const {ChatListDropDown, setChatListDropDown, LoadingDeleteChat} = useChat();
 // const {dialogButtons} = useDash();


  function deleteChatFunc(chatid){

    var checkbox = document.getElementById('deleteChatData')

    const date = checkbox.checked ? true : false;
    const res = deleteChat({
      chatid,
      date
    }).then(() => {
      closeModal()
    })


  }




  function closeModal() {
    setDeleteChatDialogOpen(false)
  }

  function redirect(link){
    window.href = link
  }

  function openModal() {
    setDeleteChatDialogOpen(true)
  }



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

      <Transition appear show={DeleteChatDialogOpen} as={Fragment}>
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
                    className="text-lg font-medium leading-6 text-center"
                  >
                    ¿Seguro quieres eliminar el chat?
                  </Dialog.Title>


                  <div className='flex-column gap-5 p-2'>

                    <div className='flex gap-5 align-center justify-center'>
                    <input type="checkbox" name="deleteChatData" id="deleteChatData" className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
                    <label htmlFor="DeleteChatData" className='text-gray-400'>Eliminar todos los mensajes y datos</label>
                    </div>
                  </div>


                  <div className='flex gap-5 justify-center'>
                  <button
                      type="button"
                      className={`${LoadingDeleteChat === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-300 text-red-900 hover:bg-red-200'} inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                      onClick={() => {deleteChatFunc(ChatListDropDown[0][0])}}
                      disabled={LoadingDeleteChat === true}
                    >

                  {LoadingDeleteChat === true ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                     Eliminar
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
