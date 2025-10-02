import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppProvider'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'

import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const JobForm = ({ job, state, jobId }) => {
    console.log("Job form");

    const toolbarOptions = [
        [{ direction: "rtl" }],
        [{ align: [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['bold', 'italic', 'underline', 'strike'],
        ['code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ 'size': ['small', false, 'large', 'huge'] }, { 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],

    ];

    const navigate = useNavigate()
    const { getJobs } = useApp()
    const [title, setTitle] = useState(job?.title || '')
    const [location, setLocation] = useState(job?.location || 'تهران')
    const [category, setCategory] = useState(job?.category || 'برنامه نویسی')
    const [level, setLevel] = useState(job?.level || 'سطح مبتدی')
    const [salary, setSalary] = useState(job?.salary || 0)
    //  const {values , errors, handleChange , handleSubmit , setValues} = useForm({title,location,category,level,salary},onSubmitHandler)
    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const description = quillRef.current.root.innerHTML
            const newJob = { title, description, category, level, salary, location }

            const endpoint = state === "ایجاد" ? "post-job" : "update-job"
            const success = await postJob(newJob, endpoint)

            if (success && state !== "ایجاد") {
                navigate("/dashboard/manage-jobs")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }
    const postJob = async (newJob, endpoint) => {
        try {
            const url = `/api/company/${endpoint}`
            const payload = jobId ? { ...newJob, jobId } : newJob
            const action = jobId ? axios.put : axios.post

            const { data } = await action(url, payload)

            if (data.success) {
                // reset form
                setTitle("")
                setSalary(0)

                quillRef.current.setContents([])

                getJobs()
                toast.success(data.message)
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong")
            return false
        }
    }


    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "شرایط ، وظایف و شرح کار را در اینجا تعریف کنید.",
                modules: {
                    toolbar: toolbarOptions,
                },
            });

        }
        // مقداردهی اولیه متن
        quillRef.current.root.innerHTML = job?.description || "";
    }, []);




    return (
        <div className='flex-1  container max-h-[100vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'>

            <div className='min-h-[90vh] max-sm:mb-40 max-w-5xl'>
                <form className='px-5  p-4 flex flex-col w-full items-start gap-5'>
                    <h3 className='text-2xl sm:text-3xl font-bold text-black/70 my-4 dark:text-gray-100'>فرم {state} کار</h3>
                    <div className='w-full'>
                        <p className='mb-2 text-gray-600 dark:text-gray-300'>عنوان کار</p>
                        <input
                            placeholder='عنوان'
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                            type="text"
                            className='w-full max-w-lg px-3 py-1 sm:py-2 border-2 border-gray-300 rounded dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                        />
                    </div>
                    <div className='w-full '>
                        <p className='my-2 text-gray-600 dark:text-gray-300'>توضیحات کار</p>
                        <div className='dark:text-gray-100 dark:bg-slate-900' ref={editorRef} ></div>

                    </div>
                    <div className='flex flex-col items-start sm:flex-row w-full  sm:items-center gap-8 sm:gap-8'>
                        <div className='w-full'>
                            <p className='mb-2 text-gray-600 dark:text-gray-300'>دسته بندی کار</p>
                            <select
                                className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded  outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                                value={category}
                                onChange={e => setCategory(e.target.value)}>
                                {JobCategories.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
                                ))

                                }
                            </select>
                        </div>
                        <div className='w-full'>
                            <p className='mb-2 text-gray-600 dark:text-gray-300'>مکان کار</p>
                            <select
                                className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded  outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                                value={location}
                                onChange={e => setLocation(e.target.value)}>
                                {JobLocations.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
                                ))

                                }
                            </select>
                        </div>
                        <div className='w-full'>
                            <p className='mb-2 text-gray-600 dark:text-gray-300'>سطح کار</p>
                            <select
                                className='w-full  px-3 py-1 sm:py-2 border-2 border-gray-300 rounded outline-none dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                                value={level}
                                onChange={e => setLevel(e.target.value)}>

                                <option value='سطح مبتدی'>سطح مبتدی</option>
                                <option value='سطح جونیور'>سطح جونیور</option>
                                <option value='سطح سنیور'>سطح سنیور</option>

                            </select>
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='mb-2 text-gray-600 dark:text-gray-300' >حقوق کار</p>
                        <input
                            value={salary}
                            className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded sm:w-[120px] dark:bg-slate-900 dark:border-slate-800 dark:text-gray-100'
                            onChange={e => setSalary(e.target.value)}
                            type="Number"
                            min={0} />
                    </div>
                    <button
                        onClick={onSubmitHandler}
                        className='w-28 py-2 my-4 bg-gray-800 text-white rounded '>{state}</button>

                </form>
            </div>


        </div>

    )
}

export default JobForm