import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages project sites are served from /repo-name/.
 * Set VITE_BASE=/ in .env.production when deploying to a host at the domain root (e.g. Vercel).
 */
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  let base = "/";
  if (command === "build") {
    const raw = env.VITE_BASE ?? "/afterapply/";
    base = raw.endsWith("/") ? raw : `${raw}/`;
  }
  return {
    base,
    plugins: [react(), tailwindcss()],
  };
});
