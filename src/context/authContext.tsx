"use client";
import { createContext, useContext, useEffect, useState } from "react";
interface User{
    id: string;
    email: string;
    exp: number;
}

interface AuthContextType {
    authUser: User | null;
    authToken: string | null;
    authLogin: (newToken: string) => void;
    authLogout: () => void;
}

const AuthContext = createContext<AuthContextType|null>(null);

function parseJwt(token: string): User {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
}

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            const parsed = parseJwt(storedToken);
            setAuthToken(storedToken);
            setAuthUser(parsed);
        }
    }, []);

    function authLogin(newToken: string) {
        setAuthToken(newToken);
        setAuthUser(parseJwt(newToken));
        localStorage.setItem('token', newToken);
    }

    function authLogout() {
        setAuthToken(null);
        setAuthUser(null);
        localStorage.removeItem('token');
    }

    return (
        <AuthContext.Provider value={{ authUser, authToken, authLogin, authLogout }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}