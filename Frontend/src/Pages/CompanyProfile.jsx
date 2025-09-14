import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, UploadCloud, Save, X } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
export default function CompanyProfile() {

    const { companyData, fetchCompanyData } = useContext(AppContext)

    const [name, setName] = useState(companyData.name)
    const [password, setPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState(null)
    console.log(companyData.image);


    // cropping/panning/zoom state
    const [zoom, setZoom] = useState(1)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const dragging = useRef(false)
    const last = useRef({ x: 0, y: 0 })

    useEffect(() => {
        return () => {
            if (avatarUrl) URL.revokeObjectURL(avatarUrl)
        }
    }, [avatarUrl])

    function onFileChange(e) {
        const f = e.target.files?.[0]
        if (!f) return
        setAvatarFile(f)
        const url = URL.createObjectURL(f)
        setAvatarUrl(url)
        setZoom(1)
        setPos({ x: 0, y: 0 })
    }

    function onMouseDown(e) {
        dragging.current = true
        last.current = { x: e.clientX, y: e.clientY }
    }
    function onTouchStart(e) {
        dragging.current = true
        const t = e.touches[0]
        last.current = { x: t.clientX, y: t.clientY }
    }
    function onMove(e) {
        if (!dragging.current) return
        const client = e.touches ? e.touches[0] : e
        const dx = client.clientX - last.current.x
        const dy = client.clientY - last.current.y
        last.current = { x: client.clientX, y: client.clientY }
        setPos(p => ({ x: p.x + dx, y: p.y + dy }))
    }
    function endDrag() { dragging.current = false }

    function resetAvatar() {
        setAvatarFile(null)
        if (avatarUrl) URL.revokeObjectURL(avatarUrl)
        setAvatarUrl(null)
        setZoom(1)
        setPos({ x: 0, y: 0 })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            // prepare payload
            const form = new FormData()
            form.append('name', name)
            if (password) form.append('password', password)
            if (newPassword) form.append('newPassword', newPassword)
            if (avatarFile) form.append('image', avatarFile)


            const { data } = await axios.post('/api/company/update-profile', form)
            if (data.success) {
                toast.success(data.message)
                fetchCompanyData()
                setPassword('')
                setNewPassword('')
                setAvatarFile(null)
            } else {
                data.message.forEach(error => {
                    toast.error(error)
                })
            }

        } catch (error) {
            toast.error(error.message)
        }


    }

    return (
        <div

            className="min-h-screen w-full overflow-hidden  flex items-center justify-center  p-6 flex-1">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-4xl w-full  backdrop-blur-md border  rounded-2xl p-8 shadow-2xl md:mb-36 bg-gray-800"
            >
                <div className="flex flex-col-reverse md:flex-row gap-8 ">


                    {/* Right: Form */}
                    <form onSubmit={handleSubmit} className="max-sm:text-sm md:w-2/3 bg-gray-800 py-6 md:px-6 rounded-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-md md:text-2xl font-semibold text-white">ویرایش پروفایل</h2>
                            <div className="text-sm text-white/70">{companyData.name} ✨</div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-xs text-white/70 mb-2">نام کامل</label>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                                    <User size={16} className="text-white/70" />
                                    <input
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)} placeholder="Your full name" className="bg-transparent outline-none text-white placeholder-white/40 w-full" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-white/70 mb-2">ایمیل</label>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2" >
                                    <Mail size={16} className="text-white/70" />
                                    <input
                                        disabled
                                        type="email"
                                        value={companyData.email}
                                        className="bg-transparent outline-none text-white/50 placeholder-white/40 w-full" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-white/70 mb-2">رمزعبور فعلی</label>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                                    <Lock size={16} className="text-white/70" />
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور فعلی " className="bg-transparent outline-none text-white placeholder-white/40 w-full" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-xs text-white/70 mb-2">رمز عبور جدید</label>
                                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                                    <Lock size={16} className="text-white/70" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)} placeholder="رمزعبور جدید"
                                        className="bg-transparent outline-none text-white placeholder-white/40 w-full" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-3 ">
                            <button type="button" onClick={() => { setName(''); setEmail(''); setPassword(''); setConfirm(''); resetAvatar(); }} className="px-6 text-white hover:bg-gray-600 py-2 rounded-full bg-gray-500">لغو</button>

                            <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white">
                                <Save size={16} />
                                <span>ذخیره</span>
                            </button>
                        </div>


                    </form>

                    {/* Left: Avatar + controls */}
                    <div className="md:w-1/3 flex flex-col items-center gap-6  bg-gradient-to-b from-white/80 to-white/50 p-4 rounded-lg">
                        <div className="relative">
                            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-black/10 shadow-lg ">
                                <div
                                    onMouseDown={onMouseDown}
                                    onMouseMove={onMove}
                                    onMouseUp={endDrag}
                                    onMouseLeave={endDrag}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onMove}
                                    onTouchEnd={endDrag}
                                    className="w-full h-full cursor-grab touch-none "
                                >
                                    {avatarUrl || companyData.image ? (
                                        <img
                                            src={companyData.image}
                                            alt="avatar"
                                            draggable={false}
                                            style={{
                                                transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
                                                transformOrigin: 'center center'
                                            }}
                                            className="w-full h-full object-cover select-none"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-400 flex items-center justify-center text-white text-3xl shadow-md">
                                            <User />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* mini shadow ring */}
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-4 rounded-full text-sm backdrop-blur-sm ">
                                <span className="text-xs text-gray-100">برای تغییر مکان عکس را درگ کنید</span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-3 mt-2">
                            <label className="flex items-center gap-3 cursor-pointer justify-center">
                                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                                <div className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-full transition">
                                    <UploadCloud size={16} />
                                    <span className="text-sm">آپلود لوگو</span>
                                </div>
                            </label>

                            <div className="flex gap-2 justify-center ">
                                <button type="button" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)))} className="p-2 text-2xl  bg-white/6 rounded-full">-</button>
                                <input aria-label="zoom" type="range" min="0.5" max="3" step="0.01" value={zoom} onChange={e => setZoom(+e.target.value)} className="w-36" />
                                <button type="button" onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))} className="p-2 text-2xl  bg-white/6 rounded-full">+</button>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button onClick={() => setPos({ x: 0, y: 0 })} type="button" className="px-4 py-2 bg-white/6 rounded-full bg-gray-500 hover:bg-gray-600 text-white">بازنشانی مکان</button>
                                <button onClick={resetAvatar} type="button" className="px-4 py-2 bg-red-600/80 text-white rounded-full hover:bg-red-700/80">حذف</button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
