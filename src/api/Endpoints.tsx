const API_BASE = "https://goplay-production.up.railway.app/api";

export const Endpoints = {
    UserManager: `${API_BASE}/UserManager`,
    AccessManager: {
        Login: `${API_BASE}/AccessManager/Login`,
        Logout: `${API_BASE}/AccessManager/Logout`,
    }
};