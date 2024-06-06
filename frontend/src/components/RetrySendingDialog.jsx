import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"
import { useMessage } from '../context/MessageContext';

export default function MyModal(props) {
  const {user, setUser} = useAuth();
  
  const { setSendingMessageData, sendingMessageData, retrySendingDialog, setRetrySendingDialog, sendMessage} = useMessage();
 // const {dialogButtons} = useDash();

 const {CurrentOppenedChat, setCurrentOppenedChat} = useChat();


  function retryMessageFunc(){
  

    const messageData = {
        "id": sendingMessageData._id,
        "message": sendingMessageData.message,
        "senderID": sendingMessageData.senderID._id,
        "chatID": sendingMessageData.chatID
     }

      sendMessage(messageData)
      setRetrySendingDialog(false)
      

  }


    function closeModal() {



    const messagesWithoutTemporal = CurrentOppenedChat.messages.filter(m => m._id !== sendingMessageData._id)

    setCurrentOppenedChat({
        ...CurrentOppenedChat,
        messages: messagesWithoutTemporal
    })

    setSendingMessageData([])
    setRetrySendingDialog(false)
  }

  function redirect(link){
    window.href = link
  }

  function openModal() {
    setRetrySendingDialog(true)
  }

const templatetext = sendingMessageData.length > 0 ? sendingMessageData.message : "Test text"

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

      <Transition appear show={retrySendingDialog} as={Fragment}>
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
                    className="text-lg font-medium leading-6 text-center text-yellow-500"
                  >
                    ⚠️ Error al enviar mensaje
                  </Dialog.Title>

                  <div className='flex-column gap-5 p-2'>

<div className='flex gap-5 align-center justify-center'>
    <div className="ownmessagetemplate">
    <div className="messageinfo">
    <p className="text">{templatetext}</p>
    </div>
    </div>
</div>
</div>

                  <div className='flex gap-5 justify-center'>
                  <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-yellow-300 px-10 py-2 text-sm font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={retryMessageFunc}
                    >
                      Reintentar
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
