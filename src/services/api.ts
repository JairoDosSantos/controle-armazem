import axios from 'axios';
//https://controle-armazem.vercel.app/
//http://localhost:3000/api/
const api = axios.create({
    baseURL: 'http://localhost:3000/'
});

export default api;