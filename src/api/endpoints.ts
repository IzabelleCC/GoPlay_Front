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
    GetByName: "GetByName",
    UploadProfilePicture: "uploadProfilePicture",
  }),

  TournamentManager: buildControllerEndpoints("TournamentManager", {
    Base: null,
    GetById: "GetById",
    GetFullInformationById: "GetFullInformationById",
    GetAll: null,
    GetByName: "GetByTournamentName",
    GetByAdmUserId: "GetByAdmUserId",
    Create: null,
    Update: null,
    Delete: null,
    GenerateGroupMatches: "GenerateGroupMatches",
    ConfirmAttendance: "ConfirmAttendance",
    InsertGroupResults: "InsertGroupResults",
    InsertEliminationResults: "InsertEliminationResults",
    GetCategoriesByTournamentId: "GetCategoryByTournamentId",
    GetEliminationGamesByCategory: "GetEliminationGamesByCategory",
    UploadTournamentPicture: "UploadTournamentPicture",
  }),

  CategoryPlayer: buildControllerEndpoints("CategoryPlayer", {
    Register: "Register",
    GetAll: null,
    Update: null,
    GetById: null,
    Delete: null,
    GetByCategory: "ByCategory",
    GetByUser: "ByUser",
    GeneratePayment: "GeneratePayment",
    ByUserIdReturnsFullInfo: "GetByUserIdReturnsFullInfo",
    GetMatchGroupByCategoryId: "GetMatchGroupByCategoryId",
    GetGroupResultByCategoryIdAndGroupNumber: "GetGroupResultByCategoryId",
    GetRegistrationDetails: "GetRegistrationDetails",
    InsertCourtNumberMatchGroup: "InsertCourtNumberMatchGroup",
    InsertCourtNumberElimination: "InsertCourtNumberElimination",
  }),
});
