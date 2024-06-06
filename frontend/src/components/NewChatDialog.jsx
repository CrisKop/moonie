import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import {useChat} from '../context/ChatContext';
import { useAuth } from "../context/AuthContext"

export default function MyModal(props) {
  const {newChatDialogOpen,  setnewChatDialogOpen, getNewChats, createChat, CurrentChatData, setCurrentChatData, userChats, setUserChats } = useChat();
  const {user} = useAuth();

  const {setLeftBarShow, LeftBarShow, newChatsList, setNewChatsList, LoadingCreateChat} = useChat();
  const [currentPage, setCurrentPage] = useState(1)
  const [currentSearch, setCurrentSearch] = useState("")
  const [LoadingFirstPart, setLoadingFirstPart] = useState(true)
  const [LoadingPage, setLoadingPage] = useState(false)

  const [NoMoreUsers, setNoMoreUsers] = useState(false)
 // const {dialogButtons} = useDash();


  const nextpage = async () => {
    console.log("mas 1")
    setCurrentPage(currentPage + 1)
  }

  useEffect(() => {

    const fetchNewChats = async () => {
    if(newChatDialogOpen === true){


 

        setLoadingPage(true)
      

      console.log(currentPage)

    const newChats = await getNewChats(currentPage, currentSearch)
    setLoadingPage(false)

    if(newChats.length <= 0){
      setNoMoreUsers(true)
    }

    setNewChatsList(prevChats => prevChats.concat(newChats))

    }
  }
  fetchNewChats();
  }, [currentPage])

  useEffect(() => {
    const fetchNewChats = async () => {
        if (newChatDialogOpen === true) {
            if (newChatsList.length <= 0) {
                try {
                  setLoadingFirstPart(true)
                    const newChats = await getNewChats(1, currentSearch);
                    setNewChatsList(newChats);
                    setLoadingFirstPart(false)
                } catch (error) {
                    console.error('Error fetching new chats:', error);
                }
            }
        }
    };

    fetchNewChats();
}, [newChatDialogOpen]);

 /* useEffect(() => {
  console.log(newChatsList);
}, [newChatsList]); */


  function closeModal() {
    setnewChatDialogOpen(false)
    setNoMoreUsers(false)
  }

  function redirect(link){
    window.href = link
  }

  function openModal() {
    setnewChatDialogOpen(true)
  }


  const createChatFunc = (members, chatdata) => {
    if(window.innerWidth < 1270){
      setLeftBarShow(!LeftBarShow)
      }

      createChat(members)

      setCurrentChatData(chatdata)

      setnewChatDialogOpen(false)
      setNoMoreUsers(false)

      const deleteChat = (chatIdToDelete) => {
      setNewChatsList((prevChats) => {
        // Utiliza filter para eliminar el chat con el ID correspondiente
        return prevChats.filter((chat) => chat._id !== chatdata.id);
      });
    };

    deleteChat()

  }

  /*useEffect(() => {
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

      <Transition appear show={newChatDialogOpen} as={Fragment}>
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
                    Busca nuevas personas para chatear:
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

{LoadingFirstPart === true && (
    <div className="loader"></div>
  )}

{ newChatsList &&
    
    newChatsList.map((u, index) => {


      let chatdata = 
        {
            id: u._id,
            name: u.username,
            avatarURL: u.avatarURL,
            description: u.status,
            lastMessage: "",
            lastMessageCreatedAt: ""
        }

    chatdata.avatarURL = chatdata.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png" : chatdata.avatarURL

      return(


<div  onClick={() => createChatFunc([u._id, user.id], chatdata)} key={index} className='newChatOnList hover'>
<div className="">
<div className="pfp"><img src={chatdata.avatarURL} alt="" /></div>
                    <p className="text-sm">
                      {u.username}
                    </p>
                  </div>

      <button
      key={index} // Asegúrate de proporcionar una clave única para cada elemento en la lista
      type="button"
       // Aquí asegúrate de envolver la llamada a la función en una función de flecha para que no se ejecute inmediatamente
    >
       <i className="icon ri-message-line"></i>
    </button>
    </div>


      )
    })

  }

             
                  </div>

                  {LoadingPage === true && (
    <div className="loader"></div>
  )}

  {newChatsList.length <= 0 || NoMoreUsers === true ? (
    <p className='text-center textoboton'>No se encontraron usuarios</p>
  ) :
  (
    <p onClick={nextpage} className='hover text-center textoboton'>Más... <i className="ri-arrow-down-double-line"></i></p>
  )
  }

{LoadingCreateChat === true && (
    <div className="loader"></div>
  )}
                
                  <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cerrar
                    </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
