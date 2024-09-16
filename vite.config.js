import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.gltf", "**/*.glb"],
  plugins: [react(), eslint(), glsl()],
  server: {
    open: true,
  },
});
