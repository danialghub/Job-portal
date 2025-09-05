import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

const Pagination = ({ list, page, setPage, perPage }) => {
    return (
        <div className='flex justify-center items-center gap-1 mt-10  '>
            <a
                onClick={e => setPage(prev => Math.min(prev + 1, Math.ceil(list.length / perPage)))}
                href="#job_list"
                className={`w-10 h-10  flex justify-center items-center rounded ${page - 1 == Math.ceil(list.length / perPage) - 1 ? 'bg-gray-400 pointer-events-none' : 'bg-gray-700 '}`}
            >
                <RiArrowRightSLine className='font-bolder text-2xl text-white' />
            </a>
            <div className="flex flex-row-reverse ">
                {Array.from({ length: Math.ceil(list.length / perPage) }).map((_, idx) => (
                    <a key={idx} href="#job_list" onClick={e => setPage(idx + 1)}>
                        <button
                            className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded text-white  ${page == idx + 1 ? "bg-blue-500" : "bg-gray-600"}`}
                        >{idx + 1}</button>
                    </a>
                ))}
            </div>
            <a onClick={e => setPage(prev => Math.max(prev - 1, 1))}
                href="#job_list"
                className={`w-10 h-10  flex justify-center items-center rounded ${page - 1 == 0 ? 'bg-gray-400 pointer-events-none' : 'bg-gray-700 '}`}
            >
                <RiArrowLeftSLine className='font-bolder text-2xl text-white' />


            </a>

        </div>

    )
}

export default Pagination