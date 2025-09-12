import React, { useEffect, useState } from 'react'
import JobForm from '../Components/JobForm'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Loader from '../Components/Loading'
import { toast } from 'react-toastify'

const UpdateJob = () => {
    console.log('UpdateJob');
    const { jobId } = useParams()
    const [jobData, setJobData] = useState(null)

    console.log(jobId);
    const getJob = async () => {
        try {
            const { data } = await axios.get(`/api/jobs/${jobId}`)
            if (data.success) {
                setJobData(data.job)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getJob()
    }, [])
    return jobData ? (
        <JobForm job={jobData} state="بروزرسانی" jobId={jobId} />
    ) : <Loader />
}

export default UpdateJob