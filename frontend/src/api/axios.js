import axios from "axios";

const instance = axios.create({
    baseURL: "https://chatapi.criskop.com/api",
    withCredentials: true
})

export default instance;