import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import '../css/login.css'; 
import CancelLogin from '../images/CancelLogin.jpg';
import ShowPassword from '../images/showPassword.png';
import HidePassword from '../images/hidePassword.png';
import { toast } from 'react-hot-toast'; 

const Login = ({ togglePopup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(''); 
    const [lastToastMessage, setLastToastMessage] = useState(''); 
    const { login, authMessage } = useAuth(); 

    useEffect(() => {
      if (authMessage && authMessage !== lastToastMessage) {
          toast(authMessage); 
          setLastToastMessage(authMessage); 
      }
  }, [authMessage, lastToastMessage]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
        setErrorMessage('Please enter valid username');
        return;
    }
    if (!password) {
        setErrorMessage('Please enter valid password');
        return;
    }
    try {
        const response = await login(username, password);
        if (response.success) {
           
            toast.success('Login successful!');
            setErrorMessage('');
            togglePopup(); 
        } 
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
      } else if (error.message) {
          toast.error(error.message);
      } else {
          toast.error('An unexpected error occurred. Please try again later.');
      }
  }
};


  

    const handleClose = () => {
      togglePopup(); 
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-popup">
            <div className="login-form">
                <div className="login-title">Login to SwipTory</div>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="input-container password-input">
                        <label htmlFor="password">Password</label>
                        <input type={showPassword ? "text" : "password"} id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <img src={showPassword ? HidePassword : ShowPassword} alt="Toggle Password Visibility" onClick={togglePasswordVisibility} className="password-toggle" />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button className='submitButton' type="submit">Log In</button>
                </form>
                <img src={CancelLogin} className='close-btn' alt="Cancel Login" onClick={handleClose} />
            </div>
        </div>
    );
};

export default Login;
