import { useContext, forwardRef, useImperativeHandle, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import GlobalContext from "../context/GlobalContext";

import CustomReCaptchaComponent from "./CustomRecaptchaComponent";

const contactFormSchema = z.object({
  rw_dfw_form_name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name should be a string",
    })
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(120, { message: "Name must be at most 50 characters" }),
  rw_dfw_form_email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email should be a string",
    })
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  rw_dfw_form_message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(500, { message: "Message must be at most 500 characters" }),
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

type ContactFormInputs = z.infer<typeof contactFormSchema>;

type Props = {
  onSubmit: (data: ContactFormInputs) => void;
};

const ContactForm = ({ onSubmit }: Props, ref) => {
  // register form fields
  // https://react-hook-form.com/api/useform/register
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const { recaptchav3Token, setRefreshReCaptcha } = useContext(GlobalContext);

  // set reCAPTCHA v3 token value on component mount
  useEffect(() => {
    // set reCAPTCHA v3 token
    setValue("_wpcf7_recaptcha_response", recaptchav3Token);
  }, [recaptchav3Token, setValue]);

  // expose resetForm function to parent component
  useImperativeHandle(ref, () => ({
    resetForm() {
      reset();
      // reset reCAPTCHA v3
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
              {...register("rw_dfw_form_name")}
            />
            {errors.rw_dfw_form_name && (
              <span className="text-red">
                {errors.rw_dfw_form_name.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              className="border border-gray-300 p-2"
              {...register("rw_dfw_form_email")}
            />
            {errors.rw_dfw_form_email && (
              <span className="text-red">
                {errors.rw_dfw_form_email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              className="border border-gray-300 p-2"
              {...register("rw_dfw_form_message")}
            />
            {errors.rw_dfw_form_message && (
              <span className="text-red">
                {errors.rw_dfw_form_message.message}
              </span>
            )}
          </div>
          {/* Honeypot */}
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
            Submit
          </button>
        </form>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default forwardRef(ContactForm);
