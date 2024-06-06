import axios from "./axios";



export const createChatRequest = data => axios.post(`/chats/`, data)

export const deleteChatRequest = data => axios.post(`/chats/deleteChat`, data)

export const getUserChatsRequest = () => axios.get(`/chats/getuserchats`)

export const getNewChatsRequest = (page, search) => axios.get(`/chats/getnewchats?page=${page}&search=${search}`)

export const getChatInfoRequest = (chatID) => axios.get(`/chats/findchat?chatid=${chatID}`)

export const editGroupInfoRequest = data => axios.post('/chats/editgroupinfo', data)

export const editGroupMembersRequest = data => axios.post('/chats/editgroupmembers', data)

export const editGroupAdministratorsRequest = data => axios.post('/chats/editgroupadministrators', data)


export const getUserNotificationsRequest = () => axios.get('/notifications/')

export const clearUserNotificationsRequest = data => axios.post('/notifications/clear', data)