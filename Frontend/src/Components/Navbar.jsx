import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useUser, useClerk, UserButton } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

import { HiOutlineViewGridAdd } from "react-icons/hi";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { MdOutlineLightMode } from "react-icons/md";

const Navbar = ({ children }) => {
    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()

    const { setShowRecruiterLogin, companyData, companyToken, logoutHandler } = useContext(AppContext)

    return (
        <div className='shadow py-4  '>
            <div className='container min-w-max px-8 2xl:px-20 flex justify-between items-center mx-auto '>
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
                            ? (<div className='flex items-center gap-6 max-sm:text-sm'>



                                <div className='flex items-center gap-6 sm:gap-10'>
                                    <div className='relative group '>

                                        <img
                                            className='size-8 sm:size-10 scale-125 border rounded-full shadow-md'
                                            src={companyData.image} alt="" />

                                        <div className='hidden absolute group-hover:block top-0 left-0  sm:left-0 z-10 text-black rounded pt-12 '>
                                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm shadow '>
                                                <li onClick={logoutHandler} className='py-2 pl-8 cursor-pointer flex items-center gap-2 px-6 border-b-2 mb-2'>
                                                    <FaUser />
                                                    {companyData.name}
                                                </li>
                                                {children || <li className='py-2   cursor-pointer  pr-1 '>

                                                    <Link to="/dashboard" 
                                                    className='flex items-center gap-2'
                                                    >
                                                        <HiOutlineViewGridAdd fontSize={19} />
                                                        داشبورد
                                                    </Link>
                                                </li>
                                                }

                                                <li onClick={logoutHandler} className='py-2  cursor-pointer flex items-center gap-2 pr-1'>
                                                    <FaArrowRightFromBracket />
                                                    خروج
                                                </li>
                                            </ul>

                                        </div>

                                    </div>
                                    <MdOutlineLightMode fontSize={35} cursor='pointer' />
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