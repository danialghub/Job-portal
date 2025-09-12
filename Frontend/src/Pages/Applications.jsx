import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Loader from '../Components/Loading'
import { assets } from '../assets/assets'

import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Pagination from '../Components/Pagination'
import { AnimatePresence } from 'framer-motion'
import ApplicationRows from '../Components/ApplicationRows'
const Applications = () => {

console.log('Applications');


    const { user } = useUser()
    const { getToken } = useAuth()

    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const {  userData, userApplications, fetchUsersData, fetchUserApplications } = useContext(AppContext)


    const updateResume = async () => {
        try {
            const formData = new FormData()
            formData.append('resume', resume)
            const token = await getToken()

            const { data } = await axios.post( '/api/users/update-resume', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.succuss) {
                toast.success(data.message)
                await fetchUsersData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setResume(null)
        setIsEdit(false)

    }
    useEffect(() => {
        if (user) {
            fetchUserApplications()
        }
    }, [user])

    return userApplications ? (
        <>
            <Navbar />

            <div className='container px-4 min-h-[75vh]  2xl:px-20 mx-auto my-10 '>
                {/* Getting Resume Inputs */}
                <h2 className='text-xl font-semibold '>رزومه شما</h2>
                <div className='flex gap-2 mb-6 mt-3'>
                    {isEdit || userData && !userData.resume ?
                        <>
                            <label
                                className='flex items-center'
                                htmlFor="resumeUpload">
                                <p
                                    className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2 '
                                >{resume ? resume.name : "انتخاب رزومه"}</p>
                                <input
                                    id="resumeUpload"
                                    onChange={e => setResume(e.target.files[0])}
                                    accept='application/pdf'
                                    type="file"
                                    hidden
                                />
                                <img src={assets.profile_upload_icon} alt="" />
                            </label>
                            <button
                                onClick={updateResume}
                                className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'
                            >ذخیره</button>
                        </>
                        :
                        <div className='flex gap-2'>
                            <a
                                target='_blank'
                                className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg shadow shadow-blue-300'
                                href={userData.resume}>
                                رزومه
                            </a>
                            <button
                                onClick={() => setIsEdit(true)}
                                className='text-gray-500 border border-gray-300 rounded-lg px-5 py-2'>ویرایش</button>
                        </div>
                    }
                </div>
                {/* Job Applied Info */}

                <h2 className='text-xl font-semibold mb-4 '>کارهای درخواست داده شده</h2>
                <>
                    {userApplications.length ?
                        <div className='flex flex-col justify-between min-h-[45vh] md:min-h-[100vh] lg:min-h-[30vh] xl:min-h-[40vh] 2xl:min-h-[55vh]'>
                            <div className='flex-1 overflow-y-auto '>
                                <table
                                    className='max-sm:min-w-max sm:min-w-full  bg-white border rounded-lg '>

                                    <thead >
                                        <tr className='min-w-[100%]'>
                                            <th className='w-[200px] px-4 py-3  border-b text-right '>شرکت</th>
                                            <th className='w-[200px] px-4 py-3  border-b text-right '>عنوان کار</th>
                                            <th className='w-[200px] px-4 py-3 border-b text-right  '>مکان</th>
                                            <th className='w-[200px] px-4 py-3 border-b text-right '>تاریخ</th>
                                            <th className='w-[200px] px-4 py-3  border-b text-right '>وضعیت</th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        className='max-sm:text-sm' key={currentPage}>
                                        <AnimatePresence>
                                            {userApplications.slice((currentPage - 1) * 5, (currentPage) * 5).map((job, idx) => ((

                                                <ApplicationRows key={idx} idx={(currentPage - 1) +idx} job={job} />

                                            )

                                            ))
                                            }
                                        </AnimatePresence>

                                    </tbody>

                                </table>
                            </div>
                            <Pagination list={userApplications} page={currentPage} setPage={setCurrentPage} perPage={5} />
                        </div>
                        : <div className='min-w-full text-3xl h-[50vh] flex justify-center items-center'>هیچ درخواستی یافت نشد</div>
                    }

                </>

            </div >

            <Footer />


        </>
    ) : <Loader />
}

export default Applications