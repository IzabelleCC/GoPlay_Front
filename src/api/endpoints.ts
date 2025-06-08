const API_BASE = "https://goplay-production.up.railway.app/api";

const buildControllerEndpoints = (controller: string, actions: Record<string, string | null>) => {
  const base = `${API_BASE}/${controller}`;
  const endpoints: Record<string, string> = {};

  for (const [key, path] of Object.entries(actions)) {
    endpoints[key] = path ? `${base}/${path}` : base;
  }

  return endpoints;
};

export const Endpoints = Object.freeze({
  AccessManager: buildControllerEndpoints("AccessManager", {
    Login: "Login",
    Logout: "Logout",
    SendPasswordResetLink: "SendPasswordResetLink",
    ResetPassword: "ResetPassword",
  }),

  UserManager: buildControllerEndpoints("UserManager", {
    Base: null,
    GetByUserName: "GetByUserName",
    Delete: null,
    EmailConfirmation: "emailConfirmation",
  }),

  TournamentManager: buildControllerEndpoints("TournamentManager", {
    Base: null,
    GetById: "GetById",
    GetAll: null,
    GetByName: "GetByTournamentName",
    GetByAdmUserId: "GetByAdmUserId",
    Create: null,
    Update: null,
    Delete: null,
    GenerateGroupMatches: "GenerateGroupMatches",
    ConfirmAttendance: "ConfirmAttendance",
    InsertGroupResults: "InsertGroupResults",
    InsertEliminationResults: "InsertEliminationResults"
  }),
});
