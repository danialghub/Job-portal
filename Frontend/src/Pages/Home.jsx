import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import JobListing from '../Components/JobListing'
import Footer from '../Components/Footer'

const Home = () => {


    return (
        <div className='dark:bg-slate-950 transition-colors duration-300'>
            <Navbar />
            <Hero />
            <JobListing />
            <Footer />

        </div>
    )
}

export default Home