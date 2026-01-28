import { Prisma } from "@/generated/prisma/client";
import { ConfigService } from "@nestjs/config";
import { DatabaseConfig, createMariaDbAdapter } from "@/config/database.config";

const prismaClientFactory = (config: ConfigService): Prisma.PrismaClientOptions => {
    const db = config.get<DatabaseConfig>("database");
    if (!db) throw new Error("Database config not found");

    return {
        adapter: createMariaDbAdapter(db),
        log: ["warn", "error"],
    };
};

export { prismaClientFactory };