import e from "express";
import socialRouter from "./routes/social.routes.js";
import userRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { errorHandler } from "./middlewares/error.middlware.js";
import { connectDb } from "./config/database.js";

const app = e();

connectDb();

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.KEYCLOAK_URL],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.use('/api/auth',userRouter);
app.use("/api/auth/social", socialRouter);

app.use("/health", (req, res) =>
    res.status(200).json({
        status: "success",
        message: "server is running",
    })
);

app.use(errorHandler);

export default app;
