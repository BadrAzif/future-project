import 'dotenv/config';

const keycloakConfig = {
    realm: process.env.KEYCLOAK_REALM || 'api',
    authServerUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080/realms',
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_SECRET,
    redirectUri: `${process.env.APP_URL}/api/auth/social/google/callback`,
};

export default keycloakConfig;