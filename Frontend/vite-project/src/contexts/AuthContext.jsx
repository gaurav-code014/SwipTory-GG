import React, { useContext,createContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
 });
 const [token, setToken] = useState(localStorage.getItem("token"));
 const [authMessage, setAuthMessage] = useState(''); 


 useEffect(() => {
    console.log("user", user);
 }, [user]);

 const login = async (username, password) => {
   try {
       const response = await axios.post('http://localhost:3000/api/auth/login', { username, password });
       const { token, user, message } = response.data;
       if (message === "Login successful.") {
           setUser(user);
           setToken(token);
           localStorage.setItem("user", JSON.stringify(user));
           localStorage.setItem("token", token);
           
           setAuthMessage('');
           return { success: true, message };
       } else {
           throw new Error(message);
       }
   } catch (error) {
       console.error('Login failed:', error);
       throw error; 
   }
};

const register = async (username, password) => {
   try {
       const response = await axios.post('http://localhost:3000/api/auth/register', { username, password });
       const { token, user, message } = response.data;
       localStorage.setItem('token', token);
       setUser(user);
     
       return { success: true, message };
   } catch (error) {
       console.error('Registration failed:', error);
       
       throw error; 
   }
};

 const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
 };

 

 return (
   <AuthContext.Provider value={{ user, token, login, register, logout, authMessage }}>
            {children}
        </AuthContext.Provider>
 );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
