import Navbar from './Navbar'
import Footer from './Footer'
import { Skeleton, Stack } from '@mui/material';


const Skeletons = () => {


    return (
        <>
            <Navbar />

            {/*main contents*/}
            <div className='min-h-screen container flex flex-col mx-auto px-4 py-10 2xl:px-20 bg-white rounded-lg'>
                {/*job info section */}
                <div className='rounded-xl text-black  w-full flex justify-center flex-wrap  md:justify-between gap-8 py-16 px-14 sm:py-20 mb-6 bg-sky-50 border border-sky-400 '>
                    <div className='flex flex-col md:flex-row gap-8  items-center '>
                        <Skeleton width={75} height={96} />

                        <div className='text-center md:text-right text-neutral-700'>
                            <Skeleton height={40}/>

                            <div className='grid max-sm:grid-cols-2 sm:grid-flow-col max-sm:gap-y-3  gap-x-3 mt-2 sm:gap-x-5 text-gray-600  text-sm h-6 '>
                                <span className="flex  gap-1 items-center">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton width={40} />
                                </span>
                                <span className="flex  gap-1 items-center">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton width={40} />
                                </span>
                                <span className="flex  gap-1 items-center">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton width={40} />
                                </span>
                                <span className="flex  gap-1 items-center">
                                    <Skeleton variant="circular" width={20} height={20} />
                                    <Skeleton width={40} />
                                </span>



                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center text-start text-sm mt-3'>

                        <Skeleton width={150} height={60} />

                        <Skeleton width={120} />
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row justify-between items-start'>
                    {/*description section */}
                    <div className='w-full lg:w-2/4 flex flex-col gap-4'>

                        <Skeleton height={60} />

                        <div className='flex flex-col gap-2'>
                            <Skeleton height={50} />
                            <div className='flex flex-col gap-1'>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </div>
                            <Skeleton height={50} />
                            <div className='flex flex-col gap-1'>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </div>
                        </div>
                        <Skeleton width={140} height={60} />
                    </div>
                    <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 flex flex-col '>

                        <h2>کارهای دیگر شرکت </h2>
                        <Skeleton />
                        <Stack spacing={2} marginTop={7}>

                            <Skeleton
                              
                                width={400}
                                height={200} 
                                variant='rectangular'
                                />
                            <Skeleton
                          variant='rectangular'
                                width={400}
                                height={200} />
                            <Skeleton
                               variant='rectangular'
                                width={400}
                                height={200} />
                            <Skeleton
                                variant='rectangular'
                                width={400}
                                height={200} />

                        </Stack>
                    </div>

                </div>

            </div>

            <Footer />
        </>
    )

}

export default Skeletons