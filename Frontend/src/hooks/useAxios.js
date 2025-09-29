import { useState, useCallback } from "react";
import api from "../api/axios";

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = useCallback(async ({ url, method = "GET", body = null, headers = {} }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        url,
        method,
        data: body,
        headers,
      });

      setData(response.data);

      // ذخیره توکن‌ها در صورت وجود
      if (response.data?.token) {
        localStorage.setItem("companyToken", response.data.token);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      return response.data;
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendRequest, data, error, loading };
}
export default useAxios
