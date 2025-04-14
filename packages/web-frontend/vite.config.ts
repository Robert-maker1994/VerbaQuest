import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    base: "/",
    envDir: "./",
    define: {
      "process.env": process.env,
    },
    plugins: [react()],
    test: {
      environment: "jsdom",
    },
    build: {
      rollupOptions: {
        external: [
          "@verbaquest/types"
        ]
      }
    },
    preview: {
      port: 8080,
      strictPort: true,
    },
    server: {
      port: 8080,
      strictPort: true,
      host: "0.0.0.0",
      origin: "http://0.0.0.0:8080",
    },
  };
});
