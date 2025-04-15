const API_BASE = "https://goplay-production.up.railway.app/api";

export const Endpoints = {
    AccessManager: {
        Login: `${API_BASE}/AccessManager/Login`,
        Logout: `${API_BASE}/AccessManager/Logout`,
        PasswordResetLink: `${API_BASE}/AccessManager/SendPasswordResetLink`,
        ResetPassword: `${API_BASE}/AccessManager/ResetPassword`,
    },
    UserManager: {
        Base: `${API_BASE}/UserManager`,
        GetByUserName: `${API_BASE}/UserManager/GetByUserName`,
        Delete: `${API_BASE}/UserManager`,
        EmailConfirmation: `${API_BASE}/UserManager/emailConfirmation`,
    }
};
