import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

// Default export: copy this file as e.g. NotFoundPage.jsx and use in your routes
// Requirements: TailwindCSS (dark mode set to 'class' or 'media') and framer-motion installed

export default function NotFoundPage() {
  const { toggleDarkMode, theme } = useTheme()


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors">
      <div className="max-w-5xl w-full px-6 py-12 lg:py-24">
        <div className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-transparent dark:border-slate-700">

          {/* Decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute -left-32 -top-20 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-300 to-yellow-300 opacity-80 blur-3xl mix-blend-multiply dark:from-sky-700 dark:to-violet-700 dark:opacity-40"></div>
          <div aria-hidden className="pointer-events-none absolute -right-32 -bottom-24 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200 to-blue-400 opacity-90 blur-3xl mix-blend-screen dark:from-fuchsia-600 dark:to-indigo-600 dark:opacity-30"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Illustration + big 404 */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-16 flex flex-col items-start gap-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-400">404</span>
                <span className="text-lg text-slate-600 dark:text-slate-300">— صفحه پیدا نشد  
                  <span dir="ltr" className="text-xl text-black/50 dark:text-slate-600 px-2">{location.pathname}</span>
                  </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-bold text-slate-900 dark:text-white">
                اوه! به یک صفحهٔ گمشده رسیدیم
              </h1>

              <p className="text-md text-slate-600 dark:text-slate-300 max-w-xl">
                آدرسی که دنبال آن بودید وجود ندارد یا حذف شده است. نگران نباشید — می‌توانیم شما را به صفحهٔ اصلی یا جستجو هدایت کنیم.
              </p>

              <div className="flex gap-3 items-center w-full max-w-sm">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-rose-300 dark:focus:ring-rose-700 transition-colors"
                >
                  بازگشت به خانه
                </Link>

                <Link
                  to="/support"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-transparent bg-white/60 dark:bg-white/5 text-slate-800 dark:text-slate-200 shadow-sm hover:bg-white/80 dark:hover:bg-white/6 transition-colors"
                >
                  گزارش مشکل
                </Link>
              </div>

              <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                یا از نوار جستجو استفاده کنید تا سریع‌تر به مقصد برسید.
              </div>
            </motion.div>

            {/* Right: Search + Graphic card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                <label htmlFor="site-search" className="sr-only">
                  جستجوی سایت
                </label>
                <div className="flex max-sm:flex-col max-sm:items-start items-center gap-3">
                  <input
                    id="site-search"
                    placeholder="جستجو در سایت..."
                    className="flex-1 rounded-lg px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 transition-colors"
                    type="search"
                    aria-label="جستجوی سایت"
                  />
                  <button className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 transition-colors">
                    جستجو
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 dark:text-gray-400">
                  <a href="/" className="text-sm p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                    صفحه اصلی
                  </a>
                  <a href="/contact" className="text-sm p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                    تماس با ما
                  </a>
                  <a href="/docs" className="text-sm p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                    مستندات
                  </a>
                  <a href="/blog" className="text-sm p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform">
                    بلاگ
                  </a>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-500 dark:text-slate-400">حالت:</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleDarkMode}
                      aria-pressed={theme}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-600 transition-colors"
                    >
                      {theme ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm5.657 2.343a1 1 0 010 1.414L15.414 6.999a1 1 0 11-1.414-1.414l.243-.243a1 1 0 011.414 0zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM14.657 15.657a1 1 0 01-1.414 0l-.243-.243a1 1 0 111.414-1.414l.243.243a1 1 0 010 1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.343 15.657a1 1 0 010-1.414l.243-.243a1 1 0 111.414 1.414l-.243.243a1 1 0 01-1.414 0zM4 9a1 1 0 110 2H3a1 1 0 110-2h1zM5.343 4.343a1 1 0 011.414-1.414l.243.243A1 1 0 116.999 4.343l-.243-.243A1 1 0 015.343 4.343z" />
                        </svg>
                      )}
                      <span className="sr-only">تغییر حالت</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Crying illustration */}
              <div className="mt-6 flex items-center justify-center">
                <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0" stopColor="#FDE68A" />
                      <stop offset="1" stopColor="#FB7185" />
                    </linearGradient>
                  </defs>
                  <rect x="10" y="20" width="200" height="110" rx="18" fill="url(#g1)" opacity="0.18" />
                  <g transform="translate(34,30)">
                    <motion.g initial={{ y: -6 }} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                      <circle cx="30" cy="30" r="22" fill="#fff" opacity="0.9" />



                      {/* Eyes */}
                      <circle cx="22" cy="26" r="3" fill="#111827" />
                      <circle cx="40" cy="26" r="3" fill="#111827" />

                      {/* Eyebrows sad */}
                      <path d="M17 22c3-4 8-4 12 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                      <path d="M35 22c3-4 8-4 12 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" />

                      {/* Tears */}
                      <path d="M22 30c0 4-2 8-2 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                      <path d="M40 30c0 4-2 8-2 8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    </motion.g>
                  </g>
                </svg>
              </div>


            </motion.div>
          </div>

        </div>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          اگر فکر می‌کنید این یک خطاست، لطفاً به <a className="text-rose-600 dark:text-rose-400 underline" href="/contact">تیم پشتیبانی</a> اطلاع دهید.
        </div>
      </div>
    </div>
  );
}
