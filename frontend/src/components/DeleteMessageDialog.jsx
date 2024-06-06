import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"
import { useMessage } from '../context/MessageContext';

export default function MyModal(props) {
  const {CurrentOppenedChat} = useChat();
  const {user, setUser} = useAuth();
  
  const {DeleteMessageDialogOpen,  setDeleteMessageDialogOpen, deleteMessage} = useMessage();
  const {MessageDropDown, setMessageDropDown} = useMessage();

  const [LoadingDelete, setLoadingDelete] = useState(false)
 // const {dialogButtons} = useDash();


  function deleteMessageFunc(messageid){
    setLoadingDelete(true)
    const res = deleteMessage({
        messageid
    }).then(() => {
      setLoadingDelete(false)
      closeModal()
    })

 
  }


  const convertTo12HourFormat = (dateString) => {
    const createdAt = new Date(dateString);
    let hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    let ampm = 'AM';
  
    // Convertir horas a formato de 12 horas y establecer AM/PM
    if (hours >= 12) {
      ampm = 'PM';
    }
    if (hours > 12) {
      hours -= 12;
    }
  
    // Formatear los minutos con un cero delante si es necesario
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    // Construir la cadena de tiempo en formato de 12 horas
    const time12Hours = `${hours}:${formattedMinutes} ${ampm}`;
  
    return time12Hours;
  }




  function closeModal() {
    setDeleteMessageDialogOpen(false)
  }

  function redirect(link){
    window.href = link
  }

  function openModal() {
    setDeleteMessageDialogOpen(true)
  }

const templatetext = MessageDropDown[2] ? MessageDropDown[2].message : "Test text"
const templatehour = MessageDropDown[2] ? convertTo12HourFormat(MessageDropDown[2].createdAt) : "00:00"

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

      <Transition appear show={DeleteMessageDialogOpen} as={Fragment}>
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
                    ¿Seguro quieres eliminar el mensaje?
                  </Dialog.Title>

                  <div className='flex-column gap-5 p-2'>

<div className='flex gap-5 align-center justify-center'>
    <div className="ownmessagetemplate">
    <div className="messageinfo">
    <p className="text">{templatetext}</p>
    <p className="hora">{templatehour}</p>
    </div>
    </div>
</div>
</div>

                  <div className='flex gap-5 justify-center'>
                  <button
                      type="button"
                      className={`${LoadingDelete === true ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-300 text-red-900 hover:bg-red-200'} inline-flex justify-center rounded-md border border-transparent px-10 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2`}
                      onClick={() => {deleteMessageFunc(MessageDropDown[0])}}
                      disabled={LoadingDelete === true}
                    >
                        {LoadingDelete === true ? (
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
