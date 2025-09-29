import  { useEffect, useState } from 'react'
import {  useApp } from '../context/AppProvider'
import { JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import Pagination from './Pagination'
import Loarder from './Loading'
import { motion, AnimatePresence } from 'framer-motion'
import { MdClose } from 'react-icons/md'



const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs } = useApp()

    const [isShowedFilter, setIsShowedFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [seletedCategories, setSelectedCategories] = useState([])
    const [seletedLocations, setSelectedLocations] = useState([])
    const [filteredJobs, setFilteredJobs] = useState(jobs)

    //handling checked inputs
    const handleCategories = job => {
        setSelectedCategories(prev => prev.includes(job) ? prev.filter(cat => cat !== job) : [...prev, job])

    }
    const handleLocations = location => {
        setSelectedLocations(prev => prev.includes(location) ? prev.filter(loc => loc !== location) : [...prev, location])
    }
    //handling filtered jobs
    useEffect(() => {
        if (jobs) {
            setFilteredJobs(jobs)
            const matchedCategories = job => !seletedCategories.length || seletedCategories.includes(job.category)

            const matchedLocations = job => !seletedLocations.length || seletedLocations.includes(job.location)

            const mathedTitle = job => !searchFilter.job || job.title.toLowerCase().includes(searchFilter.job.toLowerCase())

            const matchedSearchLocation = job => !searchFilter.location || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

            const newFilteredJobs = jobs.slice().reverse().filter(job =>
                matchedCategories(job) && matchedLocations(job) && mathedTitle(job) && matchedSearchLocation(job)
            )
            setFilteredJobs(newFilteredJobs)
            setCurrentPage(1)
        }


    }, [seletedCategories, seletedLocations, searchFilter, jobs])

    return (
        <div className='  container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg:space-y-8 py-8 gap-10 lg:gap-20'>
            {/* sideBar-current filter */}
            <div className='w-full lg:w-1/4 bg-white p-5 dark:bg-slate-900 dark:text-gray-100'>
                {/* searched Titles in Hero Component */}
                {isSearched && (searchFilter.job || searchFilter.location) &&
                    (
                        <>
                            <h3 className='font-medium text-lg mb-4'>جستجوی فعلی</h3>
                            <div className='mb-4  '>
                                {searchFilter.job && (
                                    <span className='inline-flex items-center gap-2.5 bg-blue-50 border-blue-200 dark:bg-blue-500 border dark:border-blue-800 px-2 py-1.5 rounded  '>
                                        {searchFilter.job.length > 10 ? searchFilter.job.slice(0, 10).concat('...') : searchFilter.job}
                                        <MdClose
                                            onClick={() =>
                                                setSearchFilter(prev => ({ ...prev, job: "" }))}
                                            className='cursor-pointer ' />
                                    </span>

                                )}
                                {searchFilter.location && (
                                    <span className='mr-1 inline-flex items-center gap-2.5  bg-red-50 border-red-200 dark:bg-red-500  dark:border-red-800   border  px-2 py-1.5 rounded  '>
                                        {searchFilter.location.length > 10 ? searchFilter.location.slice(0, 10).concat('...') : searchFilter.location}
                                        <MdClose
                                            onClick={() =>
                                                setSearchFilter(prev => ({ ...prev, location: "" }))}
                                            className='cursor-pointer' />
                                    </span>

                                )}
                            </div>
                        </>
                    )


                }
                <button
                    onClick={e => setIsShowedFilter(prev => !prev)}
                    className='lg:hidden my-2  px-6 py-1.5 rounded border border-gray-500'>
                    {isShowedFilter ? "بستن" : "فیلترها"}
                </button>
                {/* Category filters */}
                <div className='max-lg:flex  justify-between items-center '>
                    <div className={isShowedFilter ? "" : "max-lg:hidden mt-2 sm:mt-4"}>
                        <h4 className='font-medium text-lg py-4'>جستجو بر اساس کار </h4>
                        <ul className='space-y-4 text-gray-600 dark:text-gray-500'>
                            {JobCategories.map((job, idx) => (
                                <li className='flex gap-3 items-center' key={idx}>
                                    <input
                                        id={`${job}${idx}`}
                                        className='scale-125'
                                        type="checkbox"
                                        onChange={() => handleCategories(job)}
                                        checked={seletedCategories.includes(job)}
                                    />
                                    <label htmlFor={`${job}${idx}`}>{job}</label>
                                </li>
                            ))

                            }
                        </ul>
                    </div>

                    {/* Location filters */}
                    <div className={isShowedFilter ? "" : "max-lg:hidden mt-2 sm:mt-4"}>
                        <h4 className='font-medium text-lg py-4'>جستجو بر اساس مکان</h4>
                        <ul className='space-y-4 text-gray-600 dark:text-gray-500'>
                            {JobLocations.map((location, idx) => (
                                <li className='flex gap-3 items-center' key={idx}>
                                    <input
                                        id={`${location}${idx}`}
                                        className='scale-125'
                                        type="checkbox"
                                        onChange={() => handleLocations(location)}
                                        checked={seletedLocations.includes(location)}
                                    />
                                    <label htmlFor={`${location}${idx}`}>{location}</label>
                                </li>
                            ))

                            }
                        </ul>
                    </div>
                </div>


            </div>

            {/* Job List */}
            {jobs ? !filteredJobs || filteredJobs.length === 0 ?
                (<div className='flex-1 flex items-center justify-center h-[90vh]'>
                    <p className='text-xl sm:text-3xl text-gray-700 dark:text-gray-600 text-bold'>هیچ کاری در دسترس نیست یا پست نشده</p>
                </div>)
                :

                <section className=' w-full lg-w-3/4 text-gray-800 dark:text-gray-400 max-lg:px-4 flex flex-col justify-between ' id='job_list'>
                    <h3 className='font-medium text-3xl py-2 dark:text-gray-100'>موقعیت های شغلی اخیر</h3>
                    <p className='mb-8 '>کاری که مورد علاقه ات است را ، به معتبرترین شرکت درخواست بده</p>


                    <motion.div
                        layout
                        className='grid grid-cols-1 grid-rows-2 sm:grid-cols-2 xl:grid-cols-3 gap-4   mb-10'>
                        <AnimatePresence>
                            {filteredJobs.slice((currentPage - 1) * 6, (currentPage) * 6).map(data => (
                                <JobCard key={data._id} {...data} />
                            ))}
                        </AnimatePresence>
                    </motion.div>


                    {/* Pagination */}
                    {filteredJobs.length > 0 && (

                        <Pagination list={filteredJobs} page={currentPage} setPage={setCurrentPage} perPage={6} />

                    )
                    }
                </section>
                : <Loarder />
            }


        </div>
    )
}

export default JobListing