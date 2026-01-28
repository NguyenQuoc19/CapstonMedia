import { PrismaClient } from "@/generated/prisma/client";

export async function seedSocialProviders(prisma: PrismaClient) {
    console.log("→ Seeding social providers");

    const providers = [
        { code: "google", name: "Google" },
        { code: "facebook", name: "Facebook" },
        { code: "apple", name: "Apple" },
    ];

    for (const provider of providers) {
        await prisma.socialProvider.upsert({
            where: { code: provider.code },
            update: {},
            create: provider,
        });
    }
}
