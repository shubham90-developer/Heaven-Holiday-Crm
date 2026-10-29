// import dns from "node:dns/promises";
// dns.setServers(["8.8.8.8"]); // Force Google DNS for this app session
// dns.setServers([
//   "8.8.8.8",
//   "8.8.4.4"
// ]);
import express, { Application } from "express";
import cors from "cors";
import router from "./app/routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./app/config/swagger";
import cookieParser from "cookie-parser";
import path from "path";
// import router from "./app/routes/index"

const app: Application = express();
app.set("trust proxy", 1);
//Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://havenholidaycrm.vercel.app",
        "https://frontend-ten-ochre-86.vercel.app",
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//Routes
app.use("/v1/api", router);

const entryRoute = (_: any, res: any) => {
  const message = "Heaven Holiday CRM Backend Running 🚀";
  res.send(message);
};

app.get("/", entryRoute);

export default app;
