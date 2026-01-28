import { ROLE } from "@/shared/roles/constants/role.constants";
import { PERMISSION } from "@/shared/roles/constants/permission.constants";
import { PrismaClient } from "@/generated/prisma/client";
import { ROLE_PERMISSIONS } from "@/shared/roles/constants/role-permission.constant";

export async function seedPermissionAndRolePermission(prisma: PrismaClient) {
    console.log("→ Seeding permissions");

    // 1. Seed permission
    await prisma.permission.createMany({
        data: Object.values(PERMISSION).map((key) => ({ key })),
        skipDuplicates: true,
    });

    // 2. Lấy permission đã có
    const permissions = await prisma.permission.findMany({
        select: { id: true, key: true },
    });

    const permissionMap = new Map(
        permissions.map((p) => [p.key, p.id])
    );

    // 3. Lấy role
    const roles = await prisma.role.findMany({
        where: { code: { in: Object.values(ROLE) } },
        select: { id: true, code: true },
    });

    console.log("→ Seeding role_permission");

    // 4. Seed role_permission
    const rolePermissionsData = roles.flatMap((role) => {
        const permissionKeys = ROLE_PERMISSIONS[role.code] ?? [];

        return permissionKeys
            .map((key) => permissionMap.get(key))
            .filter(Boolean)
            .map((permissionId) => ({
                role_id: Number(role.id),
                permission_id: permissionId!,
            }));
    });

    await prisma.rolePermission.createMany({
        data: rolePermissionsData,
        skipDuplicates: true,
    });

    console.log("✓ role_permission seeded");
}