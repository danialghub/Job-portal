import Navbar from './Navbar'
import Footer from './Footer'
import { Skeleton, Stack } from '@mui/material';


const Skeletons = () => {


    return (
        <div className='dark:!bg-slate-950 min-h-screen container min-w-full overflow-hidden'>
            <Navbar />

            {/*main contents*/}
            <div className=' flex flex-col mx-auto px-4 py-10 2xl:px-20  rounded-lg'>
  {/*job info section */}
  <div className='rounded-xl text-black dark:text-gray-200 w-full flex justify-center flex-wrap md:justify-between gap-8 py-16 px-14 sm:py-20 mb-6 bg-sky-50 dark:!bg-slate-800 border border-sky-400 dark:border-gray-700'>
    <div className='flex flex-col md:flex-row gap-8 items-center'>
      <Skeleton width={75} height={96} className='dark:!bg-slate-300' />

      <div className='text-center md:text-right text-neutral-700 dark:text-gray-300'>
        <Skeleton height={40}  className='dark:!bg-slate-400'/>

        <div className='grid max-sm:grid-cols-2 sm:grid-flow-col max-sm:gap-y-3 gap-x-3 mt-2 sm:gap-x-5 text-gray-600 dark:text-gray-400 text-sm h-6'>
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex gap-1 items-center">
              <Skeleton variant="circular" width={20} height={20}  className='dark:!bg-slate-500'/>
              <Skeleton width={40}  className='dark:!bg-slate-500'/>
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className='flex flex-col justify-center text-start text-sm mt-3'>
      <Skeleton width={150} height={60}  className='dark:!bg-blue-800' />
      <Skeleton width={120}  className='dark:!bg-slate-500'/>
    </div>
  </div>

  <div className='flex flex-col lg:flex-row justify-between items-start'>
    {/*description section */}
    <div className='w-full lg:w-2/4 flex flex-col gap-4'>
      <Skeleton height={60} className='dark:bg-slate-700'/>
      <Stack spacing={2}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className='dark:!bg-slate-800'/>
        ))}
      </Stack>

     


      <Skeleton width={140} height={60} className='dark:!bg-blue-900' />
    </div>

    <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 flex flex-col'>
      <Skeleton className='dark:!bg-slate-500' />
      <Stack spacing={2} marginTop={7}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant='rectangular' width={400} height={200} className='dark:!bg-slate-600' />
        ))}
      </Stack>
    </div>
  </div>
</div>


            <Footer />
        </div>
    )

}

export default Skeletons