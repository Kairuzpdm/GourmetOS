import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    token: sessionStorage.getItem('token') || null,
    isAuthenticated: !!sessionStorage.getItem('token'),
    login: (userData, token) => {
        sessionStorage.setItem('user', JSON.stringify(userData));
        sessionStorage.setItem('token', token);
        set({ user: userData, token, isAuthenticated: true });
    },
    logout: () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));
