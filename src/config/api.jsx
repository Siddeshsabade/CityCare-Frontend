// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const API_ENDPOINTS = {
  // User endpoints
  USERS_ALL: `${API_BASE_URL}/users/all`,
  USERS_CREATE: `${API_BASE_URL}/users/create`,
  
  // Issue endpoints
  ISSUES_ALL: `${API_BASE_URL}/issue/all`,
  ISSUES_CREATE: `${API_BASE_URL}/issue/create`,
  ISSUES_BY_ID: (id) => `${API_BASE_URL}/issue/${id}`,
  ISSUES_UPDATE: (id) => `${API_BASE_URL}/issue/update/${id}`,
};

export default API_ENDPOINTS;