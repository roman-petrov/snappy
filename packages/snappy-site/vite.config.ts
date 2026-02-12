import { defineConfig } from "vite";

export default defineConfig({
  build: { rollupOptions: { input: ["index.html", "app.html"] } },
  plugins: [
    {
      name: "app-rewrite",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split("?")[0] ?? "";
          if ((url === "/app" || url.startsWith("/app/")) && !url.includes(".")) {
            req.url = "/app.html";
          }
          next();
        });
      },
    },
  ],
});
