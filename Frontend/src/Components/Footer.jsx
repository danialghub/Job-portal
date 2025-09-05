import { assets } from '../assets/assets'


const Footer = () => {
    return (
        <div className='container mx-auto px-8 2xl:px-20 flex justify-between items-center gap-4 py-3 mt-20'>
            <img className='scale-150  h-6' src={assets.dlLogo} alt="" />
            <p className='flex-1 border-r border-gray-400 pr-4 text-sm text-gray-500 max-sm:hidden'>حق کپی @DanialAz |حق کپی محفوظ شده.</p>
            <div className='flex gap-2.5'>
                <img 
                className='rounded-full border-2'
                width={38} src={assets.facebook_icon} alt="facebook" />
                <img 
                className='rounded-full border-2'
                width={38} src={assets.twitter_icon} alt="twitter" />
                <img 
                className='rounded-full border-2  '
                width={38} src={assets.instagram_icon} alt="instagram" />
            </div>
        </div>
    )
}

export default Footer