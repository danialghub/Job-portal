import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useApp } from "../context/AppProvider";
import axios from "axios";
import { toast } from "react-hot-toast";
import Modal from "../layout/Modal";
import OTP from "./OTP";

// ==========================
// Utility Functions
// ==========================
function calcTime(time) {
  return Math.floor((new Date(time) - Date.now()) / 1000);
}

function formatTime(time) {
  return `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
    Math.floor(time % 60)
  ).padStart(2, "0")}`;
}


// ==========================
// Subcomponents
// ==========================
const AuthInput = ({ icon, type, value, onChange, placeholder, ...props }) => (
  <div
    dir={type === "email" || type === "password" ? "ltr" : "rtl"}
    className="input-wrapper"
  >
    <img src={icon} alt="" className="size-5  dark:invert-0" />
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="input"
      required
      {...props}
    />
  </div>
);

const UploadLogoStep = ({ image, setImage, onBack }) => (
  <>
    <p className="text-muted"> در صورت نیاز لوگو شرکت خود را آپلود کنید</p>
    <div className=" my-10 flex items-center gap-4">
      {/* Back Button */}
      <img
        onClick={onBack}
        src={assets.back_arrow_icon}
        className="absolute top-5 left-5 cursor-pointer invert dark:invert-0"
        alt="بازگشت"
      />

      {/* Upload Logo */}
      <label htmlFor="company_logo" className="cursor-pointer ">
        <img
          className="w-14  rounded-full  ring-gray-200 dark:ring-gray-600"
          src={image ? URL.createObjectURL(image) : assets.upload_area}
          alt="لوگو"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          hidden
          id="company_logo"
        />
      </label>
      <p className="text-slate-600 dark:text-slate-200">آپلود لوگو</p>
    </div>
  </>
);

const FormSwitcher = ({ state, setState }) => (
  <p className="mt-5 text-center">
    {state === "ورود" ? (
      <>
        اکانتی نداری؟
        <span
          className="text-link"
          onClick={() => setState("ثبت نام")}
        >
          ثبت نام
        </span>
      </>
    ) : (
      <>
        از قبل اکانتی داری؟
        <span
          className="text-link"
          onClick={() => setState("ورود")}
        >
          ورود
        </span>
      </>
    )}
  </p>
);
const Button = ({ value, children, className = "", ...props }) => (
  <button
    className={className}
    {...props}
  >
    {value || children}
  </button>
);


// ==========================
// Main Component
// ==========================
const RecruiterLogin = () => {
  const navigate = useNavigate();
  const { setShowRecruiterLogin, setCompanyToken, setCompanyData } =
    useApp();

  const [state, setState] = useState("ورود"); // "ورود" | "ثبت نام"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPwd, setRepPwd] = useState("");
  const [image, setImage] = useState(null);

  const [isTextDataSubmited, setIsTextDataSubmited] = useState(false);
  const [emailVerification, setEmailVerfication] = useState(false);

  const [leftTime, setLeftTime] = useState(null);
  const [retryAfter, setRetryAfter] = useState(
    calcTime(localStorage.getItem("retryAfterTime"))
  );
  const [error, setError] = useState(false);
  const isButtonActive = !retryAfter || retryAfter <= 0 || state === "ورود";


  // ==========================
  // Handlers
  // ==========================
  const onSubmit = async (e) => {
    e.preventDefault();

    if (state === "ثبت نام" && !isTextDataSubmited && !error) {
      return setIsTextDataSubmited(true);
    }

    try {
      if (state === "ورود" && email && password) {
        const { data } = await axios.post("/api/company/login", {
          email,
          password,
        });

        if (data.success) {
          setCompanyData(data.company);
          setCompanyToken(data.token);
          axios.defaults.headers.common["token"] = data.token;
          localStorage.setItem("companyToken", data.token);
          setShowRecruiterLogin(false);
          navigate("/dashboard");
          toast.success("با موفقیت وارد شدید");
        } else {
          toast.error("ایمیل یا رمزعبور نامعتبر است!");
        }
      } else if (isTextDataSubmited) {
        if (!email.endsWith("@gmail.com"))
          return toast.error("ایمیل شما نامعتبر است");

        const { data } = await axios.post("/api/company/pre-register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setEmailVerfication(true);
          setLeftTime(calcTime(data.expiresAt));
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        const retryAfterTime = error.response.data.retryAfter;
        localStorage.setItem("retryAfterTime", retryAfterTime);
        setRetryAfter(calcTime(retryAfterTime));
      } else {
        toast.error(error.message);
      }
    }
  };

  const reSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/company/resend-code", { email });
      if (data.success) {
        toast.success("کد ورود مجدد به ایمیل شما ارسال شد");
        setLeftTime(calcTime(data.expiresAt));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const registerHandler = async (e, code) => {
    e.preventDefault();
    setError(false);
    if (code.length !== 4) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("code", code.join(""));

      const { data } = await axios.post("/api/company/register", formData);

      if (data.success) {
        setCompanyData(data.company);
        setCompanyToken(data.token);
        setShowRecruiterLogin(false);
        axios.defaults.headers.common["token"] = data.token;
        localStorage.setItem("companyToken", data.token);
        navigate("/dashboard");
        toast.success("حساب شما با موفقیت ایجاد شد");
        setError(false);
      } else {
        toast.error(data.message);
        setError(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ==========================
  // Effects
  // ==========================
  useEffect(() => {
    if (retryAfter <= 0) localStorage.removeItem("retryAfterTime");    
  }, []);

  useEffect(() => {
    if (retryAfter <= 0 && leftTime <= 0) return;

    const interval = setInterval(() => {
      if (retryAfter) setRetryAfter((prev) => prev - 1);
      if (leftTime) setLeftTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter, leftTime]);

  useEffect(() => {
    repPwd && repPwd !== password
      ? setError('پسورد و تکرار پسورد با هم مطابقت ندارند')
      : setError(false)
  }, [repPwd, password])

  // ==========================
  // Render
  // ==========================
  return (
    <Modal>
      <div className="modal">
        {!emailVerification ? (
          <form onSubmit={onSubmit} >
            <h1 className="text-center text-neutral-700 dark:text-neutral-200 font-medium text-2xl">
              {state}
            </h1>
            {state === "ورود" &&
              <p className="text-muted">
                خوش برگشتید! لطفا برای ادامه وارد شوید
              </p>
            }

            {state === "ثبت نام" && isTextDataSubmited ? (
              // upload logo
              <>
                <UploadLogoStep
                  image={image}
                  setImage={setImage}
                  onBack={() => setIsTextDataSubmited(false)}
                />
              </>
            ) : (
              // sign in or sign up
              <>
                {state !== "ورود" && (

                  <AuthInput
                    icon={assets.person_icon}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="نام شرکت"
                    minLength={5}
                  />
                )}
                <AuthInput
                  icon={assets.email_icon}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل"
                  autoComplete="email"
                />
                <AuthInput
                  icon={assets.lock_icon}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="پسورد"
                  autoComplete="current-password"
                  minLength={8}
                />
                {state !== "ورود" && (
                  <div>
                    <AuthInput
                      icon={assets.lock_icon}
                      type="password"
                      value={repPwd}
                      onChange={(e) => setRepPwd(e.target.value)}
                      placeholder="تکرار مجدد پسورد"
                      autoComplete="current-repeat-password"
                      minLength={8}
                    />
                    {error && <p className="text-sm text-red-700 dark:text-red-500 pt-2">{error}</p>}
                  </div>
                )

                }
              </>
            )}
            {/* forgot password */}
            {state === "ورود" && (
              <p className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer my-4">
                اکانتتو فراموش کردی؟
              </p>
            )}

            {/* Submit Button */}
            {isButtonActive ? (
              state == "ورود" ? (
                <Button value="وارد شوید" className="btn btn-primary" />
              ) : (
                <Button
                  value={isTextDataSubmited ? "تایید ایمیل" : "مرحله بعد"}
                  className="btn btn-primary mt-8"
                  disabled={error}
                />
              )
            ) : (
              <Button className="btn btn-secondary pointer-events-none mt-8">
                <p className="text-md tracking-widest text-white">
                  {formatTime(retryAfter)}
                </p>
              </Button>
            )}

            <FormSwitcher state={state} setState={setState} />

            <img
              onClick={() => setShowRecruiterLogin(prev => !prev)}
              className="absolute top-5 right-5 cursor-pointer invert dark:invert-0"
              src={assets.cross_icon}
              alt="بستن"
            />
          </form>
        ) : (
          <OTP
            expiresTime={{ leftTime, handler: () => formatTime(leftTime) }}
            registerHandler={registerHandler}
            reSendOtp={reSendOtp}
            setEmailVerfication={setEmailVerfication}
            error={error}
          />
        )}
      </div>
    </Modal>
  );

};

export default RecruiterLogin;
