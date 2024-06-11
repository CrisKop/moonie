import axios from "./axios";



export const sendMessageRequest = data => axios.post(`/messages/`, data)

export const getChatMessagesRequest = (chatID, lastChatDeletion) => axios.get(`/messages/getchatmessages?chatid=${chatID}&lastchatdeletion=${lastChatDeletion}`)

export const getMessagesFragmentRequest = (chatID, lastChatDeletion, page) => axios.get(`/messages/getmessagesfragment?chatid=${chatID}&lastchatdeletion=${lastChatDeletion}&page=${page}`)

export const searchMessagesRequest = (chatID, search) => axios.get(`/messages/searchmessages?chatid=${chatID}&search=${search}`)

export const deleteMessagerequest = data => axios.post(`/messages/deletemessage`, data)

export const editMessagerequest = data => axios.post(`/messages/editmessage`, data)