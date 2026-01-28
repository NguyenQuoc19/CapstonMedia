import { PrismaClient } from "@/generated/prisma/client";

export async function seedAuthConfig(prisma: PrismaClient) {
    console.log("→ Seeding auth_config");

    await prisma.authConfig.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            access_ttl_admin_min: 5,
            access_ttl_mobile_min: 20,
            access_ttl_default_min: 15,

            refresh_ttl_admin_day: 14,
            refresh_ttl_mobile_day: 45,
            refresh_ttl_default_day: 30,

            max_active_sessions: 5,
            is_rotate_refresh_token: true,
        },
    });
}
