import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useUser, useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()
    const { user } = useUser()

    const { getToken } = useAuth()

    const [searchFilter, setSearchFilter] = useState({ location: "", job: "" })
    const [isSearched, setIsSearched] = useState(false)
    const [jobs, setJobs] = useState(false)
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState(false)

    const getJobs = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/jobs')
            if (data.success) {
                setJobs(data.jobs)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }
    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
            if (data.success) {
                setCompanyData(data.company)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }
    const fetchUsersData = async () => {
        try {
            const token = await getToken()

            const { data } = await axios.get(backendUrl + '/api/users/user', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.succuss) {
                setUserData(data.user)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }
    const fetchUserApplications = async () => {
        try {
            const token = await getToken()
            console.log(token);

            const { data } = await axios.get(backendUrl + '/api/users/applications', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.succuss) {
                setUserApplications(data.application.reverse())

            } else {
                setUserApplications([])
            }
        } catch (error) {
            toast.error(error.message, {  })

        }
    }

    const logoutHandler = () => {
        setCompanyData(null)
        setCompanyToken(null)
        localStorage.removeItem('companyToken')
        navigate('/')
        toast.success("با موفقیت خارج شدید")
    }

    useEffect(() => {
        getJobs()
        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
        
    }, [])
    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    useEffect(() => {
        if (user) {
            fetchUsersData()
            fetchUserApplications()
        }
    }, [user])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        getJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData, setUserData,
        userApplications, setUserApplications,
        fetchUsersData,
        fetchUserApplications,
        logoutHandler

    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider