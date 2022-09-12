import axios from 'axios';
//https://controle-armazem.vercel.app/
const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

export default api;