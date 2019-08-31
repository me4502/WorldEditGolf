import React, {useContext, FunctionComponent, useState} from 'react';

const AuthContext = React.createContext<{token?: string, setToken: (value?: string) => void}>({
    token: undefined,
    setToken: () => {}
});

export const AuthProvider: FunctionComponent = ({children}) => {
    const [token, setToken] = useState<string>();
    return (<AuthContext.Provider value={{token, setToken}}>
        {children}
    </AuthContext.Provider>);
}

export const useSetToken: () => (value?: string) => void = () => {
    const {setToken} = useContext(AuthContext);
    return setToken;
};

export const useIsLoggedIn: () => boolean = () => {
    const {token} = useContext(AuthContext);
    return !!token;
}
