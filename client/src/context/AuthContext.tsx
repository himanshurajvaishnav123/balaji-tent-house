import React, { createContext, useContext, useEffect, useState } from 'react';
import { IUser } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: IUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('btk_token');
      const storedUser = localStorage.getItem('btk_user');

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('btk_user');
        }
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('btk_user', JSON.stringify(res.data.user));
        }
      } catch (error) {
        if (!storedToken) {
          setUser(null);
          localStorage.removeItem('btk_user');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const loggedUser: IUser = res.data.user;
        setUser(loggedUser);
        localStorage.setItem('btk_user', JSON.stringify(loggedUser));
        if (res.data.token) {
          localStorage.setItem('btk_token', res.data.token);
        }
        return { success: true };
      }
      return { success: false, message: res.data?.message || 'Login failed.' };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials or server unreachable.',
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('btk_token');
      localStorage.removeItem('btk_user');
    }
  };

  const updateUser = (updatedUser: IUser) => {
    setUser(updatedUser);
    localStorage.setItem('btk_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
