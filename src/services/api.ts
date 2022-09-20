import axios from 'axios';
//https://controle-armazem.vercel.app/
const api = axios.create({
    baseURL: 'http://controle-armazem.vercel.app/'
});

export default api;