import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  // WICHTIG für GitHub Pages (Repo-Name!)
  base: "/Vereinskasse/",

  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.svg",
        "pwa-192.png",
        "pwa-512.png",
      ],

      manifest: {
        name: "Vereinskasse",
        short_name: "Kasse",
        description: "Offline-Kasse für Vereine",

        // 🔴 EXTREM WICHTIG für GitHub Pages + iPad
        start_url: "/Vereinskasse/",
        scope: "/Vereinskasse/",

        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0f3d2e",

        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});