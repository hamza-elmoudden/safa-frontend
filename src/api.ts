import axios from 'axios';

const API_BASE =  process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // يرسل الكوكيز تلقائياً مع كل طلب
});

// أضف access_token من localStorage إذا موجود (fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// هذه الـ endpoints لا تحتاج refresh — لو فشلوا نوجه للـ login مباشرة
// /auth/me is the initial session check — if it 401s the user is simply not logged in,
// attempting a token refresh here would cause an infinite loop.
const AUTH_SKIP_URLS = ['/auth/refresh', '/auth/logout', '/auth/google', '/auth/me'];

let isRefreshing = false;
let failedQueue: Array<{ resolve: (val: any) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url: string = original?.url || '';
    const isSkipped = AUTH_SKIP_URLS.some(u => url.includes(u));

    if (err.response?.status === 401 && !original._retry && !isSkipped) {
      original._retry = true;

      // لو في refresh جارٍ، نضيف الطلب لقائمة الانتظار
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        // الكوكي refresh_token يُرسل تلقائياً مع withCredentials
        // نرسل أيضاً Bearer header كـ fallback
        const refreshToken = localStorage.getItem('refresh_token');
        const headers: Record<string, string> = {};
        if (refreshToken) headers.Authorization = `Bearer ${refreshToken}`;

        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true, headers }
        );

        // نخزن التوكنات الجديدة
        if (data.accessToken) localStorage.setItem('access_token', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refresh_token', data.refreshToken);

        // نحدّث الطلب الأصلي ونعيد المحاولة
        const newToken = data.accessToken;
        original.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        return api(original);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
export { API_BASE };
