import React, { useEffect, useRef, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'

import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const JobForm = ({ job, state, jobId }) => {

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],

        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],


    ];
    const navigate = useNavigate()
    const { getJobs } = useContext(AppContext)
    const [title, setTitle] = useState(job?.title || '')
    const [location, setLocation] = useState(job?.location || 'تهران')
    const [category, setCategory] = useState(job?.category || 'برنامه نویسی')
    const [level, setLevel] = useState(job?.level || 'سطح مبتدی')
    const [salary, setSalary] = useState(job?.salary || 0)

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const description = quillRef.current.root.innerHTML
            const newJob = {
                title,
                description,
                category,
                level,
                salary,
                location,
            }
            if (state == "ایجاد") {
                postJob(newJob, 'post-job')
            } else {
                if (await postJob(newJob, 'update-job')) {
                    navigate('/dashboard/manage-jobs')
                }

            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const postJob = async (newJob, endpoint) => {
        const { data } = jobId
            ? await axios.put(`/api/company/${endpoint}`, { ...newJob, jobId })
            : await axios.post(`/api/company/${endpoint}`, newJob)

        if (data.success) {
            setTitle("")
            setSalary(0)
            quillRef.current.root.innerHTML = ""
            getJobs()
            toast.success(data.message)
            return true
        } else {
            toast.error(data.message)
        }

    }

    useEffect(() => {
        if (!quillRef.current && editorRef.current)
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: "شرایط ، وظایف و شرح کار را در اینجا تعریف کنید.",
                modules: {
                    toolbar: toolbarOptions
                }
            })
        quillRef.current.format('align', 'right')
        quillRef.current.format('direction', 'rtl')
        quillRef.current.root.innerHTML = job?.description || ""

    }, [])


    return (
        <form className='flex-1 container max-w-5xl p-4 flex flex-col w-full items-start gap-5'>
            <h3 className='text-2xl sm:text-3xl font-bold text-black/70 my-4'>فرم {state} کار</h3>
            <div className='w-full'>
                <p className='mb-2 text-gray-600'>عنوان کار</p>
                <input
                    placeholder='عنوان'
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                    type="text"
                    className='w-full max-w-lg px-3 py-1 sm:py-2 border-2 border-gray-300 rounded'
                />
            </div>
            <div className='w-full '>
                <p className='my-2 text-gray-600'>توضیحات کار</p>
                <div ref={editorRef}></div>

            </div>
            <div className='flex flex-col items-start sm:flex-row w-full  sm:items-center gap-8 sm:gap-8'>
                <div className='w-full'>
                    <p className='mb-2 text-gray-600'>دسته بندی کار</p>
                    <select
                        className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded  outline-none'
                        value={category}
                        onChange={e => setCategory(e.target.value)}>
                        {JobCategories.map((item, idx) => (
                            <option key={idx} value={item}>{item}</option>
                        ))

                        }
                    </select>
                </div>
                <div className='w-full'>
                    <p className='mb-2 text-gray-600'>مکان کار</p>
                    <select
                        className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded  outline-none'
                        value={location}
                        onChange={e => setLocation(e.target.value)}>
                        {JobLocations.map((item, idx) => (
                            <option key={idx} value={item}>{item}</option>
                        ))

                        }
                    </select>
                </div>
                <div className='w-full'>
                    <p className='mb-2 text-gray-600'>سطح کار</p>
                    <select
                        className='w-full  px-3 py-1 sm:py-2 border-2 border-gray-300 rounded outline-none'
                        value={level}
                        onChange={e => setLevel(e.target.value)}>

                        <option value='سطح مبتدی'>سطح مبتدی</option>
                        <option value='سطح جونیور'>سطح جونیور</option>
                        <option value='سطح سنیور'>سطح سنیور</option>

                    </select>
                </div>
            </div>

            <div className=''>
                <p className='mb-2 text-gray-600'>حقوق کار</p>
                <input
                    value={salary}
                    className='w-full px-3 py-1 sm:py-2 border-2 border-gray-300 rounded sm:w-[120px]'
                    onChange={e => setSalary(e.target.value)}
                    type="Number"
                    min={0} />
            </div>
            <button
                onClick={onSubmitHandler}
                className='w-28 py-2 my-4 bg-gray-800 text-white rounded '>{state}</button>

        </form>
    )
}

export default JobForm