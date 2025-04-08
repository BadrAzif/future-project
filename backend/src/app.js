import e from "express";
import authRouter from "./routes/auth.routes.js";
import socialRouter from "./routes/social.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { keycloakConfig } from "./config/keycloak.js";
import "dotenv/config";
import { errorHandler } from "./middlewares/error.middlware.js";
import { connectDb } from "./config/database.js";
const app = e();

connectDb();

keycloakConfig(app);

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/auth/social", socialRouter);

app.use("/health", (req, res) =>
    res.status(200).json({
        status: "success",
        message: "server is running",
    })
);

app.use(errorHandler);

export default app;
