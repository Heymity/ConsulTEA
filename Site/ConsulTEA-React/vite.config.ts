import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  appType: "spa"  // <-- ESSA LINHA RESOLVE O PROBLEMA
});
