import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../interfaces/IAuthResponse';
import { getStoredUser, clearTokens } from '../services/authService';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing user on mount
        const storedUser = getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        clearTokens();
        setUser(null);
    };

    const isAuthenticated = !!user;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
