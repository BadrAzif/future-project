import e from "express";
import { validate, schemas } from "../middlewares/validations.middlware.js";
import {
    loginCtrl,
    registerCtrl,
    verifyEmailCtrl,
    requestPasswordResetCtrl,
    resetPasswordCtrl,
    logoutCtrl,
    getProfileCtrl,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = e.Router();
router.post("/register", validate(schemas.register), registerCtrl);
router.post("/login", validate(schemas.login), loginCtrl);
router.post("/verify-email/:token", validate(schemas.verify), verifyEmailCtrl);
router.post(
    "/forgot-password",
    validate(schemas.resetRequest),
    requestPasswordResetCtrl
);
router.post(
    "/reset-password",
    validate(schemas.resetPassword),
    resetPasswordCtrl
);

router.get("/profile", authenticate, getProfileCtrl);
router.post("/logout",  authenticate,logoutCtrl);
export default router;
