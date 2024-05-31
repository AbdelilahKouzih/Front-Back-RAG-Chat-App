import React, { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  user: { id: number; role: string } | null;
  setUser: (user: { id: number; role: string } | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: number; role: string } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
