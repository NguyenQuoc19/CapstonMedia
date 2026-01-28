import { registerAs } from "@nestjs/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

export interface DatabaseConfig {
    url: string;
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
}

const parseDatabaseUrl = (url: string) => {
    if (!url) {
        throw new Error("DATABASE_URL is not defined");
    }

    const parsed = new URL(url);

    return {
        host: parsed.hostname,
        port: parsed.port ? Number(parsed.port) : 3306,
        name: parsed.pathname.replace("/", ""),
        username: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
    };
}

export const createMariaDbAdapter = (config: DatabaseConfig) => new PrismaMariaDb({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.name,
    connectionLimit: 5,
});

export default registerAs("database", () => {
    const url = process.env.DATABASE_URL ?? "";
    const parsed = parseDatabaseUrl(url);

    return {
        url,
        ...parsed,
    } satisfies DatabaseConfig;
});