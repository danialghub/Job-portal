import { assets } from '../assets/assets'
import { useUser, useClerk, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Warning from './Modal/Warning';
import { useModal } from '../hooks/useModal';

//________Theme Toggle Button component

const ThemeToggle = () => {
    const { theme, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`relative w-16 h-7 sm:w-20 sm:h-9 flex items-center
        bg-white/30 dark:bg-slate-800/60
        backdrop-blur-xl border border-white/20
        rounded-full  transition-all duration-500`}
            dir="rtl"
        >
            <div
                className={`flex w-full h-fit items-center transition-all duration-500 ${theme === "dark" ? "justify-end" : "justify-start"
                    }`}
            >
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="size-7 sm:size-8 rounded-full flex items-center justify-center
            bg-white dark:bg-yellow-600 shadow-lg overflow-hidden "
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {theme === "dark" ? (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, scale: 0.6, x: 10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.6, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="text-gray-100 max-sm:size-5" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, scale: 0.6, x: -10 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.6, x: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Moon className="text-slate-800" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </button>
    );
};


const Navbar = ({ children }) => {

    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()

    const { setShowRecruiterLogin, companyData, companyToken, logoutHandler } = useApp()
    const [warningModal , openWarningModal,closeWarningModal ] = useModal()



    return (
        <div
            className='sticky top-0  z-50 shadow py-4  backdrop-blur-sm dark:bg-slate-900/20 dark:text-gray-100'>
                 <Warning
                open={warningModal}
                onClose={closeWarningModal}
                onConfirm={logoutHandler}
                />
            <div className='container min-w-max px-4 2xl:px-16 flex justify-between items-center mx-auto '>
               
                <div className='flex items-center gap-5 sm:gap-12'>
                    <img
                        className=' h-8 scale-125 sm:scale-150 mr-2  dark:invert dark:hue-rotate-180 cursor-pointer'
                        src={assets.dlLogo} onClick={() => { navigate('/'); scrollTo(0, 500) }} alt="" />

                    <ThemeToggle />
                </div>
                {user
                    ? (
                        <div className='flex items-center gap-3 max-sm:gap-2 max-sm:text-sm'>
                            <Link to="/applications">کارهای درخواستی</Link>
                            <p>|</p>
                            <p className='max-sm:hidden'>سلام, {user.firstName + " " + user.lastName}</p>
                            <UserButton />
                        </div>
                    ) : companyToken && companyData
                        ? (

                            <div className='flex items-center ml-4 gap-6 sm:gap-10'>
                                <div className='relative group cursor-pointer'>

                                    <img
                                        className='size-8 sm:size-10 scale-125  rounded-full shadow-md'
                                        src={companyData.image ? companyData.image : assets.avatar_icon} alt="" />

                                    <div className='hidden absolute group-hover:block top-0 left-0  sm:left-0 z-10 text-black rounded pt-12 '>
                                        <ul className='list-none m-0 p-2 bg-white dark:bg-slate-900 dark:text-gray-100 rounded-md border-gray-200 text-sm shadow-2xl dark:border-slate-800 '>
                                            <li onClick={logoutHandler} className='py-2 pl-8 cursor-pointer flex items-center gap-2 px-6 border-gray-300 border-b-2 mb-2'>
                                                <FaUser />
                                                {companyData.name}
                                            </li>

                                            {children ||
                                                <li className='py-2  cursor-pointer  hover:bg-gray-100 dark:hover:bg-gray-800 pr-1 '>

                                                    <Link to='/dashboard'
                                                        className='flex items-center gap-2'
                                                    >
                                                        <HiOutlineViewGridAdd fontSize={19} />
                                                        داشبورد
                                                    </Link>
                                                </li>
                                            }

                                            <li onClick={openWarningModal} className='py-2  cursor-pointer flex items-center gap-2 pr-1 hover:bg-gray-100 dark:hover:bg-gray-800'>
                                                <FaArrowRightFromBracket />
                                                خروج
                                            </li>
                                        </ul>

                                    </div>

                                </div>

                            </div>

                        )
                        : (
                            <div className='flex gap-4 max-sm:text-sm'>
                                <button
                                    onClick={() => setShowRecruiterLogin(prev => !prev)}
                                    className='text-gray-600 dark:text-gray-100'>ورود کارفرما</button>
                                <button
                                    onClick={() => openSignIn()}
                                    className='bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full'>ورود </button>
                            </div>
                        )}




            </div>
        </div>
    )
}

export default Navbar