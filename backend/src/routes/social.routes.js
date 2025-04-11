import e from "express";
import axios from "axios";
import keycloakConfig from "../config/keycloak.js";

const router = e.Router();

router.get("/google", (_, res) => {
    const { authServerUrl, clientId, redirectUri } = keycloakConfig;
    const authUrl = `${authServerUrl}/api/protocol/openid-connect/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile&kc_idp_hint=google`;
    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send({ error: "No code provided" });

    try {
        const { authServerUrl, clientId, clientSecret, redirectUri } = keycloakConfig;

        const tokenRes = await axios.post(
            `${authServerUrl}/api/protocol/openid-connect/token`,
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token,id_token } = tokenRes.data;

        if (!access_token) {
            return res.status(500).send({ error: "Failed to retrieve access token" });
        }

        const userRes = await axios.get(
            `${authServerUrl}/api/protocol/openid-connect/userinfo`,
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        const profile = userRes.data;

        if (!profile || !profile.sub) {
            return res.status(500).send({ error: "Failed to retrieve user profile" });
        }

        // Simulate user login or registration
        res.status(200).json({
            status: "success",
            message: "Google login successful",
            data: { profile,access_token,id_token },
        });
    } catch (err) {
        console.error("Error during Google login:", err?.response?.data || err.message);
        res.status(err?.response?.status || 500).send({
            error: err?.response?.data?.error_description || "Google login failed",
        });
    }
});

router.get("/logout", async (req, res) => {
    try {
        const { authServerUrl, clientId } = keycloakConfig;
        const { id_token } = req.query;

        if (!id_token) {
            return res.status(400).json({ error: "Access token is required for logout" });
        }

        const logoutUrl = `${authServerUrl}/api/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(
            process.env.APP_URL
        )}&client_id=${clientId}&id_token_hint=${id_token}`;

        res.redirect(logoutUrl);
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Logout failed" });
    }
});


export default router;
