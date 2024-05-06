import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const instance = axios.create({
 baseURL: 'http://localhost:3000/api', 
});

instance.interceptors.response.use(
 response => response, 
 error => {
    const { status } = error.response;
    const navigate = useNavigate(); 

    if (status === 401 || status === 400) {
      navigate('/');
    }

    return Promise.reject(error);
 }
);

export default instance;
