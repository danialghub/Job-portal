import { useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";


// OTPInput - a 4-digit OTP input component with Tailwind styling
// Features:
// - 4 inputs (configurable via `length` prop)
// - auto-advance and auto-backspace behavior
// - paste support (pasting digits fills the inputs left-to-right)
// - keyboard accessible (ArrowLeft/ArrowRight/Backspace)
// - calls onComplete(code) when all inputs are filled

export default function OTP({
    length = 4,
    registerHandler,
    expiresTime,
    reSendOtp,
    setEmailVerfication,
    error
}) {

    const [values, setValues] = useState(() => Array(length).fill(""));
    const inputsRef = useRef([]);

    const checkingInput = () => {
        if (values.every((v) => v !== "")) {
            inputsRef.current.map((inp, idx) => {
                setTimeout(() => {
                    inp.className += ' ring-2 ring-green-500 focus:ring-green-500 '
                }, (100 + (idx + 1) ** 4));
            })

        } else {
            inputsRef.current.map((inp) => {
                if (inp.className.includes(' ring-2 ring-green-500 focus:ring-green-500 '))
                    inp.className = inp.className.replace(' ring-2 ring-green-500 focus:ring-green-500 ', "")
            })

        }
    }


    useEffect(() => {
        checkingInput()

    }, [values]);

    useEffect(() => {
        // focus first input on mount
        if (inputsRef.current[0]) inputsRef.current[0].focus();
    }, [])

    function focusInput(idx) {
        const ref = inputsRef.current[idx];
        if (ref) ref.focus();
    }

    function handleChange(e, idx) {
        const raw = e.target.value;
        // only keep digits
        const digit = raw.replace(/\D/g, "");
        if (!digit) return; // ignore non-digit

        // We only take the first character (user may paste multiple; paste handled separately)
        const char = digit[0];
        setValues((prev) => {
            const next = [...prev];
            next[idx] = char;
            return next;
        });

        // move focus to next
        if (idx + 1 < length) focusInput(idx + 1);
    }

    function handleKeyDown(e, idx) {
        const key = e.key;
        if (key === "Backspace") {
            e.preventDefault();
            setValues((prev) => {
                const next = [...prev];
                if (next[idx] !== "") {
                    // clear current
                    next[idx] = "";
                } else if (idx > 0) {
                    // move to previous and clear it
                    next[idx - 1] = "";
                    focusInput(idx - 1);
                }
                return next;
            });
            return;
        }

        if (key === "ArrowLeft" && idx > 0) {
            e.preventDefault();
            focusInput(idx - 1);
            return;
        }
        if (key === "ArrowRight" && idx + 1 < length) {
            e.preventDefault();
            focusInput(idx + 1);
            return;
        }

        // prevent non-digit typing
        if (!/^[0-9]$/.test(key) && key.length === 1) {
            e.preventDefault();
        }
    }

    function handlePaste(e, idx) {
        e.preventDefault();
        const paste = e.clipboardData.getData("text");
        const digits = paste.replace(/\D/g, "").split("");
        if (digits.length === 0) return;

        setValues((prev) => {
            const next = [...prev];
            let writeIdx = idx;
            for (let d of digits) {
                if (writeIdx >= length) break;
                next[writeIdx] = d;
                writeIdx++;
            }
            // after setting, focus the next empty input or last
            setTimeout(() => {
                const firstEmpty = next.findIndex((v) => v === "");
                if (firstEmpty === -1) focusInput(length - 1);
                else focusInput(firstEmpty);
            }, 0);
            return next;
        });
    }


    return (
        <form
            dir="ltr"
            className="flex flex-col gap-8"
            onSubmit={(e) => registerHandler(e, values)}
        >
            {/* Back Button */}
            <img
                onClick={() => setEmailVerfication(false)}
                src={assets.back_arrow_icon}
                className="absolute top-5 left-5 cursor-pointer invert dark:invert-0 "
                alt="بازگشت"
            />

            {/* Title */}
            <h3 className="text-center text-xl font-bold text-slate-700 dark:text-slate-200">
                OTP احراز هویت
            </h3>

            {/* OTP Inputs */}
            <div className="flex gap-4 justify-center items-center">
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={values[i]}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={(e) => handlePaste(e, i)}
                        className={`
            size-12 rounded-lg text-center text-xl font-medium
            border-2 
            ${error ? " animate-shake" : "border-gray-200 dark:border-gray-600"} 
            bg-white dark:bg-slate-800 
            text-slate-800 dark:text-slate-100
            focus:border-blue-400 focus:outline-none
            focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500
            transition-all
          `}
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 items-end">
                {expiresTime.leftTime <= 0 ? (
                    <button
                        onClick={reSendOtp}
                        type="button"
                        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline mb-1"
                    >
                        ارسال مجدد کد
                    </button>
                ) : (
                    <p className="text-md tracking-widest text-slate-700 dark:text-slate-300">
                        {expiresTime.handler()}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!expiresTime.leftTime <= 0}
                    className={`
          text-lg w-full py-2 border-2 rounded-md font-medium transition-colors duration-200 ease-in-out cursor-pointer
          ${!expiresTime.leftTime <= 0
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "border-blue-200 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-gray-100"
                        }
        `}
                >
                    تایید
                </button>
            </div>
        </form>
    );

}
