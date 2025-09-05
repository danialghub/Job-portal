import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useUser, useClerk, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
const Navbar = ({ children }) => {
    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()

    const { setShowRecruiterLogin, companyData, companyToken, logoutHandler } = useContext(AppContext)

    return (
        <div className='shadow py-4  '>
            <div className='container min-w-max px-6 2xl:px-20 flex justify-between items-center mx-auto '>
                <img
                    className=' h-8 scale-125 sm:scale-150  cursor-pointer'
                    src={assets.dlLogo} onClick={() => { navigate('/'); scrollTo(0, 500) }} alt="" />
                {
                    user
                        ? (
                            <div className='flex items-center gap-3 max-sm:gap-2 max-sm:text-sm'>
                                <Link to="/applications">کارهای درخواستی</Link>
                                <p>|</p>
                                <p className='max-sm:hidden'>سلام, {user.firstName + " " + user.lastName}</p>
                                <UserButton />
                            </div>
                        ) : companyToken && companyData
                            ? (<div className='flex items-center gap-3 max-sm:text-sm'>

                                <p >خوش آمدی ,{companyData.name}</p>
                                <p>|</p>
                                <div className='relative group'>
                                    <img
                                        className='w-8 border rounded-full'
                                        src={companyData.image} alt="" />

                                    <div className='hidden absolute group-hover:block top-0 left-5 sm:left-0 z-10 text-black rounded pt-12 '>
                                        <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm shadow '>
                                            {children || <li className='py-2 px-4 cursor-pointer pr-10'>
                                                <Link to="/dashboard">داشبورد</Link>
                                            </li>}

                                            <li onClick={logoutHandler} className='py-2 px-4 cursor-pointer pr-10'>خروج</li>
                                        </ul>
                                    </div>
                                </div>

                            </div>)
                            : (
                                <div className='flex gap-4 max-sm:text-sm'>
                                    <button
                                        onClick={() => setShowRecruiterLogin(true)}
                                        className='text-gray-600'>ورود کارفرما</button>
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