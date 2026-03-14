import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  root: "playground",

  server: {
    port: 5173,
    open: true,
  },
});