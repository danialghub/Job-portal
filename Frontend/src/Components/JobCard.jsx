import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { FlipHorizontal } from 'lucide-react';
import { useRef, useState } from 'react';

const FlipCard = ({ children, description, height = "300px" }) => {
    const cardRef = useRef(null);
    const [flipped, setFlipped] = useState(false);

    const toggleFlip = () => {
        gsap.to(cardRef.current, {
            rotateY: flipped ? 0 : 180,
            duration: 0.8,
            ease: "power3.inOut",
        });
        setFlipped(!flipped);
    };

    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            layout
            className={`relative w-full [perspective:1000px]`}
            style={{ height }}
        >
            <div
                ref={cardRef}
                className="w-full h-full [transform-style:preserve-3d] relative cursor-pointer"
            >
                {/* Toggle Button */}
                <div
                    className='absolute top-3 left-3 z-40 backdrop-blur-sm'
                    onClick={toggleFlip}
                >
                    <FlipHorizontal size={30} className="text-slate-300" />
                </div>

                {/* Front */}
                <div className="absolute w-full h-full [backface-visibility:hidden] rounded-xl shadow-md bg-white dark:bg-slate-800 p-4 dark:text-gray-100">
                    {children}
                </div>

                {/* Back */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl shadow-md bg-slate-200 dark:bg-slate-900 p-4 overflow-auto [&::-webkit-scrollbar]:w-2">
                    <p className='text-sm text-gray-600 dark:text-gray-300 py-8' dangerouslySetInnerHTML={{ __html: description }}></p>
                </div>
            </div>
        </motion.div>
    );
};

const JobCard = ({ _id, location, title, level, description, companyId }) => {
    const navigate = useNavigate();

    return (
        <FlipCard description={description} height="280px">
            <div

                className='w-full h-full '
            >
                {/* Company */}
                <div className='flex justify-between items-center '> <img className='h-9 w-10 rounded-full ' src={companyId.image ? companyId.image : assets.company_place_holder} alt="" /> </div>

                {/* Title */}
                <h3 className='font-medium text-lg mt-2'>{title}</h3>

                {/* Tags */}
                <div className='flex items-center gap-3 mt-2 text-sm'>
                    <span
                        className='bg-blue-50 border border-blue-200 dark:bg-blue-500 dark:border-blue-800 px-2 py-1 rounded dark:text-blue-100'>{location}</span>
                    <span
                        className='bg-red-50 border border-red-200 dark:bg-red-500 dark:border-red-800 px-2 py-1 rounded dark:text-red-100'>{level}</span>
                </div>
                {/* Description */}
                <p
                    dangerouslySetInnerHTML={{ __html: description.concat('...') }}
                    className='text-sm text-gray-500 mt-4 line-clamp-3 home-rich-para'></p>

                {/* Buttons */}
                <div className='flex mt-4 gap-4 text-sm'>
                    <button
                        onClick={() => { navigate(`/apply-job/${_id}`); scrollTo(0, 0) }}
                        className='bg-blue-600 dark:hover:bg-blue-800 rounded text-white px-4 py-2 duration-200 transition-colors ' >درخواست کار</button>
                    <button
                        onClick={() => { navigate(`/apply-job/${_id}`); scrollTo(0, 0) }}
                        className='text-gray-500 border dark:hover:bg-slate-600 dark:hover:text-gray-100 duration-200 transition-colors border-gray-500 rounded px-4 py-2'>جزئیات بیشتر</button>
                </div>
            </div>
        </FlipCard >
    );
};

export default JobCard;
