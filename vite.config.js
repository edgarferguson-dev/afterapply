import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages project URL: https://<user>.github.io/afterapply/
 * Production builds must use base "/afterapply/" so asset URLs resolve under that path.
 * Local dev keeps base "/" so you open http://localhost:5173/ without a subpath.
 */
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/afterapply/" : "/",
  plugins: [react(), tailwindcss()],
}));
