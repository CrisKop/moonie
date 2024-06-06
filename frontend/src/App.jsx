import { BrowserRouter, Routes, Route} from 'react-router-dom'

import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import { AuthProvider } from './context/AuthContext'
import LevelsPage from './pages/ChatPage'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import { ChatProvider } from './context/ChatContext'
import {MessageProvider} from './context/MessageContext'

import ProtectedRoute from './ProtectedRoute'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <SocketProvider>
    <AuthProvider>
           <ChatProvider>
            <MessageProvider>
          <BrowserRouter>
          <main className='allcontainer'>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
   
        <Route element={<ProtectedRoute/>}>
        <Route path="/chat" element={<ChatPage />} />
          </Route>
          
      </Routes>
       </main>
        </BrowserRouter>
        </MessageProvider>
        </ChatProvider>
    </AuthProvider>
    </SocketProvider>
  )
}

export default App