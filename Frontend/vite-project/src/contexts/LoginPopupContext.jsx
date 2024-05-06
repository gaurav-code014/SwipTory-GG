import React from 'react';

const LoginPopupContext = React.createContext({
 toggleLoginPopup: () => {},
});

export const LoginPopupProvider = LoginPopupContext.Provider;
export const useLoginPopup = () => React.useContext(LoginPopupContext);

export default LoginPopupContext;
