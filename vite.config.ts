import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import path from "node:path";

export default defineConfig({
  plugins: [react(), crx({ manifest: manifest as any })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
  build: {
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: "src/popup/index.html",
        dashboard: "src/dashboard/index.html",
      },
    },
  },
});
