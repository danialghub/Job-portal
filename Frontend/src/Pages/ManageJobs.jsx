import  {  useEffect, useState } from 'react'
import { useApp } from '../context/AppProvider'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment-jalaali'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import Loader from '../Components/Loading'
import Pagination from '../Components/Pagination'
import { Dialog, DialogContent } from '@mui/material';


/////////////////////////////////////////////
// sub components

const DeleteConfirm = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'bg-gray-800 dark:bg-slate-900 text-gray-100   pb-6   ',
      }}
    >
      <DialogContent className="text-center dark:text-gray-300 text-black sm:text-xl mt-2">
        آیا مطمئن هستید؟ <div className='text-red-500 pt-4'>این عمل غیرقابل بازگشت است.</div>
      </DialogContent>
      <div className="flex justify-center mt-6 gap-3 ">
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-vazirmatn"
        >
          حذف
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition font-vazirmatn"
        >
          لغو
        </button>
      </div>
    </Dialog>
  );
};
/////////////////////////////////////////////


const ManageJobs = () => {
  //set up for persian date
  moment.loadPersian({
    dialect: 'persian-modern',
    usePersianDigits: true
  })

  const navigate = useNavigate()
  const [jobs, setJobs] = useState(false)
  const [checkedJobs, setCheckedJobs] = useState([]);
  const { companyToken, getJobs, isMobile } = useApp()
  const [currentPage, setCurrentPage] = useState(1)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)

  const perPage = isMobile ? 4 : 7

  const handleCheck = (id) => {
    setCheckedJobs(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('/api/company/list-jobs')

      if (data.success) {
        setJobs(data.jobsData.reverse())

      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }
  const removeJobs = async () => {

    try {
      const { data } = await axios.post(`/api/company/delete-jobs`, { ids: checkedJobs })

      if (data.success) {
        toast.success(data.message)
        await fetchJobs()
        setCheckedJobs([])
        getJobs()
        setIsRemoveModalOpen(false)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post('/api/company/change-visiblity', { id })
      if (data.success) {
        toast.success("با موقیت تغییرات اعمال شد")
        fetchJobs()
        getJobs()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    setCurrentPage(1)
  }, [isMobile])
  useEffect(() => {
    if (companyToken) {
      fetchJobs()
    }

  }, [companyToken])


  return jobs ? (
    jobs.length === 0 ? (
      <div className='flex-1 flex items-center justify-center h-[90vh] dark:text-slate-600'>
        <p className='text-xl sm:text-3xl'>هیچ کاری در دسترس نیست</p>
      </div>
    ) : (
      <div className='container p-4 mt-2 sm:max-w-4xl flex flex-col justify-between h-[85vh] overflow-auto gap-4'>
        <DeleteConfirm
          open={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onConfirm={removeJobs}
        />

        {/* Desktop Table */}
        <div className='hidden sm:block overflow-x-auto'>
          <table className='min-w-max sm:min-w-full bg-white border border-gray-200 dark:bg-slate-900 dark:border-gray-500 dark:text-gray-400 rounded-xl'>
            <thead>
              <tr className='border-b border-gray-200 dark:border-b-slate-700'>
                <th className='px-4 py-3'>انتخاب</th>
                <th className='px-4 py-3'>#</th>
                <th className='px-4 py-3'>عنوان کار</th>
                <th className='px-4 py-3'>تاریخ</th>
                <th className='px-4 py-3'>مکان</th>
                <th className='px-4 py-3 text-center'>درخواستی ها</th>
                <th className='px-4 py-3'>وضعیت نمایش</th>
              </tr>
            </thead>
            <tbody>
              {jobs
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((item, idx) => (
                  <tr
                    key={idx}
                    className='text-gray-700 dark:text-gray-200 border-b dark:border-b-slate-700 border-gray-200'
                  >
                    <td className='px-4 py-3 text-center'>
                      <input
                        type='checkbox'
                        onChange={() => handleCheck(item._id)}
                        checked={checkedJobs.includes(item._id)}
                        className='scale-125'
                      />
                    </td>
                    <td className='px-4 py-3'>{((currentPage - 1) * perPage + (idx + 1))}</td>
                    <td className='px-4 py-3'>{item.title}</td>
                    <td className='px-4 py-3'>
                      {moment(item.date)
                        .locale("fa")
                        .format("jDD jMMMM jYYYY ")}
                    </td>
                    <td className='px-4 py-3'>{item.location}</td>
                    <td className='px-4 py-3 text-center'>{item.applicants}</td>
                    <td className='px-4 py-3 text-center'>
                      <input
                        onChange={() => changeJobVisibility(item._id)}
                        checked={item.visible}
                        className='scale-125 ml-4'
                        type='checkbox'
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className='flex flex-col gap-4 sm:hidden'>
          {jobs
            .slice((currentPage - 1) * perPage, currentPage * perPage)
            .map((item, idx) => (
              <div
                key={idx}
                className='relative bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition transform hover:scale-105'
              >
                {/* Label انتخاب */}
                <label
                  className={`absolute -top-3 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white transition-all cursor-pointer select-none
            ${checkedJobs.includes(item._id)
                      ? "bg-blue-600 dark:bg-blue-500 shadow-lg"
                      : "bg-gray-400 dark:bg-gray-600"
                    }`}
                  onClick={() => handleCheck(item._id)}
                >
                  {checkedJobs.includes(item._id) ? "انتخاب شده" : "انتخاب"}
                </label>

                {/* محتویات کارت */}
                <div className='flex flex-col gap-2'>
                  {/* عنوان */}
                  <p className='font-bold text-lg dark:text-gray-100 break-words'>{item.title}</p>

                  {/* تعداد درخواست */}
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {item.applicants} درخواست
                  </span>

                  {/* ردیف تاریخ و مکان */}
                  <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <span>{moment(item.date).locale("fa").format("jDD jMMMM jYYYY ")}</span>
                    <span>{item.location}</span>
                  </div>

                  {/* ردیف وضعیت نمایش */}
                  <div className='flex justify-end items-center mt-2'>
                    <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>نمایش:</span>
                    <input
                      type='checkbox'
                      onChange={() => changeJobVisibility(item._id)}
                      checked={item.visible}
                      className='scale-125'
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>


        <div className='flex flex-col gap-10 '>
          {/* Actions */}
          <div className='flex flex-wrap gap-2 '>
            {checkedJobs.length ? (
              <button
                onClick={() => setIsRemoveModalOpen(true)}
                className='bg-red-600 dark:shadow-[0_0_20px] dark:shadow-red-800 text-white px-4 py-2 rounded transition hover:scale-105'
              >
                حذف
              </button>
            ) : null}
            {checkedJobs.length === 1 ? (
              <Link to={`/dashboard/update-job/${checkedJobs[0]}`}>
                <button className='bg-blue-600 dark:shadow-[0_0_20px] dark:shadow-blue-800 text-white px-4 py-2 rounded transition hover:scale-105'>
                  بروزرسانی
                </button>
              </Link>
            ) : null}
            <button
              onClick={() => navigate("/dashboard/add-job")}
              className='bg-black/70 dark:bg-gray-700 dark:hover:bg-gray-800 text-white px-4 py-2 rounded transition hover:scale-105'
            >
              ایجاد کار
            </button>
          </div>

          {/* Pagination */}
          <Pagination
            list={jobs}
            page={currentPage}
            setPage={setCurrentPage}
            perPage={perPage}
          />
        </div>
      </div>
    )
  )
    : <Loader />
}

export default ManageJobs