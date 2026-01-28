import { DatabaseConfig } from "@/config/database.config";

const loadDatabaseConfig = (): DatabaseConfig => {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is not defined");
    }

    const parsed = new URL(url);

    return {
        url,
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : 3306,
        name: parsed.pathname.replace(/^\//, ""),
        username: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
    };
};

/**
 * Database constants
 */
export const DB = Object.freeze(loadDatabaseConfig());

/**
 * Backward-compatible named exports (nếu cần)
 */
export const DB_URL = DB.url;
export const DB_HOST = DB.host;
export const DB_PORT = DB.port;
export const DB_NAME = DB.name;
export const DB_USERNAME = DB.username;
export const DB_PASSWORD = DB.password;