import {  useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import {  useApp } from '../context/AppProvider'
import Loader from '../Components/Loading'
import Pagination from '../Components/Pagination'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { IoMdClose, IoMdCheckmark } from "react-icons/io";

const ViewApplications = () => {

  const { companyToken, isMobile } = useApp()
  const [applicants, setApplicants] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = isMobile ? 4 : 7
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get('/api/company/applicants')

      if (data.success) {
        setApplicants(data.applications.reverse())

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)

    }
  }
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post('/api/company/change-status',
        { id, status }
      )
      if (data.success) {
        fetchCompanyJobApplications()
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)

    }
  }
  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }

  }, [companyToken])

  useEffect(() => {
    setCurrentPage(1)
  }, [isMobile])

  return applicants ? applicants.length === 0 ? (
    <div className='flex items-center justify-center h-[90vh] flex-1'>
      <p className='text-xl sm:text-3xl dark:text-slate-600'>هیچ درخواستی وجود ندارد</p>
    </div>
  ) : (

      <div className="flex-1 container max-h-screen overflow-y-auto ">
    <div className=' sm:max-w-4xl p-4 min-h-[90vh] max-sm:mb-26 sm:pb-16  flex flex-col  justify-between  gap-4'>


        {/* Desktop Table */}
        <div className='hidden sm:block overflow-auto mb-10'>
          <table className='min-w-max sm:min-w-full bg-white border border-gray-200 dark:bg-slate-900  dark:border-gray-500 dark:text-gray-400 rounded-xl'>
            <thead>
              <tr className='border-b text-right border-gray-200 dark:border-b-slate-700'>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>نام کاربری</th>
                <th className='px-4 py-2'>عنوان شغل</th>
                <th className='px-4 py-2'>مکان</th>
                <th className='px-4 py-2 text-center'>رزومه</th>
                <th className='px-4 py-2'>وضعیت پذیرش</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .filter(item => item.jobId && item.userId)
                .map((data, idx) => (
                  <tr key={idx} className='text-gray-700 border-b dark:border-b-slate-700 dark:text-gray-200 border-gray-200'>
                    <td className='px-4 py-2'>{idx + 1}</td>
                    <td className='px-4 py-2 flex items-center'>
                      <img className='w-10 h-10 rounded-full ml-3' src={data.userId.image} alt="" />
                      <span>{data.userId.name}</span>
                    </td>
                    <td className='px-4 py-2'>{data.jobId.title}</td>
                    <td className='px-4 py-2'>{data.jobId.location}</td>
                    <td className='px-4 py-2 text-center'>
                      <a className='bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center'
                        href={data.userId.resume} target='_blank' rel="noreferrer">
                        رزومه <img src={assets.resume_download_icon} alt="resume" />
                      </a>
                    </td>
                    <td className='px-4 py-2 text-center'>
                      {data.status === "در حال انتظار" ? (
                        <div className='flex items-center gap-1 justify-center'>
                          <button onClick={() => changeJobApplicationStatus(data._id, 'قبول شده')}
                            className='px-2 py-1 rounded bg-green-100'>
                            <IoMdCheckmark fontSize={20} className='text-green-500' />
                          </button>
                          <button onClick={() => changeJobApplicationStatus(data._id, 'رد شده')}
                            className='px-2 py-1 rounded bg-red-100'>
                            <IoMdClose fontSize={20} className='text-red-500' />
                          </button>
                        </div>
                      ) : (
                        <div className='text-right'>{data.status}</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='flex flex-col gap-4 sm:hidden  mb-10'>
          {applicants
            .slice((currentPage - 1) * perPage, currentPage * perPage)
            .filter(item => item.jobId && item.userId)
            .map((data, idx) => (
              <div key={idx} className='relative bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition transform hover:scale-105'>

                {/* عنوان کاربر */}
                <div className='flex items-center gap-3'>
                  <img className='w-10 h-10 rounded-full' src={data.userId.image} alt="" />
                  <p className='font-bold dark:text-gray-100 break-words'>{data.userId.name}</p>
                </div>

                {/* عنوان شغل */}
                <p className='mt-2 text-gray-700 dark:text-gray-300 font-medium break-words'>{data.jobId.title}</p>

                {/* مکان و تاریخ */}
                <div className='flex justify-between mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  <span>{data.jobId.location}</span>
                  {/* <span>{moment(data.date).locale("fa").format("jDD jMMMM jYYYY ")}</span> */}
                </div>

                {/* رزومه */}
                <a className='mt-2 bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center'
                  href={data.userId.resume} target='_blank' rel="noreferrer">
                  رزومه <img src={assets.resume_download_icon} alt="resume" />
                </a>

                {/* وضعیت پذیرش */}
                <div className='flex justify-end items-center mt-2 gap-2'>
                  {data.status === "در حال انتظار" ? (
                    <>
                      <button onClick={() => changeJobApplicationStatus(data._id, 'قبول شده')}
                        className='px-2 py-1 rounded bg-green-100'>
                        <IoMdCheckmark fontSize={20} className='text-green-500' />
                      </button>
                      <button onClick={() => changeJobApplicationStatus(data._id, 'رد شده')}
                        className='px-2 py-1 rounded bg-red-100'>
                        <IoMdClose fontSize={20} className='text-red-500' />
                      </button>
                    </>
                  ) : (
                    <span className='text-gray-600 dark:text-gray-300'>{data.status}</span>
                  )}
                </div>

              </div>
            ))}
        </div>

        {/* Pagination */}
        <Pagination list={applicants} page={currentPage} setPage={setCurrentPage} perPage={perPage} />
      </div>
    </div>

  ) : <Loader />;

}

export default ViewApplications