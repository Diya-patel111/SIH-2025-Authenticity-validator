import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001', // Your backend URL
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle API errors globally
apiClient.interceptors.response.use(
  (response) => response.data, // Return data directly on success
  (error) => {
    // Try to extract a meaningful error message
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);


// --- AUTH ---
export const registerInstitution = (data) => apiClient.post('/api/institution/register', data);
export const loginInstitution = (data) => apiClient.post('/api/institution/login', data);
export const registerVerifier = (data) => apiClient.post('/api/verifier/register', data);
export const loginVerifier = (data) => apiClient.post('/api/verifier/login', data);

// --- CERTIFICATE ---
export const addCertificate = (data) => apiClient.post('/api/certificate/add', data);

export const verifyCertificate = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/api/verify', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const extractCertificateData = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/certificate/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
