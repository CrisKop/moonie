import React from 'react'
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"
import GroupConfig from './GroupConfig'
import MessageSearch from './MessageSearch'
import GroupUserDialog from './GroupUserDialog'
import LeaveGroupDialog from './LeaveGroupDialog'
import AddMembersToGroupDialog from './AddMembersToGroupDialog'


function RightBar() {

    const { InfoOpen, setInfoOpen } = useChat()
    const { LeftBarShow, setLeftBarShow } = useChat()
    const { CurrentChatData } = useChat();
    const {GroupConfigOpen, setGroupConfigOpen, groupUserDialog,  setGroupUserDialog, setAddMembersToGroupDialog} = useChat();

    const {user} = useAuth();


  const handleGroupConfigOpen = () => {
    setGroupConfigOpen(!GroupConfigOpen)
  }

    const handleInfoOpen = () => {
        setInfoOpen(!InfoOpen)
      }
  
      const handleLeftBarOpen = () => {
  
        if(window.innerWidth < 1279){
        setLeftBarShow(!LeftBarShow)
        }
      }

      const {messageConfigOpen, setmessageConfigOpen} = useChat();

      const openmessageConfig = () => {
          setmessageConfigOpen(!messageConfigOpen)
      }


      const openGroupUserDialog = (usergiven) => {
        if(usergiven.id === user.id) return;
        setGroupUserDialog([usergiven, true])
      }




  return (
    <section className="rightbar">

      <GroupUserDialog/>

      <LeaveGroupDialog/>

      <AddMembersToGroupDialog/>

    <i onClick={handleInfoOpen} className="icon back ri-arrow-right-s-line" id="rightbarBack"></i>
    

    { CurrentChatData.length !== 0 && (CurrentChatData.owner === user.id || (CurrentChatData.administrators && CurrentChatData.administrators.includes(user.id))) && (
      <GroupConfig/>
    )}


    <MessageSearch/>

    {CurrentChatData.length !== 0 && (
        <>
              <section className="userbasicinfo">
      <div className="pfp"><img src={CurrentChatData.avatarURL} alt="" title='a' /></div>
      <h1 className="selectable primarytext">{CurrentChatData.name}   </h1>
      { CurrentChatData.length !== 0 && (CurrentChatData.owner === user.id || (CurrentChatData.administrators && CurrentChatData.administrators.includes(user.id))) && (
        <>  
      <i onClick={handleGroupConfigOpen} className="hover ri-pencil-fill"> Editar</i>
      <i onClick={() => {setAddMembersToGroupDialog([CurrentChatData, true])}} className="hover addmembers ri-user-add-fill"></i>
      </>
      )}
      </section>
    


 
        { CurrentChatData.description && CurrentChatData.description !== null && CurrentChatData.description.length > 0 && (
<>
<section className="userstatus">
  {CurrentChatData.type !== "dm" ? (
    <h2 className="categorytitle">Descripción.</h2>
  ) : (
<h2 className="categorytitle">Estado.</h2>
  )}

        <div className="selectable maintext">{CurrentChatData.description}</div>
        </section>
</>
        )}
     
       

     { CurrentChatData.type === "group" && (
      <section className="members">
      <h2 className="categorytitle">Miembros.</h2>
        {CurrentChatData.members && CurrentChatData.members.map((m, index) => {

          const pfpURL = m.avatarURL === null ? "https://pbs.twimg.com/profile_images/1710008152757039105/dBKdRq03_400x400.png"  : m.avatarURL
          return (
            <React.Fragment key={index}>

              <div onClick={() => {openGroupUserDialog(m)}} className='member hover'>
              <div className="pfp"><img src={pfpURL} alt="" /></div>


              <main>

                <h1>{m.username}</h1>

                {CurrentChatData.owner === m.id && <i className="ri-vip-crown-fill"></i>}
                {CurrentChatData.administrators && CurrentChatData.administrators.includes(m.id) && <i className="ri-hammer-fill"></i>}
              </main>
              </div>

            </React.Fragment>
          )
        })}
      </section>
      )}
    
      <section className="more">
        <h2 className="categorytitle">Proximamente más</h2>
        <h2 className="categorytitle">Hecho por Cristian Prince</h2>
      </section>
      </>

    )}
    
    
    </section>
  )
}

export default RightBar