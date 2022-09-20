import axios from 'axios';
//https://controle-armazem.vercel.app/
const api = axios.create({
    baseURL: 'https://controle-armazem.vercel.app/'
});

export default api;