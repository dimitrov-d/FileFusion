import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  privateMode: boolean;
  setPrivateMode: (privateMode: boolean) => void;
  storageMode: boolean;
  setStorageMode: (storageMode: boolean) => void;
  transferMode: boolean;  
  setTransferMode: (transferMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [privateMode, setPrivateMode] = useState<boolean>(false);
  const [storageMode, setStorageMode] = useState<boolean>(false);
  const [transferMode, setTransferMode] = useState<boolean>(true);

  return (
    <AuthContext.Provider
      value={{
        email,
        setEmail,
        isAuthenticated,
        setIsAuthenticated,
        privateMode,
        setPrivateMode,
        storageMode,
        setStorageMode,
        transferMode,
        setTransferMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
