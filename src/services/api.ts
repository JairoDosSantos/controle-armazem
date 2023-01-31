import axios from 'axios';
//https://controle-armazem.vercel.app/
//http://localhost:3000/api/
const api = axios.create({
    baseURL: 'https://controle-armazem.vercel.app/'
});

export default api;