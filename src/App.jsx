import React from 'react'
import SignupForm from './Forms/SignupForm'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Forms/Login'
import Chats from './components/pages/Chats'
import io from "socket.io-client";

const socket = io("http://localhost:3000");
 
 const  App = () => {
   return (
     <div>
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/chat" element={<Chats socket={socket} />} />
           <Route path="/signup" element={<SignupForm />} />
         </Routes>
       </BrowserRouter>
     </div>
   );
 }

 export default  App