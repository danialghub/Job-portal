import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import OTP from './OTP'

const RecruiterLogin = () => {

    const navigate = useNavigate()
    const [state, setState] = useState('ورود')

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [image, setImage] = useState(false)

    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)
    const [emailVerification, setEmailVerfication] = useState(false)
    const [leftTime, setLeftTime] = useState(null)

    const { setShowRecruiterLogin, setCompanyToken, setCompanyData } = useContext(AppContext)



    const preRegister = async (e) => {
        e.preventDefault()
        if (state == "ثبت نام" && !isTextDataSubmited) {
            return setIsTextDataSubmited(true)
        }
        try {

            if (state == "ورود") {
                const { data } = await axios.post("/api/company/login", { email, password })
                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    axios.defaults.headers.common['token'] = data.token
                    localStorage.setItem('companyToken', data.token)
                    setShowRecruiterLogin(false)
                    navigate('/dashboard')
                    toast.success("با موفقیت وارد شدید")

                } else {
                    toast.error("ایمیل یا رمزعبور نامعتبر است!")
                }
            } else {
                const formData = new FormData()
                formData.append('name', name)
                formData.append('email', email)
                formData.append('password', password)
                formData.append('image', image)

                const { data } = await axios.post("/api/company/pre-register", formData)
                if (data.success) {
                    setEmailVerfication(true)
                    setLeftTime(data.expiresAt)

                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    const register = async (e, code) => {
        e.preventDefault()

        try {
            if (code.length == 4) {

                const { data } = await axios.post('/api/company/register', { email },
                    { headers: { code: code.join('') } }
                )
                if (data.success) {
                    setCompanyData(data.company)
                    setCompanyToken(data.token)
                    setShowRecruiterLogin(false)
                    axios.defaults.headers.common['token'] = data.token
                    localStorage.setItem('companyToken', data.token)
                    navigate('/dashboard')
                    toast.success("حساب شما با موفقیت ایجاد شد")
                } else {
                    toast.error(data.message)
                }
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    useEffect(() => {
        document.body.style.overflow = "hidden"
        scrollTo(0, 0)
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [])

    return (
        <AnimatePresence>
            <div

                className='absolute top-0 left-0 right-0 bottom-0  z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.50 }}
                    className='bg-white p-10 rounded-xl text-slate-500 relative'>
                    {!emailVerification ?
                        <form
                            onSubmit={preRegister}
                        >
                            <h1 className='text-center text-neutral-700 font-medium text-2xl'> {state}</h1>
                            <p className='text-sm my-2'>خوش برگشتید! لطفا برای ادامه وارد شوید</p>
                            {state == "ثبت نام" && isTextDataSubmited ? (
                                <>
                                    <div className='flex items-center gap-4 my-10'>
                                        <label htmlFor="company_logo">
                                            <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                                            <input
                                                type="file"
                                                accept='images/*'
                                                onChange={e => setImage(e.target.files[0])}
                                                hidden id="company_logo" />
                                        </label>
                                        <p>آپلود لوگو </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {state !== "ورود" && (
                                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                            <img src={assets.person_icon} alt="" />
                                            <input

                                                className='outline-none text-sm'
                                                onChange={e => setName(e.target.value)}
                                                value={name}
                                                type="text" placeholder='نام شرکت' required />
                                        </div>
                                    )}
                                    <div dir='ltr' className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                        <img src={assets.email_icon} alt="" />
                                        <input
                                            className='outline-none text-sm'
                                            onChange={e => setEmail(e.target.value)}
                                            value={email}
                                            type="email" placeholder='ایمیل' required />
                                    </div>
                                    <div dir='ltr' className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                        <img src={assets.lock_icon} alt="" />
                                        <input
                                            className='outline-none text-sm'
                                            onChange={e => setPassword(e.target.value)}
                                            value={password}
                                            type="password" placeholder='پسورد' required />
                                    </div>
                                </>
                            )}

                            {state == "ورود" && <p className='text-sm text-blue-600 cursor-pointer my-4'>اکانتتو فراموش کردی؟</p>}
                            <button className='bg-blue-600 w-full text-white py-2 rounded-full mt-4'>
                                {
                                    state == "ورود" ? 'وارد شوید' : isTextDataSubmited ? "تایید ایمیل" : "مرحله بعد"
                                }
                            </button>
                            {state == "ورود"
                                ? (
                                    <p className='mt-5 text-center'>اکانتی نداری؟
                                        <span
                                            className='text-blue-600 cursor-pointer mr-1'
                                            onClick={() => setState("ثبت نام")}
                                        >ثبت نام</span>
                                    </p>
                                ) : (
                                    <p className='mt-5 text-center'>از قبل اکانتی داری؟
                                        <span
                                            className='text-blue-600 cursor-pointer mr-1'
                                            onClick={() => setState("ورود")}
                                        >ورود</span>
                                    </p>
                                )}

                            <img
                                onClick={() => setShowRecruiterLogin(false)}
                                className='absolute top-5 right-5 cursor-pointer'
                                src={assets.cross_icon}
                                alt="" />
                        </form>
                        : <OTP expiresTime={leftTime} register={register} />

                    }
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default RecruiterLogin