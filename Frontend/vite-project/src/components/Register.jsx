import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { toast } from 'react-hot-toast'; 
import '../css/register.css'; 
import CancelRegister from '../images/CancelLogin.jpg'; 

const Register = ({ togglePopup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigate = useNavigate();
    const { register } = useAuth(); 

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
            const response = await register(username, password);
            if (response.success) {
                setErrorMessage('');
                toast.success('Registration successful!');
                togglePopup();
            } else {
                setErrorMessage('');
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration failed:', error);
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

    return (
        <div className="register-popup">
            <div className="register-form">
                <div className="register-title">Register to SwipTory</div>
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button className='submitButton' type="submit">Register</button>
                </form>
                <img src={CancelRegister} className='close-btn' alt="Cancel Registration" onClick={handleClose} />
            </div>
        </div>
    );
};

export default Register;
