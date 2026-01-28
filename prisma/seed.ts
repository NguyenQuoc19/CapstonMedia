import { runSeeds } from "./seed/index";
import { PrismaClient } from "@/generated/prisma/client";
import { createMariaDbAdapter } from "@/config/database.config";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "@/common/constants/db.constant";

// const options = loadDatabaseConfig();
const prisma = new PrismaClient({
    adapter: createMariaDbAdapter({
        url: DB_HOST,
        name: DB_NAME,
        host: DB_HOST,
        port: DB_PORT,
        username: DB_USERNAME,
        password: DB_PASSWORD
    }),
    log: ["warn", "error"],
});

async function main() {
    await runSeeds(prisma)
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}

main()
    .catch((e) => {
        console.error("❌ Seed failed", e);
        process.exit(1);
    })
    .finally(async () => {
        console.log("🔌 Disconnecting from database...");
        await prisma.$disconnect();
    });
