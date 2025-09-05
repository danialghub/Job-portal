import { useContext, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Hero = () => {
    const { setIsSearched, setSearchFilter } = useContext(AppContext)

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
            <div className='bg-gradient-to-r from-purple-800 to-purple-950 py-16 text-center rounded-xl text-white'>
                <div className='mb-8'>
                    <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>بیش از 10 هزار نفر پذیرش</h2>
                    <p className='text-sm max-w-xl mx-auto font-light px-5'>قدم بزرگ بعدی زندگی کاریت در اینجا آغاز میشود - بهترین موقیعت شغلی را پیدا کند و آیندتو بساز</p>
                </div>
                <div className='flex justify-between items-center max-w-xl  p-2 rounded bg-white mx-4 sm:mx-auto pl-4 text-gray-600 max-sm:text-sm max-sm:pl-2'>
                    <div className='flex items-center gap-1 '>
                        <img className='h-4 sm:h-5 pointer-events-none' src={assets.search_icon} alt="Job" />
                        <input
                            type="text"
                            placeholder='فیلتر بر اساس شغل'
                            className='outline-none rounded w-full max-sm:w-3/4 '
                            ref={jobRef}
                        />
                    </div>
                    <div className='flex items-center gap-1'>
                        <img className='h-4 sm:h-5' src={assets.location_icon} alt="Loc" />
                        <input
                            type="text"
                            placeholder='فیلتر بر اساس مکان'
                            className='outline-none rounded w-full max-sm:w-3/4'
                            ref={locRef}

                        />
                    </div >
                    <button
                        className='py-2 px-6 max-sm:px-3 max-sm:py-1 text-white  bg-blue-600 rounded'
                        onClick={onSearch}
                    >جستجو</button>
                </div>
            </div>
            <div className='shadow-md border-gray-300 p-6 mt-5 mx-2 border rounded flex'>
                <div className='flex justify-center gap-10 lg:gap-16 flex-wrap '>
                    <p className='text-lg'>مورد اعتماد </p>
                    <img className='h-6' src={assets.microsoft_logo} alt="" />
                    <img className='h-6' src={assets.walmart_logo} alt="" />
                    <img className='h-6' src={assets.accenture_logo} alt="" />
                    <img className='h-6' src={assets.samsung_logo} alt="" />
                    <img className='h-6' src={assets.amazon_logo} alt="" />
                    <img className='h-6' src={assets.adobe_logo} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Hero