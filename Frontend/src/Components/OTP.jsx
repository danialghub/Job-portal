import { useEffect, useRef, useState } from "react";



// OTPInput - a 4-digit OTP input component with Tailwind styling
// Features:
// - 4 inputs (configurable via `length` prop)
// - auto-advance and auto-backspace behavior
// - paste support (pasting digits fills the inputs left-to-right)
// - keyboard accessible (ArrowLeft/ArrowRight/Backspace)
// - calls onComplete(code) when all inputs are filled

export default function OTP({
    length = 4,
    register,
    className = "",
    expiresTime,
}) {

    const [values, setValues] = useState(() => Array(length).fill(""));
    const [timeLeft, setTimeLeft] = useState(
        Math.floor((new Date(expiresTime) - new Date()) / 1000)
    )
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
        // focus first input on mount
        if (inputsRef.current[0]) inputsRef.current[0].focus();


        if (timeLeft <= 0) return

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000);

        return () => clearInterval(interval)




    }, [timeLeft]);

    useEffect(() => {
        checkingInput()

    }, [values]);

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
        <form dir="ltr" className="flex flex-col gap-8" onSubmit={e => register(e, values)}>

            <h3 className="text-center  text-xl  font-bold text-black/60"> OTP احراز هویت </h3>
            <div

                className={`flex gap-4 justify-center items-center ${className}`}>
                {Array.from({ length }).map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={values[i]}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        onPaste={(e) => handlePaste(e, i)}
                        aria-label={`OTP digit ${i + 1}`}
                        className={`size-12 rounded-lg text-center text-xl font-medium border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2  focus:ring-blue-200 transition-shadow`}
                    />
                ))}
            </div>

            <div className="flex flex-col gap-3  items-end">
                {/* <button className="cursor-pointer">ارسال مجدد کد</button> */}
                <p className="text-md tracking-widest ">{timeLeft}</p>
                <button
                    type="submit"
                    className="text-lg w-full py-1 border-4 border-blue-100 text-blue-500 rounded-md cursor-pointer ">تایید</button>
            </div>
        </form>
    );
}
