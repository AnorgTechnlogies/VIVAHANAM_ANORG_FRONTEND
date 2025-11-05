// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // Main frontend port
    host: true, // Makes the app accessible via local network (e.g., for testing on phone)
    proxy: {
      "/api": {
        target: "http://localhost:8000", // Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
