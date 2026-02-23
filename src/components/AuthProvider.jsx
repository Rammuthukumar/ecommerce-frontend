import { createContext, useEffect, useState } from "react"
import {jwtDecode} from 'jwt-decode'
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

function AuthProvider({children}){
    const [user, setUser] = useState("");
    const [token, setToken] = useState(localStorage.getItem('token') || "");

    useEffect(()=>{
        if(token){
            const decodeUser = jwtDecode(token);
            setUser(decodeUser);
            console.log(user);
        }
    },[token])

    const authLogin = (jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
    }

    return (
        <AuthContext.Provider value={{user, token, authLogin, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider