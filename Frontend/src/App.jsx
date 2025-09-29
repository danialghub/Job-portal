
import { useApp } from './context/AppProvider'
import RecruiterLogin from './Components/RecruiterLogin'
import AppRoutes from './routes'
import { Toaster } from 'react-hot-toast'

function App() {

  const { showRecruiterLogin } = useApp()

  return (
    <>
      {showRecruiterLogin && <RecruiterLogin />}

      <Toaster
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white bg-white text-black shadow-lg rounded-lg",
        }}
      />

      <AppRoutes />
    </>

  )
}

export default App