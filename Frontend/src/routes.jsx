import { useApp } from './context/AppProvider'
import { useRoutes } from 'react-router-dom'

import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import AddJob from './Pages/AddJob'
import ManageJobs from './Pages/ManageJobs'
import ViewApplications from './Pages/ViewApplications'
import ApplyJob from './Pages/ApplyJob'
import Applications from './Pages/Applications'
import UpdateJob from './Pages/UpdateJob'
import CompanyProfile from './Pages/CompanyProfile'
import BlogPage from './Pages/Blog'
import Loader from './Components/Loading'
import NotFoundPage from './Components/NotFoundPage'



const AppRoutes = () => {
    const { companyToken, userData, companyData } = useApp()

    const routes = [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/apply-job/:id',
            element: <ApplyJob />,
        },
        {
            path: '/applications',
            element: userData && <Applications />,
        },
        {
            path: '/dashboard/*',
            element: <Dashboard />,
            children: companyToken ? [
                {
                    path: 'add-job',
                    element: <AddJob />
                },
                {
                    path: 'manage-jobs',
                    element: <ManageJobs />
                },
                {
                    path: 'view-applications',
                    element: <ViewApplications />
                },
                {
                    path: 'update-job/:jobId',
                    element: <UpdateJob />
                },
                {
                    path: 'profile',
                    element: companyData ? <CompanyProfile /> : <Loader />
                },
            ] : [{
                path: "*", element:
                    <div className='flex items-center justify-center h-[90vh] flex-1'>
                        <p className='text-xl sm:text-3xl dark:text-slate-500'> شما مجاز نیستید!</p>
                    </div>
            }]
        },
        {
            path: '/blog',
            element: <BlogPage />,
        },
        {
            path: '*',
            element: <NotFoundPage />
        }
    ]
    const router = useRoutes(routes)
    return router
}


export default AppRoutes