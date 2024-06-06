import React, {useState} from 'react'
import {useForm} from 'react-hook-form'
import { useAuth } from "../context/AuthContext"
import { useChat } from "../context/ChatContext"
import {useMessage} from "../context/MessageContext"

function SendMessageForm() {

    const {user} = useAuth();

    const {sendMessage, editMessage} = useMessage();

    const {MessageDropDown, EditingMessage, setEditingMessage, setSendingMessageData} = useMessage();

    const { CurrentOppenedChat, CurrentChatData } = useChat();

    const {register, handleSubmit, formState: {errors}} = useForm();

    const [LoadingEdit, setLoadingEdit] = useState(false)


    const noEditar = async () => {
      
      var messageInput = document.getElementById('messageInput')

      messageInput.value = "";
      setEditingMessage(false)
    }

    const onSubmit = handleSubmit(data => {
        if(data.message.length < 1){
            return;
        }

         let messageData;

         if(EditingMessage === false){
          messageData = {
            "message": data.message,
            "senderID": user.id,
            "chatID": CurrentOppenedChat._id
         }

          sendMessage(messageData)
          var messageInput = document.getElementById('messageInput')

          messageInput.value = "";
         } else {

          messageData = {
            "messageid": MessageDropDown[2]._id,
            "content": data.message
         }
         setLoadingEdit(true)
          editMessage(messageData).then(() => {
            setLoadingEdit(false)
            var messageInput = document.getElementById('messageInput')

            messageInput.value = "";
            setEditingMessage(false)
          })
         }

      })
    

  return (
    <>
    {CurrentChatData.length !== 0 && (
    <form onSubmit={onSubmit} className="send">

      {EditingMessage === true &&
      <>
      <div className="editing">
       <div>Editando mensaje...</div>
       <i onClick={noEditar} className="hover ri-close-line"></i>
       </div>
       </>
      }
      
       <div className="container">
        { /*<div className="morebutton"><i className="ri-add-line"></i></div>*/}
         <input type="text" name="messageInput" id="messageInput" placeholder="Escribe un mensaje" autoComplete='off' {...register('message', {required: false})}/>
         {EditingMessage !== true ? (
         <button type="submit" className="sendbutton"><i className="ri-send-plane-2-fill"></i></button>
         ) : (
          <button type="submit" className="sendbutton">
            {LoadingEdit === true ? (
                     <div className="loader"></div>
            ) : (
            <i className="ri-check-line"></i>
            )}
            </button>
         )
        }
         </div>
     </form>
    )}
    </>
  )
}

export default SendMessageForm