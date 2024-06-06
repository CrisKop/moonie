import React, {useState, useEffect, useRef} from 'react'
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { searchMessagesRequest } from '../api/message';


function MessageSearch() {

    const {user} = useAuth();

    const {setInfoOpen, InfoOpen, messageConfigOpen, setmessageConfigOpen, CurrentChatData, chatcontainerRef} = useChat();

    const [messageSearch, setMessageSearch] = useState("")

    const [messagesFound, setMessagesFound] = useState([])

    const [LoadingSearch, setLoadingSearch] = useState(false)

    const openmessageConfig = () => {
        setmessageConfigOpen(!messageConfigOpen)
    }

    useEffect(() => {
        setmessageConfigOpen(false)
    }, [])


    useEffect(() => {
        setMessageSearch("")
        setMessagesFound([])

        var searchInput = document.getElementById('messagesearchinput')

        searchInput.value = "";
    }, [CurrentChatData])



    useEffect(() => {

        setLoadingSearch(true)
        const delay = 1000; // Tiempo de espera en milisegundos
        let timeoutId;

        const delayedFunction = () => {
            searchFunction(CurrentChatData.id, messageSearch).then(() => {
                setLoadingSearch(false)
            })
            console.log("Ejecutando función después de retraso...");
        };

        const handleInputChange = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(delayedFunction, delay);
        };

        handleInputChange();

        return () => clearTimeout(timeoutId);
    }, [messageSearch]);




    useEffect(() => {
        var messageConfig = document.getElementById('messageConfig')

        if(messageConfigOpen === false){
            messageConfig.classList.add('messageConfigmove')
        } else {
            messageConfig.classList.remove('messageConfigmove')
        }
    }, [messageConfigOpen])


    const searchFunction = async (chatID, search) => {

        if(search.length <= 0) {
            return setMessagesFound([])
        }

       let res = await searchMessagesRequest(chatID, search)

        setMessagesFound(res.data)

    }

    function textoAColorHex(texto) {
        // Generar un valor hash único basado en el texto
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            hash = texto.charCodeAt(i) + ((hash << 5) - hash);
        }
    
        // Convertir el hash a un color hexadecimal
        let color = "#";
        for (let j = 0; j < 3; j++) {
            let value = (hash >> (j * 8)) & 0xFF;
            value = Math.floor(value * 0.7 + 0x40); // Asegura una tonalidad más clara
            color += ("00" + value.toString(16)).substr(-2);
        }
    
        return color;
    }

    const scrollToElement = (elementId) => {
        if(window.innerWidth < 1279){
        setmessageConfigOpen(false)
        setInfoOpen(!InfoOpen)
        }
        const element = chatcontainerRef.current.querySelector(`[message-id="${elementId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('parpadeo')

          setTimeout(() => {
            element.classList.remove('parpadeo')
          }, 1000);
        }
      };

  return (
    <section id='messageConfig' className="messageConfig">
    <div className="ucnav">
    <h1>Buscar mensaje</h1>
    <i onClick={openmessageConfig} className="icon ri-arrow-right-s-line"></i>
    </div>

    <main>
    <div className="searchbar">
<input onChange={(e) => {setMessageSearch(e.target.value.toLowerCase())}} type="text" name="messagesearchinput" id="messagesearchinput" placeholder='Buscar' />
<i className="icon ri-search-line"></i>
</div>

<section className="messagesFound">

{LoadingSearch === true ? (
    <div className="loader mediumsize my-5"></div>
) : (
<>
{messagesFound.map((m, index) => {

    return (
        <div key={index} onClick={() => {scrollToElement(m._id)}} className="message hover">

            <section className="senderinfo">
            <h1 style={{color: textoAColorHex(m.senderID.username)}} >{m.senderID.username}</h1>
            </section>

            <p>{m.message}</p>
            
        </div>
    )

}) 
}
</>
)}

</section>
    </main>

   

  
      
  </section>
  )
}

export default MessageSearch