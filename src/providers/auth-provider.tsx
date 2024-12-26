import React, { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("authToken")
    );
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    const login = (newToken: string) => {
        if (!newToken) {
            throw new Error("Token is required to login");
        }

        localStorage.setItem("authToken", newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setIsAuthenticated(false);
    };

    const value: AuthContextType = {
        token,
        isAuthenticated: isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
