import  {  useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import Loader from '../Components/Loading'
import { assets } from '../assets/assets'

import { useApp } from '../context/AppProvider'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Pagination from '../Components/Pagination'

import ApplicationRows from '../Components/ApplicationRows'
const Applications = () => {


    const { user } = useUser()
    const { getToken } = useAuth()

    const [isEdit, setIsEdit] = useState(false)
    const [resume, setResume] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const { userData, userApplications, fetchUsersData, fetchUserApplications } = useApp()

    const updateResume = async () => {
        try {
            const formData = new FormData()
            formData.append('resume', resume)
            const token = await getToken()

            const { data } = await axios.post('/api/users/update-resume', formData, {
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
        <div className='dark:bg-slate-950'>
            <Navbar />

            <div className='container px-4 min-h-[75vh] 2xl:px-20 mx-auto my-10'>
                {/* Getting Resume Inputs */}
                <h2 className='text-xl font-semibold dark:text-white'>رزومه شما</h2>
                <div className='flex gap-2 mb-6 mt-3'>
                    {isEdit || (userData && !userData.resume) ? (
                        <>
                            <label className='flex items-center gap-1' htmlFor="resumeUpload">
                                <p className='bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-blue-100 px-4 py-2 rounded-lg mr-2 cursor-pointer'>
                                    {resume ? resume.name : "انتخاب رزومه"}
                                </p>
                                <input
                                    id="resumeUpload"
                                    onChange={e => setResume(e.target.files[0])}
                                    accept='application/pdf'
                                    type="file"
                                    hidden
                                />
                                <img src={assets.profile_upload_icon} alt="" className='cursor-pointer' />
                            </label>
                            <button
                                onClick={updateResume}
                                className='bg-green-100 dark:bg-green-600 dark:text-green-100 border border-green-400 dark:border-green-600 rounded-lg px-4 py-2'
                            >
                                ذخیره
                            </button>
                        </>
                    ) : (
                        <div className='flex gap-2'>
                            <a
                                target='_blank'
                                className='bg-blue-100 dark:bg-blue-600 dark:text-blue-100 text-blue-600  px-4 py-2 rounded-lg shadow shadow-blue-300   dark:shadow-blue-900'
                                href={userData.resume}
                            >
                                رزومه
                            </a>
                            <button
                                onClick={() => setIsEdit(true)}
                                className='text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg px-5 py-2'
                            >
                                ویرایش
                            </button>
                        </div>
                    )}
                </div>

                {/* Job Applied Info */}
                <h2 className='text-xl font-semibold mb-4 dark:text-white'>کارهای درخواست داده شده</h2>
                {userApplications.length ? (
                    <div className='flex flex-col justify-between min-h-[45vh] md:min-h-[100vh] lg:min-h-[30vh] xl:min-h-[40vh] 2xl:min-h-[55vh]'>
                        <div className='flex-1 overflow-y-auto '>
                            <ApplicationRows
                                userApplications={userApplications}
                                currentPage={currentPage}
                            />
                        </div>




                        <Pagination list={userApplications} page={currentPage} setPage={setCurrentPage} perPage={5} />
                    </div>
                ) : (
                    <div className='min-w-full text-3xl h-[50vh] flex justify-center items-center dark:text-gray-300'>
                        هیچ درخواستی یافت نشد
                    </div>
                )}
            </div>


            <Footer />


        </div>
    ) : <Loader />
}

export default Applications