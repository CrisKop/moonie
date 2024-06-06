import React from 'react'
import { useState, useEffect } from "react";
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"



function ChatNav() {

    const { InfoOpen, setInfoOpen } = useChat()
    const { LeftBarShow, setLeftBarShow } = useChat()
    const { CurrentOppenedChat, CurrentChatData } = useChat();

    const handleLeftBarOpen = () => {

        if(window.innerWidth < 1279){
        setLeftBarShow(!LeftBarShow)
        }
      }
    
      const handleInfoOpen = () => {
        setInfoOpen(!InfoOpen)
      }

      const {messageConfigOpen, setmessageConfigOpen} = useChat();

      

      const openmessageConfig = () => {

        if(InfoOpen === false) {
          setInfoOpen(!InfoOpen)
        }

          setmessageConfigOpen(!messageConfigOpen)
      }

  return (
   <>
       {CurrentChatData.length !== 0 && (
     <div className="chatnav">

<section className="chatinfo">
<i onClick={handleLeftBarOpen} className="icon leftback ri-arrow-left-s-line"></i>
<div className="pfp hover" onClick={handleInfoOpen}><img src={CurrentChatData.avatarURL} alt="" /></div>

<div className="details hover" onClick={handleInfoOpen}>
<div className="selectable navname" >{CurrentChatData.name}</div>
<div className="selectable navmessage">{CurrentChatData.description}</div>
</div>

</section>

<section className="buttonsContainer">
<i onClick={openmessageConfig} className="hover icon ri-search-line"></i>
<i onClick={handleInfoOpen} className="icon ri-more-2-line"></i>
</section>
</div>
       )}
   </>
  )
}

export default ChatNav