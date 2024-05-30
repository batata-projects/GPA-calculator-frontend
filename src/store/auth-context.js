import { createContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  onLogout: () => {},
  onLogin: (email, password) => {},
  onSignup: (email, username, password) => {},  // Add the onSignup function
});

export const AuthContextProvider = props => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

    if (+storedUserLoggedInInformation) setIsLoggedIn(true);
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const loginHandler = (email, password) => {
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const signupHandler = (email, username, password) => {
    console.log(`Signed up with Email: ${email}, Username: ${username}, Password: ${password}`);
    // Implement your signup logic here
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        onSignup: signupHandler,  // Provide the onSignup function
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
