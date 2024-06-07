import { createContext, useState, useContext } from "react";
import { editUserInfoRequest, loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import { useEffect, useRef } from "react";
import Cookies from 'js-cookie'
import { clearUserNotificationsRequest } from "../api/chat";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within a AuthProvider");
    return context;
  };

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);

      //Notification states

  const [NotificationData, setNotificationData] = useState(["", false])
  const notificationRef = useRef(null);
  const [userNotifications, setUserNotifications] = useState([])
    
    const [loading, setLoading] = useState(true)


    //#region Register
    const signup = async (user) => {
        try {
            setLoading(true)
            console.log("User: "+ user)
            const res = await registerRequest(user)
            console.log("Data: "+ res.data)
        console.log(res.data)

                   // Aquí, puedes establecer la cookie de autenticación
                   const token = res.data.token; // Asume que el token se encuentra en res.data.token
                   document.cookie = `token=${token}; secure; samesite=Lax`; // Configura la cookie


        const datos = {...res.data }

        delete datos.token
                   
        setUser(datos)
        setIsAuthenticated(true)
        setLoading(false)
        } catch (error) {
            console.log(error)
           setErrors(error.response.data)
        }
    }


    //#region Login
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            
            // Aquí, puedes establecer la cookie de autenticación
            const token = res.data.token; // Asume que el token se encuentra en res.data.token
            document.cookie = `token=${token}; secure; samesite=Lax`; // Configura la cookie
            
            const datos = {...res.data }

            delete datos.token

            setUser(datos);
            setIsAuthenticated(true);
        } catch (error) {
            console.log(error);
            setErrors([error.response.data]);
        }
    }

//#region Change User Data
    const changeUserData = async (data) => {
        
        try{
       const res = await editUserInfoRequest(data)

       setUser(prevUser => ({
        ...prevUser, // Copia el estado anterior
        status: res.data.status, // Actualiza el status con el valor del resultado de la solicitud
        avatarURL: res.data.avatarURL !== null ? res.data.avatarURL : prevUser.avatarURL // Actualiza el avatarURL solo si no es nulo
    }));
    showNotification("Aplicado exitosamente", true)
        } catch (e) {
            showNotification("Error cambiando datos", false)
        }
    }

    //#region clearNotifications
    const clearUserNotifications = async (chatid) => {

        try{
        const jsontoPost = {
            chatid: chatid
          }
      
          const res = await clearUserNotificationsRequest(jsontoPost)

          console.log(res.data, "notis")

          setUserNotifications(res.data)

          return res;
        }catch(e){
            console.log(e)
            return null;
        }
          
    }

    //#region Logout
    const logout = () => {
        Cookies.remove("token");
        setUser(null)
        setIsAuthenticated(false)
    }

    useEffect(() => {
        if(errors.length > 0) {
           const timer = setTimeout(() => {
                setErrors([])
            }, 5000) 
            return () => clearTimeout(timer)
        }
    }, [errors])


    //#region Verify user session
    useEffect(() => {
        async function checkLogin() {
        const cookies = Cookies.get()

        if(!cookies.token) {
            setIsAuthenticated(false);
            setLoading(false);
            return setUser(null);
        }

         try {
             const res = await verifyTokenRequest(cookies.token)
             if(!res.data) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
             }
 
             setIsAuthenticated(true)
             setUser(res.data)
             setLoading(false);
         } catch (error) {
             setIsAuthenticated(false)
             setUser(null)
             setLoading(false);
         }
      }
      checkLogin();
    }, [])


     //#region Notification

  const showNotification = (text, check) => {
    setNotificationData([text, check])


    if (notificationRef.current) {
    notificationRef.current.classList.add('movenotification')

    setTimeout(() => {
     notificationRef.current.classList.remove('movenotification')
    }, 2000)

   }
 }

    return (
        <AuthContext.Provider value={{setUserNotifications, userNotifications, clearUserNotifications, notificationRef, showNotification, NotificationData, setNotificationData,signup, signin, logout, loading, user, setUser, changeUserData, isAuthenticated, errors}}>
            {children}
        </AuthContext.Provider>
    )
}