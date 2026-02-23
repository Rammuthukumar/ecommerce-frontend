import axios from 'axios'

const url = "https://ecommerce-backend-28es.onrender.com/user/";

export const login = (credentials) => {
    return axios.post(`${url}login`, credentials)
}

export const register = (userData) => {
    console.log(userData);
    return axios.post(`${url}register`, userData)
}

export const resetPassword = (userData) => {
    console.log(userData);
    return axios.post(`${url}forgot-password`, userData);
}