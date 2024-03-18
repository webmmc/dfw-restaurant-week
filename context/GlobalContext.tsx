import { useState, createContext } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const GlobalContext = createContext({
  recaptchav3Token: "",
  setRecaptchav3Token: (token) => {},
  refreshReCaptcha: false,
  setRefreshReCaptcha: (refresh) => {},
});

export const GlobalProvider = ({ children }) => {
  const [recaptchav3Token, setRecaptchav3Token] = useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        recaptchav3Token,
        setRecaptchav3Token,
        refreshReCaptcha,
        setRefreshReCaptcha,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
