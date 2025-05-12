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
    },
    TournamentManager: {
        Base: `${API_BASE}/TournamentManager`,
        GetById: `${API_BASE}/TournamentManager/GetById`,
        GetAll: `${API_BASE}/TournamentManager`,
        GeByName: `${API_BASE}/TournamentManager/GetByTournamentName`,
        Create: `${API_BASE}/TournamentManager`,
        Update: `${API_BASE}/TournamentManager`,
        Delete: `${API_BASE}/TournamentManager`,
    },
};
