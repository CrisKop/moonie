import axios from "./axios";



export const sendMessageRequest = data => axios.post(`/messages/`, data)

export const getChatMessages = (chatID, lastChatDeletion) => axios.get(`/messages/getchatmessages?chatid=${chatID}&lastchatdeletion=${lastChatDeletion}`)

export const searchMessagesRequest = (chatID, search) => axios.get(`/messages/searchmessages?chatid=${chatID}&search=${search}`)

export const deleteMessagerequest = data => axios.post(`/messages/deletemessage`, data)

export const editMessagerequest = data => axios.post(`/messages/editmessage`, data)