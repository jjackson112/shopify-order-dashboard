// React state (AuthContext) knows the user is logged in

import { createContext, useState, useEffect } from "react";

// create context
export const AuthContext = createContext()

// provider component
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token")
    })

    // login function
    const login = (newToken, username) => {
        localStorage.setItem("token", newToken)
        
        if (username) {
            localStorage.setItem("username", username)
        }

        setToken(newToken)
    }
    
    // logout function
    const logout = () => {
        localStorage.removeItem("username")
        localStorage.removeItem("token")
        setToken(null)
    } 

    useEffect(() => {
        const handleExpiredAuth = () => logout();

        window.addEventListener("auth:expired", handleExpiredAuth);

        return () => {
          window.removeEventListener("auth:expired", handleExpiredAuth);
        };
      }, []);

    const userLoggedIn = Boolean(token)

    return (
        <AuthContext.Provider value={{ token, login, logout, userLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}