import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // '/christoskoltsis-site/' while the site lives on github.io, '/' once the domain is connected
  base: process.env.SITE_BASE || '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
