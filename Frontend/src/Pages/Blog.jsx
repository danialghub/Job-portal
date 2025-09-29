import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { motion } from "framer-motion";

const blogPosts = [
  {
    title: "چگونه شغل مناسب خود را پیدا کنیم",
    author: "علی رضایی",
    date: "19 شهریور 1404",
    excerpt: "در این مقاله به بررسی نکات مهم برای یافتن شغل مناسب و موفقیت در مصاحبه‌ها پرداخته‌ایم...",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "موفقیت شغلی",
  },
  {
    title: "مهارت‌های ضروری برای بازار کار امروز",
    author: "مریم کریمی",
    date: "12 شهریور 1404",
    excerpt: "با تغییرات سریع بازار کار، آشنایی با مهارت‌های کلیدی برای موفقیت ضروری است...",
    image: "https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "مهارت‌ها",
  },
  {
    title: "نکات طلایی برای رزومه نویسی حرفه‌ای",
    author: "سارا محمدی",
    date: "5 شهریور 1404",
    excerpt: "رزومه خوب اولین قدم برای جذب کارفرما است، در این مقاله نکات حرفه‌ای رزومه نویسی را بررسی می‌کنیم...",
    image: "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=800",
    category: "رزومه",
  },
];


const categories = ["همه", "موفقیت شغلی", "مهارت‌ها", "رزومه"];

const BlogPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500 to-pink-500 dark:from-indigo-700 dark:to-pink-700 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            DLaz Job Portal Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-lg md:text-xl"
          >
            راهنمای شما برای موفقیت شغلی و ارتقای مهارت‌ها
          </motion.p>
        </div>
      </header>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className="px-4 py-2 rounded-full border border-indigo-500 text-indigo-500 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-400 transition"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Cards */}
      <main className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <img src={post.image} alt={post.title} className="w-full h-52 object-cover" />
            <div className="p-6 flex flex-col flex-1">
              <span className="text-sm text-indigo-500 dark:text-indigo-400 mb-2">{post.category}</span>
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                نوشته شده توسط {post.author} | {post.date}
              </p>
              <p className="text-gray-700 dark:text-gray-300 flex-1">{post.excerpt}</p>
              <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition self-start">
                مطالعه بیشتر
              </button>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Featured Author */}
      <section className="bg-indigo-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">نویسنده برجسته ماه</h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            سارا محمدی با بیش از ۱۰ سال تجربه در منابع انسانی و استخدام، نکات کلیدی و حرفه‌ای را برای شما به اشتراک می‌گذارد.
          </p>
         <img
  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
  alt="Author"
  className="mx-auto rounded-full border-4 border-indigo-500 dark:border-indigo-400"
/>

        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-700 dark:to-indigo-700 py-16 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">همین حالا به جامعه DLaz بپیوندید!</h2>
        <p className="mb-6 text-lg">با ثبت‌نام، به مقالات اختصاصی و فرصت‌های شغلی دسترسی پیدا کنید.</p>
        <button className="bg-white text-indigo-600 dark:text-indigo-700 font-bold px-6 py-3 rounded-full hover:scale-105 transition">
          ثبت‌نام
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-12 mt-16">
        <div className="container mx-auto text-center px-4">
          <h3 className="text-xl font-semibold mb-2">DLaz Job Portal</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            همراه شما در مسیر شغلی موفق
          </p>
          <div className="flex justify-center gap-6 text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-indigo-500 transition">توییتر</a>
            <a href="#" className="hover:text-indigo-500 transition">لینکدین</a>
            <a href="#" className="hover:text-indigo-500 transition">اینستاگرام</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
