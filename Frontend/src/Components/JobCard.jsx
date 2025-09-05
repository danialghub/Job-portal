import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
const JobCard = ({ _id, location, title, level, description, companyId }) => {
    const navigate = useNavigate()
    return (
        <motion.div 
        animate={{opacity:1}}
        initial={{opacity:0}}
        exit={{opacity:0}}
        layout
         className='border shadow rounded p-6'>
            <div>
                <div className='flex justify-between items-center'>
                    <img className='h-8' src={companyId.image} alt="" />
                </div>
                <h3 className='font-medium text-xl mt-2'>{title}</h3>
                <div className='flex items-center gap-3 mt-2 text-xs'>
                    <span className='bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>{location}</span>
                    <span className='bg-red-50 border border-red-200 px-4 py-1.5 rounded'>{level}</span>
                </div>
                <p className='text-sm text-gray-500 mt-4' dangerouslySetInnerHTML={{ __html: description.slice(0, 150).concat('...') }}></p>
                <div className='flex  mt-4 gap-4 text-sm'>
                    <button
                        onClick={() => { navigate(`/apply-job/${_id}`); scrollTo(0, 0) }}
                        className='bg-blue-600 rounded text-white px-4 py-2'>درخواست کار</button>
                    <button
                        onClick={() => { navigate(`/apply-job/${_id}`); scrollTo(0, 0) }}
                        className='text-gray-500 border border-gray-500 rounded px-4 py-2'>جزئیات بیشتر</button>
                </div>
            </div>
        </motion.div>
    )
}

export default JobCard