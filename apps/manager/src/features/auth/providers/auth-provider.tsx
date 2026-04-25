'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import invariant from 'tiny-invariant';

interface ContextValue {
  username: string | null;
  setUsername: (username: string | null) => void;
}

const AuthContext = createContext<ContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props): ReactNode => {
  const [username, setUsername] = useState<string | null>(null);
  return (
    <AuthContext value={{ username, setUsername }}>{children}</AuthContext>
  );
};

export const useAuth = (): ContextValue => {
  const contextValue = useContext(AuthContext);
  invariant(contextValue, 'AuthContext required.');
  return contextValue;
};
