import { useRef } from 'react'
import { useApp } from '../context/AppProvider'
import { assets } from '../assets/assets'
import { FaRocket, FaShieldAlt, FaHeadset, FaPuzzlePiece } from 'react-icons/fa';
const Hero = () => {

    const features = [
        { icon: <FaRocket size={40} />, text: 'سرعت بالا' },
        { icon: <FaShieldAlt size={40} />, text: 'امنیت کامل' },
        { icon: <FaHeadset size={40} />, text: 'پشتیبانی ۲۴/۷' },
        { icon: <FaPuzzlePiece size={40} />, text: 'یکپارچگی آسان' },
    ];

    const { setIsSearched, setSearchFilter } = useApp()

    const jobRef = useRef(null)
    const locRef = useRef(null)


    const onSearch = () => {
        setSearchFilter({
            job: jobRef.current.value,
            location: locRef.current.value
        })
        setIsSearched(true)

    }

    return (
        <div className='container mx-auto my-10  2xl:px-20 '>
            <div className='bg-gradient-to-r from-purple-800 to-purple-950 py-16 text-center rounded-xl text-white dark:text-gray-100'>
                <div className='mb-8'>
                    <h2
                        className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4 border-l-slate-900'>بیش از 10 هزار نفر پذیرش</h2>
                    <p className='text-sm max-w-xl mx-auto font-light px-5'>قدم بزرگ بعدی زندگی کاریت در اینجا آغاز میشود - بهترین موقعیت شغلی را پیدا کند و آیندتو بساز</p>
                </div>
                <div className='flex justify-between items-center max-w-xl  p-2 rounded bg-white mx-4 sm:mx-auto pl-4 text-gray-600 max-sm:text-sm max-sm:pl-2 dark:bg-slate-900'>
                    <div className='flex items-center gap-2 '>
                        <img className='h-4 sm:h-5 pointer-events-none' src={assets.search_icon} alt="Job" />
                        <input
                            type="text"
                            placeholder='فیلتر بر اساس شغل'
                            className='outline-none rounded w-full max-sm:w-3/4 dark:bg-slate-900 dark:text-gray-100'
                            ref={jobRef}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <img className='h-4 sm:h-5' src={assets.location_icon} alt="Loc" />
                        <input
                            type="text"
                            placeholder='فیلتر بر اساس مکان'
                            className='outline-none rounded w-full max-sm:w-3/4 dark:bg-slate-900 dark:text-gray-100'
                            ref={locRef}

                        />
                    </div >
                    <button
                        className='py-2 px-6 max-sm:px-3 max-sm:py-1 text-white  bg-blue-600 rounded'
                        onClick={onSearch}
                    >جستجو</button>
                </div>
            </div>
            <div className="shadow-md dark:bg-gray-900 p-6 mt-5 mx-2 rounded">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-center items-center transition-transform transform hover:scale-110"
                        >
                            <div className="text-blue-500 dark:text-blue-400 mb-2">{feature.icon}</div>
                            <p className=" dark:text-gray-200">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    )
}

export default Hero