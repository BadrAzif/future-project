import keycloak from 'keycloak-connect'
import session from 'express-session'
import 'dotenv/config'
const keycloakConfig = (app)=>{
    const memoryStore = new session.MemoryStore()
    app.use(session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        store:memoryStore,
    }))

    const keyCloak = new keycloak({
        store:memoryStore,
        
    },{
        realm:process.env.KEYCLOAK_REALM,
        "auth-server-url":process.env.KEYCLOAK_URL,
        "ssl-required":'external',
        resource:process.env.KEYCLOAK_CLIENT_ID,
        "confidential-port":0,
        "bearer-only":true,
        credentails: {
            secret:process.env.KEYCLOAK_SECRET
        }
    })
    app.use(keyCloak.middleware())
    return keyCloak
}

export {keycloakConfig} 