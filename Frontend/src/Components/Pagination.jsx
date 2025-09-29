import { memo } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";

const Pagination = memo(({ list, page, setPage, perPage }) => {

    return (
        <div className="flex justify-center items-center gap-2 mb-10">
  {/* Next */}
  <a
    onClick={e =>
      setPage(prev => Math.min(prev + 1, Math.ceil(list.length / perPage)))
    }
    href="#job_list"
    className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors duration-300 shadow-sm 
      ${
        page - 1 == Math.ceil(list.length / perPage) - 1
          ? "bg-gray-300 dark:bg-slate-800 text-gray-400 pointer-events-none"
          : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
      }`}
  >
    <RiArrowRightSLine className="font-bolder text-2xl" />
  </a>

  {/* Page numbers */}
  <div className="flex flex-row-reverse gap-2">
    {Array.from({ length: Math.ceil(list.length / perPage) }).map((_, idx) => (
      <a key={idx} href="#job_list" onClick={e => setPage(idx + 1)}>
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-all duration-300 shadow-sm
            ${
              page == idx + 1
                ? "bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200"
            }`}
        >
          {idx + 1}
        </button>
      </a>
    ))}
  </div>

  {/* Prev */}
  <a
    onClick={e => setPage(prev => Math.max(prev - 1, 1))}
    href="#job_list"
    className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors duration-300 shadow-sm
      ${
        page - 1 == 0
          ? "bg-gray-300 dark:bg-slate-800 text-gray-400 pointer-events-none"
          : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200"
      }`}
  >
    <RiArrowLeftSLine className="font-bolder text-2xl" />
  </a>
</div>


    )
}
)
export default Pagination