import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

// Dev-only plugin: route /admin/* to admin.html, everything else to index.html
function multiPagePlugin(): Plugin {
  return {
    name: "multi-page-router",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "/";
        if (url === "/admin" || url.startsWith("/admin/") || url.startsWith("/admin?")) {
          req.url = "/admin.html";
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), multiPagePlugin()],

  build: {
    rollupOptions: {
      input: {
        main:  path.resolve(__dirname, "index.html"),
        admin: path.resolve(__dirname, "admin.html"),
      },
    },
  },

  server: {
    host: "0.0.0.0",
  },
});
