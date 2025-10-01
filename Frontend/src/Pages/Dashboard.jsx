import { useEffect } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useApp } from '../context/AppProvider'
import Navbar from '../Components/Navbar'
import { FaHome } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate()
    const { companyData } = useApp()

    const navMenu = [
        { title: 'ایجاد کار', route: '/dashboard/add-job', icon: assets.add_icon },
        { title: 'مدیریت کارها', route: '/dashboard/manage-jobs', icon: assets.home_icon },
        { title: 'مشاهده درخواست ها', route: '/dashboard/view-applications', icon: assets.person_tick_icon },
        { title: 'پروفایل', route: '/dashboard/profile', icon: assets.profile_icon },
    ]

    useEffect(() => {
        if (companyData && location.pathname === "/dashboard") {
            navigate('/dashboard/manage-jobs')
        }
        scrollTo(0, 0)
    }, [companyData])
    return (

        <div className='h-screen bg-white  dark:bg-slate-950 overflow-hidden transition-colors duration-300'>
            {/* navbar for recruiter Login */}
            <Navbar >
                <li className='py-2 cursor-pointer pr-1 hover:bg-gray-100 dark:hover:bg-gray-800  '>

                    <NavLink to="/"
                        className='flex items-center gap-2'
                    >
                        <FaHome fontSize={18} />
                        خانه
                    </NavLink>
                </li>
            </Navbar>

            <div className='flex items-start max-h-screen overflow-hidden'>
                {/* left Sidebar  */}
                <div className='inline-block border-l-2 min-h-screen border-gray-200 dark:border-gray-700 '>
                    <ul className='flex flex-col gap-1 items-start pt-5 text-gray-800 dark:text-gray-400'>
                        {navMenu.map((menu, idx) => (
                            <NavLink
                                key={idx}
                                className={({ isActive }) => `flex items-center p-3 sm:px-8 gap-2 w-full hover:bg-gray-100 dark:hover:bg-gray-900 ${isActive && "bg-blue-100 dark:bg-slate-800 border-l-4 border-blue-500 dark:border-blue-700"}`}
                                to={menu.route}>
                                <img
                                    className='min-w-4 max-w-5 dark:invert dark:hue-rotate-180'
                                    src={menu.icon} alt="" />
                                <p className='max-sm:hidden'>{menu.title}</p>
                            </NavLink>
                        ))}
                    </ul>
                    {/* main content mounts from other pages */}
                </div>
                {/* main Content */}
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard