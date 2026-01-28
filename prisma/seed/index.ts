import { seedRoles } from "./role.seed";
import { PrismaClient } from "@/generated/prisma/client";
import { seedAdminUser } from "./admin-user.seed";
import { seedAuthConfig } from "./auth-config.seed";
import { seedPermission } from "./permission.seed";
import { seedSocialProviders } from "./social-provider.seed";
import { seedPermissionAndRolePermission } from "./role-permission.seed";

export async function runSeeds(prisma: PrismaClient) {
    console.log('🌱 Start database seeding...');

    try {
        await seedRoles(prisma);
        await seedAuthConfig(prisma);
        await seedSocialProviders(prisma);
        await seedAdminUser(prisma);
        await seedPermission(prisma);
        await seedPermissionAndRolePermission(prisma);

        console.log('✅ Database seeding completed');
    } catch (error) {
        console.error('❌ Database seeding failed', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
