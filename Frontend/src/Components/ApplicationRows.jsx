import React from 'react'
import { motion } from 'framer-motion'
import moment from 'moment-jalaali'

const ApplicationRows = ({ job, idx }) => {
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
        <motion.tr
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, height: 0, padding: 0 }}
            variants={variants}
            custom={idx}
            >
            <motion.td className='px-4 py-2 flex items-center gap-2 border-b'>
                <img
                    className='w-8 h-8'
                    src={job.companyId.image} alt="" />
                {job.companyId.name}
            </motion.td>
            <motion.td className='px-4 py-2 border-b'>{job.jobId.title}</motion.td>
            <motion.td className='px-4 py-2 border-b '>{job.jobId.location}</motion.td>
            <motion.td className='px-4 py-2 border-b '>{moment(job.date).locale("fa").format('jDD jMMMM jYYYY ')}</motion.td>
            <motion.td className='px-4 py-2 border-b '>
                <div className={`${job.status == "قبول شده" ? 'bg-green-100' : job.status == 'رد شده' ? 'bg-red-100' : 'bg-blue-100'} px-3 text-center py-1.5 rounded `}>
                    {job.status}
                </div>
            </motion.td>
        </motion.tr>
    )
}

export default ApplicationRows