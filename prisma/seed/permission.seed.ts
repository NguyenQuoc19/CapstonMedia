import { PERMISSION } from "@/shared/roles/constants/permission.constants";
import { PrismaClient } from "@/generated/prisma/client";

export async function seedPermission(prisma: PrismaClient) {
    console.log("→ Seeding permission");

    await prisma.permission.createMany({
        data: Object.values(PERMISSION).map((key) => ({ key, name: PERMISSION[key] })),
        skipDuplicates: true,
    });

}
