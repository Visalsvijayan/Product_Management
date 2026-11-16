import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    // Only "loading" if there is a token that needs verifying
    const [loading, setLoading] = useState(
        () => Boolean(localStorage.getItem("token"))
    );

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
    }, []);

    // 1. Verify token with backend on app start / page refresh
    useEffect(() => {

        const token = localStorage.getItem("token");
        if (!token) return;

        let cancelled = false;

        API.get("/auth/me")
            .then(({ data }) => {
                if (!cancelled) setUser(data.user);
            })
            .catch((error) => {
                // Only drop the token if the backend rejected it,
                // not when the server is simply unreachable
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };

    }, []);

    // 2. If any later request returns 401 (e.g. token expired after 1h), log out
    useEffect(() => {

        const id = API.interceptors.response.use(
            (response) => response,
            (error) => {
                if (
                    error.response?.status === 401 &&
                    localStorage.getItem("token")
                ) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => API.interceptors.response.eject(id);

    }, [logout]);

    // Called by Login page after /auth/login succeeds
    const login = useCallback(async (token) => {

        localStorage.setItem("token", token);

        try {
            const { data } = await API.get("/auth/me");
            setUser(data.user);
        } catch (error) {
            localStorage.removeItem("token");
            throw error;
        }

    }, []);

    const value = useMemo(
        () => ({ user, loading, isAuthenticated: Boolean(user), login, logout }),
        [user, loading, login, logout]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}