import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // '/christoskoltsis-site/' while the site lives on github.io, '/' once the domain is connected
  base: process.env.SITE_BASE || '/',
  plugins: [react()],
  // The artifact preview is one self-contained file, so images go inline there
  build: process.env.VITE_HASH_ROUTES === 'true' ? { assetsInlineLimit: 1e8, outDir: 'dist-preview' } : {},
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
