
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/types/expense';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('expense_token');
    const user = localStorage.getItem('expense_user');
    
    if (token && user) {
      setAuthState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
    };
    
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('expense_token', mockToken);
    localStorage.setItem('expense_user', JSON.stringify(mockUser));
    
    setAuthState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      name,
    };
    
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('expense_token', mockToken);
    localStorage.setItem('expense_user', JSON.stringify(mockUser));
    
    setAuthState({
      user: mockUser,
      token: mockToken,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('expense_token');
    localStorage.removeItem('expense_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
