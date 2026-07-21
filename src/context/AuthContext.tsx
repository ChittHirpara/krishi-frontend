import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthContextType, User, UserRole } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (role: UserRole) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    setUser({
      id: Math.random().toString(36).substring(7),
      name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `${role}@example.com`,
      role,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
