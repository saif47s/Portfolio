import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";

if (process.env.NODE_ENV === "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Global error logger for production debugging
process.on("uncaughtException", (err) => {
  const errorMsg = `[${new Date().toISOString()}] Uncaught Exception: ${err.stack || err}\n`;
  console.error(errorMsg);
  try {
    fs.appendFileSync("server-crash.log", errorMsg);
  } catch (e) { }
});

process.on("unhandledRejection", (reason, promise) => {
  const errorMsg = `[${new Date().toISOString()}] Unhandled Rejection at: ${promise}, reason: ${reason}\n`;
  console.error(errorMsg);
  try {
    fs.appendFileSync("server-crash.log", errorMsg);
  } catch (e) { }
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for separate frontend deployment
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : true,
  credentials: true,
}));

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "...";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = Number(process.env.PORT) || 7860;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT} in ${app.get("env")} mode`);
  });
})();
