
import { motion, AnimatePresence } from 'framer-motion'
import moment from 'moment-jalaali'
import { assets } from '../assets/assets';

const ApplicationRows = ({ userApplications, currentPage }) => {
  //framer motion varients
  const variants = {
    hidden: { opacity: 0, height: 0, padding: 0 },
    visible: (i) => ({
      opacity: 1,
      height: 'auto', // or a specific height
      padding: '8px', // or a specific padding
      transition: {
        delay: i * .2, // waterfall effect
      },
    }),
  };
  //set up for persian date
  moment.loadPersian({
    dialect: "persian-modern",
    usePersianDigits: true
  })

  
  return (
    <>
     {/* large screen table */}
     <div className="w-full  overflow-auto px-2 sm:px-6 lg:px-8 hidden sm:block">
  <table className="w-full bg-white dark:bg-gray-800 border rounded-lg dark:border-gray-700 border-gray-200">
    <thead>
      <tr className="border-b text-right border-gray-200 dark:border-gray-500">
        <th className="px-4 py-3 dark:text-gray-300">شرکت</th>
        <th className="px-4 py-3 dark:text-gray-300">عنوان کار</th>
        <th className="px-4 py-3 dark:text-gray-300">مکان</th>
        <th className="px-4 py-3 dark:text-gray-300">تاریخ</th>
        <th className="px-4 py-3 dark:text-gray-300">وضعیت</th>
      </tr>
    </thead>
    <tbody key={currentPage}>
      <AnimatePresence>
        {userApplications
          .slice((currentPage - 1) * 5, currentPage * 5)
          .map((job, idx) => (
            <motion.tr
              key={idx}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, padding: 0 }}
              variants={variants}
              custom={idx}
              className="dark:border-b-gray-700 border-b dark:text-gray-200 border-gray-200 mt-2"
            >
              <motion.td className="px-4 py-2 flex items-center gap-2">
                <img
                  className="w-8 h-8"
                  src={
                    job.companyId.image
                      ? job.companyId.image
                      : assets.company_place_holder
                  }
                  alt=""
                />
                <span className="dark:text-gray-200">
                  {job.companyId.name}
                </span>
              </motion.td>

              <motion.td className="px-4 py-2">{job.jobId.title}</motion.td>

              <motion.td className="px-4 py-2">{job.jobId.location}</motion.td>

              <motion.td className="px-4 py-2">
                {moment(job.date).locale("fa").format("jDD jMMMM jYYYY")}
              </motion.td>

              <motion.td className="px-4 py-2">
                <div
                  className={`
                    ${
                      job.status === "قبول شده"
                        ? "bg-green-100 dark:bg-green-800 dark:text-green-200"
                        : job.status === "رد شده"
                        ? "bg-red-100 dark:bg-red-800 dark:text-red-200"
                        : "bg-blue-100 dark:bg-blue-800 dark:text-blue-200"
                    }
                    px-3 text-center py-1.5 rounded
                  `}
                >
                  {job.status}
                </div>
              </motion.td>
            </motion.tr>
          ))}
      </AnimatePresence>
    </tbody>
  </table>
</div>


      {/* mobile card */}
      <div className='sm:hidden flex flex-col gap-2 mb-10'>
        {userApplications
          .slice((currentPage - 1) * 5, currentPage * 5)
          .map((job, idx) => (
            <motion.div
              key={idx}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, height: 0, padding: 0 }}
              variants={variants}
              custom={idx}
              className='bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col gap-2 transition '
            >
              {/* شرکت */}
              <div className='flex items-center gap-2'>
                <img
                  className='w-8 h-8 rounded-full'
                  src={job.companyId.image ? job.companyId.image : assets.company_place_holder}
                  alt=""
                />
                <span className='dark:text-gray-200 font-semibold'>{job.companyId.name}</span>
              </div>

              {/* عنوان شغل */}
              <p className='dark:text-gray-200 font-bold break-words'>{job.jobId.title}</p>

              {/* مکان و تاریخ */}
              <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                <span>{job.jobId.location}</span>
                <span>{moment(job.date).locale("fa").format('jDD jMMMM jYYYY')}</span>
              </div>

              {/* وضعیت */}
              <div className={`px-3 py-1.5 rounded text-center
    ${job.status === "قبول شده" ? 'bg-green-100 dark:bg-green-800 dark:text-green-200' :
                  job.status === 'رد شده' ? 'bg-red-100 dark:bg-red-800 dark:text-red-200' :
                    'bg-blue-100 dark:bg-blue-800 dark:text-blue-200'}`}>
                {job.status}
              </div>
            </motion.div>
          ))

        }
      </div>
    </>

  )

}

export default ApplicationRows