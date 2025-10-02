import  { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, UploadCloud, Save } from 'lucide-react'
import { useApp } from '../context/AppProvider'
import axios from 'axios'
import { toast } from 'react-hot-toast'
export default function CompanyProfile() {

  const { companyData, fetchCompanyData } = useApp()

  const [name, setName] = useState(companyData.name)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)


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
    <div className='flex-1 h-[100vh] w-full overflow-y-auto'>
      <div className=" min-h-[90vh] max-sm:mb-40  flex items-center justify-center p-4   dark:bg-slate-950 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl backdrop-blur-xl border rounded-2xl p-4 sm:p-8 shadow-xl bg-white/90 dark:bg-slate-900 transition-colors duration-300 border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Right: Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 bg-white/90 dark:bg-slate-800/80 rounded-xl p-4 sm:p-6 shadow-md"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 dark:text-white">
                  ویرایش پروفایل
                </h2>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {companyData.name} ✨
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    نام کامل
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
                    <User size={16} className="text-gray-500 dark:text-gray-300" />
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="نام کامل شما"
                      className="bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 w-full"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    ایمیل
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
                    <Mail size={16} className="text-gray-500 dark:text-gray-300" />
                    <input
                      disabled
                      type="email"
                      value={companyData.email}
                      className="bg-transparent outline-none text-gray-500 dark:text-gray-400 w-full"
                    />
                  </div>
                </div>

                {/* Current Password */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    رمز عبور فعلی
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
                    <Lock size={16} className="text-gray-500 dark:text-gray-300" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور فعلی"
                      className="bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 w-full"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    رمز عبور جدید
                  </label>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
                    <Lock size={16} className="text-gray-500 dark:text-gray-300" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="رمز عبور جدید"
                      className="bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(companyData.name);
                    setPassword("");
                    setConfirm("");
                    resetAvatar();
                  }}
                  className="w-full sm:w-auto px-6 py-2 rounded-full bg-gray-400 hover:bg-gray-500 text-white"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Save size={16} />
                  <span>ذخیره</span>
                </button>
              </div>
            </form>

            {/* Left: Avatar */}
            <div className="lg:w-1/3 flex flex-col items-center gap-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 p-4 rounded-xl shadow-md ">
              <div className="relative">
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white dark:border-slate-600 shadow-lg ">
                  <div
                    onMouseDown={onMouseDown}
                    onMouseMove={onMove}
                    onMouseUp={endDrag}
                    onMouseLeave={endDrag}
                    onTouchStart={onTouchStart}
                    onTouchMove={onMove}
                    onTouchEnd={endDrag}
                    className="w-full h-full cursor-grab touch-none"
                  >
                    {avatarUrl || companyData.image ? (
                      <img
                        src={companyData.image || avatarUrl}
                        alt="avatar"
                        draggable={false}
                        style={{
                          transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`,
                          transformOrigin: "center center",
                        }}
                        className="w-full h-full object-cover select-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-3xl shadow-md">
                        <User />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mini text */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/40 dark:bg-white/20 px-4 py-2 rounded-full text-xs text-white backdrop-blur-sm max-sm:text-[10px]">
                  برای تغییر مکان عکس را درگ کنید
                </div>
              </div>

              {/* Upload + Controls */}
              <div className="w-full flex flex-col gap-3 mt-2">
                <label className="flex items-center gap-3 cursor-pointer justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <div className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full transition">
                    <UploadCloud size={16} />
                    <span className="text-sm">آپلود لوگو</span>
                  </div>
                </label>

                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))
                    }
                    className="p-2 text-2xl bg-gray-200 dark:bg-slate-600 rounded-full text-gray-800 dark:text-white"
                  >
                    -
                  </button>
                  <input
                    aria-label="zoom"
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.01"
                    value={zoom}
                    onChange={(e) => setZoom(+e.target.value)}
                    className="w-32 sm:w-36"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))
                    }
                    className="p-2 text-2xl bg-gray-200 dark:bg-slate-600 rounded-full text-gray-800 dark:text-white"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setPos({ x: 0, y: 0 })}
                    type="button"
                    className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded-full text-white"
                  >
                    بازنشانی مکان
                  </button>
                  <button
                    onClick={resetAvatar}
                    type="button"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

}
