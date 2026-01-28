import "dotenv/config";

const loadAppConfig = () => {
    const port = process.env.PORT;
    if (!port) throw new Error('PORT is not defined');

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

    return {
        port,
        jwtSecret,
    }
}

/**
 * App constants
 */
export const APP = Object.freeze(loadAppConfig());

/**
 * Backward-compatible named exports 
 */
export const PORT = APP.port;
export const JWT_SECRET = APP.jwtSecret;
