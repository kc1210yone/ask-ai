'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';

interface ContextValue {
  email: string | null;
  setEmail: (email: string | null) => void;
}

const AuthContext = createContext<ContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props): ReactNode => {
  const [email, setEmail] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): ContextValue => {
  const contextValue = useContext(AuthContext);
  invariant(contextValue, 'AuthContext.Provider required.');
  return contextValue;
};
