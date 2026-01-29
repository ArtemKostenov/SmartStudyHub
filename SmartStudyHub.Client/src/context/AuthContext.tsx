import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from 'react';
import type { RegisterDto, LoginDto, AuthResponse } from "../types/auth";
import { authApi } from "../api/authApi";

interface AuthContextType {
    user: AuthResponse | null;
    isAuthenticated: boolean;
    login: (data: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children } : { children: ReactNode }) => {
    const [user, setUser] = useState<AuthResponse | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
            setUser({ token, username, email: ''})
        }
    }, []);

    const login = async (data: LoginDto) => {
        const response = await authApi.login(data);
        saveSession(response);
    };

    const register = async (data: RegisterDto) => {
        const response = await authApi.register(data);
        saveSession(response);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    const saveSession = (data: AuthResponse) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setUser(data);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be within an AuthProvider');
    return context;
};