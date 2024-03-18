import React, {
  useContext,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import GlobalContext from "../context/GlobalContext";
import CustomReCaptchaComponent from "./CustomRecaptchaComponent";

const signupFormSchema = z.object({
  rw_dfw_signup_name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name should be a string",
    })
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(120, { message: "Name must be at most 50 characters" }),
  rw_dfw_signup_email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string",
    })
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  _wpcf7_recaptcha_response: z
    .string({
      required_error: "Please complete the reCAPTCHA",
    })
    .nonempty({
      message: "Please complete the reCAPTCHA",
    }), // "_wpcf7_recaptcha_response
  // honeypot
  _gotcha: z.string().max(0),
});

type SignupFormInputs = z.infer<typeof signupFormSchema>;

type Props = {
  onSubmit: (data: SignupFormInputs) => void;
};

const SignupForm = ({ onSubmit }: Props, ref) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupFormSchema),
  });

  const { recaptchav3Token, setRefreshReCaptcha } = useContext(GlobalContext);

  // set reCAPTCHA v3 token value on component mount
  useEffect(() => {
    // set reCAPTCHA v3 token
    setValue("_wpcf7_recaptcha_response", recaptchav3Token);
  }, [recaptchav3Token, setValue]);

  useImperativeHandle(ref, () => ({
    resetForm() {
      reset();
      setRefreshReCaptcha((r) => !r);
    },
  }));

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6Lc2mKUmAAAAAKtN-UO5gWmPi6aF-XsMDLnFzo4k"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
        nonce: undefined,
      }}
    >
      <div className="container mx-auto px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
          method="POST"
        >
          <div className="flex flex-col space-y-2">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="border border-gray-300 p-2"
              {...register("rw_dfw_signup_name")}
            />
            {errors.rw_dfw_signup_name && (
              <span className="text-red">
                {errors.rw_dfw_signup_name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className="border border-gray-300 p-2"
              {...register("rw_dfw_signup_email")}
            />
            {errors.rw_dfw_signup_email && (
              <span className="text-red">
                {errors.rw_dfw_signup_email.message}
              </span>
            )}
          </div>
          <input type="hidden" name="_gotcha" {...register("_gotcha")} />
          {/* reCAPTCHA v3 */}
          {/* This will intialize the recaptcha component */}
          <CustomReCaptchaComponent />
          {/* reCAPTCHA v3 token */}
          <input
            type="hidden"
            value={recaptchav3Token}
            {...register("_wpcf7_recaptcha_response")}
          />
          {errors._wpcf7_recaptcha_response && (
            <>
              <span className="text-red">
                {errors._wpcf7_recaptcha_response.message}
              </span>
              <button
                className="site-btn site-btn--primary"
                onClick={() => setRefreshReCaptcha(true)}
              >
                Click here to Refresh Captcha
              </button>
            </>
          )}
          <p>
            <small>
              <strong>
                By clicking Submit, you acknowledge you have read and agree to
                Audacy’s Website and Digital Terms of Use and Privacy Policy.
              </strong>
            </small>
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="site-btn site-btn--primary"
          >
            Get updates
          </button>
        </form>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default forwardRef(SignupForm);
