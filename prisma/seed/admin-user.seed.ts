import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { PrismaClient, UserStatus } from "@/generated/prisma/client";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ex.co";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

export async function seedAdminUser(prisma: PrismaClient) {
    console.log("→ Seeding admin user");

    const email = ADMIN_EMAIL;
    const password = ADMIN_PASSWORD;

    const roleTable = prisma.role;

    const adminRole = await roleTable.findUnique({ where: { code: "ADMIN" } });
    if (!adminRole) throw new Error("ADMIN role not found");

    const userTable = prisma.user;
    const user = await userTable.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: "System Admin",
            status: UserStatus.active,
            password: await bcrypt.hash(password, 10),
            roles: {
                create: {
                    role_id: adminRole.id,
                },
            },
        },
    });

    console.log(`✔ Admin user ready: ${user.email}`);
}
