import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import AddJob from './Pages/AddJob'
import ManageJobs from './Pages/ManageJobs'
import ViewApplications from './Pages/ViewApplications'
import ApplyJob from './Pages/ApplyJob'
import Applications from './Pages/Applications'
import { useContext } from 'react'
import { AppContext } from './context/AppContext'
import { useRoutes } from 'react-router-dom'

const AppRoutes = () => {
    const { companyToken, userData } = useContext(AppContext)

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
            path: userData && '/applications',
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
            ] : [{
                path: "*", element:
                    <div className='flex items-center justify-center h-[90vh] flex-1'>
                        <p className='text-xl sm:text-2xl '> شما مجاز نیستید!</p>
                    </div>
            }]
        },
    ]
    const router = useRoutes(routes)
    return router
}


export default AppRoutes