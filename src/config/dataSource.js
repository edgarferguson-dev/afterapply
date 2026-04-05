const raw = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

/** @type {string | null} */
export const appsScriptUrl =
  typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;

export const isLiveDataEnabled = Boolean(appsScriptUrl);
