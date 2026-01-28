import { PrismaClient } from "@/generated/prisma/client";

export async function seedRoles(prisma: PrismaClient) {
    console.log("→ Seeding roles");

    const roles = [
        { code: "ADMIN", name: "Administrator" },
        { code: "USER", name: "User" },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {},
            create: role,
        });
    }
}
