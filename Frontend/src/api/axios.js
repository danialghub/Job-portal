import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
});

// گرفتن توکن از localStorage
const getAccessToken = () => localStorage.getItem("companyToken");


// ➝ اضافه کردن accessToken به هدر هر درخواست
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ➝ هندل کردن خطاها (401 = توکن نامعتبر یا منقضی)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // برای جلوگیری از حلقه بی‌نهایت

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    // لاگ‌اوت اجباری
                    localStorage.removeItem("companyToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login"; // کاربر بره صفحه لاگین
                    return Promise.reject(error);
                }

                // درخواست برای گرفتن accessToken جدید
                const res = await axios.post("http://localhost:3000/api/company/refresh", {
                    refreshToken,
                });

                const newAccessToken = res.data.token;

                // ذخیره توکن جدید
                localStorage.setItem("companyToken", newAccessToken);

                // دوباره هدر رو ست کن
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                // درخواست اصلی رو دوباره بفرست
                return api(originalRequest);
            } catch (refreshError) {
                // اگه refresh هم خراب شد → لاگ‌اوت
                localStorage.removeItem("companyToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
