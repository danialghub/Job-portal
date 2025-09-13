import  { useContext, useEffect } from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import Navbar from '../Components/Navbar'
import { FaHome } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate()
    const { companyData } = useContext(AppContext)
    
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

        <div className='min-h-screen '>
            {/* navbar for recruiter Login */}
            <Navbar >
                <li className='py-2 cursor-pointer pr-1  '>

                    <NavLink to="/"
                        className='flex items-center gap-2'
                    >
                        <FaHome fontSize={18} />
                        خانه
                    </NavLink>
                </li>
            </Navbar>
            {/* main Content */}
            <div className='flex items-start '>
                {/* left Sidebar  */}
                <div className='inline-block min-h-screen border-l-2 '>
                    <ul className='flex flex-col items-start pt-5 text-gray-800'>
                        {navMenu.map((menu, idx) => (
                            <NavLink
                                key={idx}
                                className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && "bg-blue-100 border-l-4 border-blue-500 "}`}
                                to={menu.route}>
                                <img
                                    className='min-w-4 max-w-6'
                                    src={menu.icon} alt="" />
                                <p className='max-sm:hidden'>{menu.title}</p>
                            </NavLink>
                        ))}
                    </ul>
                    {/* main content mounts from other pages */}
                </div>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard