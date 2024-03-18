import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback, useEffect, useContext } from "react";

import GlobalContext from "../context/GlobalContext";

const CustomReCaptchaComponent = () => {
  const {
    recaptchav3Token,
    setRecaptchav3Token,
    refreshReCaptcha,
    setRefreshReCaptcha,
  } = useContext(GlobalContext);

  const { executeRecaptcha } = useGoogleReCaptcha();

  // handle recaptcha when it is ready
  const handleExcutingRecaptcha = useCallback(
    async (action) => {
      try {
        const token = await executeRecaptcha(action);
        // set the token state so that it can be passed to the contact form
        setRecaptchav3Token(token);
      } catch (err) {
        console.log("Error:", err);
      }
    },
    [executeRecaptcha, setRecaptchav3Token]
  );

  // Create an event handler so you can call the verification on button click event or form submit
  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    if (refreshReCaptcha) {
      console.log("Refresh recaptcha");
      // Reset the state since we will try to load the recaptcha again.
      setRefreshReCaptcha(false);
      await handleExcutingRecaptcha("refreshAction");
      return;
    }
    if (!recaptchav3Token) {
      await handleExcutingRecaptcha("initialAction");
    }
  }, [
    executeRecaptcha,
    handleExcutingRecaptcha,
    recaptchav3Token,
    refreshReCaptcha,
    setRefreshReCaptcha,
  ]);

  // You can use useEffect to trigger the verification as soon as the component being loaded
  useEffect(() => {
    handleReCaptchaVerify();
    return () => {};
  }, [handleReCaptchaVerify]);

  return null;
};

export default CustomReCaptchaComponent;
