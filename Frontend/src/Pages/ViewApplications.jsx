import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import Loader from '../Components/Loading'
import Pagination from '../Components/Pagination'
import axios from 'axios'
import { toast } from 'react-toastify'
import { IoMdClose, IoMdCheckmark } from "react-icons/io";

const ViewApplications = () => {

  const { companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

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


  return applicants ? applicants.length === 0 ?
    (
      (<div className='flex items-center justify-center h-[90vh] flex-1'>
        <p className='text-xl sm:text-2xl '>هیچ درخواستی وجود ندارد</p>
      </div>)
    )
    : (

      <div className='container flex flex-col min-h-[65vh] md:min-h-[135vh] lg:min-h-[45vh] xl:min-h-[55vh] 2xl:min-h-[60vh] justify-between sm:max-w-4xl  p-4 flex-1 overflow-hidden '>
        <div className='overflow-auto flex-1'>
          <table className='max-sm:min-w-max sm:min-w-full bg-white border border-gray-200 max-sm:text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='px-4 py-2 text-right'>#</th>
                <th className='px-4 py-2 text-right'>نام کاربری</th>
                <th className='px-4 py-2 text-right '>عنوان شغل</th>
                <th className='px-4 py-2 text-right '>مکان</th>
                <th className='px-4 py-2 text-right'>رزومه</th>
                <th className='px-4 py-2 text-right'>وضعیت پذیرش</th>
              </tr>
            </thead>
            <tbody>
              {applicants.slice((currentPage - 1) * 7, (currentPage) * 7).filter(item => item.jobId && item.userId).map((data, idx) => (
                <tr className='text-gray-700' key={idx}>
                  <td className='px-4 py-2 text-right border-b'>{idx + 1}</td>
                  <td className='px-4 py-2 text-right border-b flex items-center'>
                    <img
                      className='w-10 h-10 rounded-full ml-3'
                      src={data.userId.image} alt="" />
                    <span>{data.userId.name}</span>
                  </td>
                  <td className='px-4 py-2 text-right border-b '>{data.jobId.title}</td>
                  <td className='px-4 py-2 text-right border-b '>{data.jobId.location}</td>
                  <td className='px-4 py-2 text-right border-b'>
                    <a
                      className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2  items-center'
                      href={data.userId.resume} target='_blank'>
                      رزومه <img src={assets.resume_download_icon} />
                    </a>
                  </td>

                  <td className='px-4 py-2 text-center  border-b relative '>
                    {data.status === "در حال انتظار"
                      ? (<div className='flex items-center gap-1'>

                        <button
                        onClick={()=> changeJobApplicationStatus(data._id , 'قبول شده')}
                        className=' px-2 py-1 rounded bg-green-100 '>
                          <IoMdCheckmark fontSize={20} className='text-green-500' />
                        </button>

                        <button
                        onClick={()=> changeJobApplicationStatus(data._id , 'رد شده')}
                        className='px-2 py-1 rounded bg-red-100 '>
                          <IoMdClose fontSize={20} className='text-red-500' />
                        </button>

                      </div>)
                      : <div className='text-right '>{data.status}</div>

                    }

                  </td>
                </tr>
              ))

              }
            </tbody>
          </table>
        </div>

        <Pagination list={applicants} page={currentPage} setPage={setCurrentPage} perPage={7} />


      </div>
    ) : <Loader />
}

export default ViewApplications