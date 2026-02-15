import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            // We'll use the dashboard endpoint to check if we are logged in, 
            // as it returns user data if authorized, or redirects/errors if not.
            // Alternatively, we could create a specific /auth/me endpoint.
            // For now, let's try to hit dashboard.
            const res = await axios.get('/dashboard');
            if (res.data.user) {
                setUser(res.data.user);
            }
        } catch (err) {
            console.log("Not logged in");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        if (res.data.user) {
            setUser(res.data.user);
            return true;
        }
        return false;
    };

    const logout = async () => {
        await axios.get('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
