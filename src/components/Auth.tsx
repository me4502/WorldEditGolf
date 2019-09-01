import React, {
  useContext,
  FunctionComponent,
  useState,
  useEffect
} from 'react';

const getToken = () =>
  typeof window !== 'undefined' ? window.localStorage.getItem('token') : ' ';

const AuthContext = React.createContext<{
  token?: string;
  setToken: (value?: string) => void;
}>({
  token: getToken(),
  setToken: () => {}
});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [token, setToken] = useState<string>(getToken());

  useEffect(() => {
    setToken(getToken());
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSetToken: () => (value?: string) => void = () => {
  const { setToken } = useContext(AuthContext);

  const set = (value: string) => {
    window.localStorage.setItem('token', value);
    setToken(value);
  };

  return set;
};

export const useIsLoggedIn: () => boolean = () => {
  const { token } = useContext(AuthContext);
  return !!token;
};
