import { SortOrder } from "@/generated/prisma/internal/prismaNamespace";

const prismaPaginate = async <TWhere>({
    page,
    model,
    limit,
    where,
    orderBy,
    include,
}: {
    model: {
        findMany: Function;
        count: Function;
    };
    page?: number;
    limit?: number;
    where?: TWhere;
    orderBy?: Record<string, SortOrder>;
    include?: any;
}) => {
    const { skip, page: currentPage, limit: take } =
        normalizePagination({ page, limit });

    const [data, total] = await Promise.all([
        model.findMany({
            where,
            orderBy,
            include,
            skip,
            take,
        }),
        model.count({ where }),
    ]);

    const { sortBy, sortOrder } = extractSortMeta(orderBy);

    return {
        data,
        meta: {
            page: currentPage,
            limit: take,
            total,
            totalPages: Math.ceil(total / take),

            sortBy,
            sortOrder,

            filters: where ?? null,
        },
    };
};

const normalizePagination = (pagination?: {
    page?: number;
    limit?: number;
}) => {
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.min(100, Math.max(1, pagination?.limit ?? 10));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

const extractSortMeta = (
    orderBy?: Record<string, SortOrder>,
) => {
    if (!orderBy) {
        return {
            sortBy: null,
            sortOrder: null,
        };
    }

    const [sortBy, sortOrder] = Object.entries(orderBy)[0] ?? [];

    return {
        sortBy: sortBy ?? null,
        sortOrder: sortOrder ?? null,
    };
};

type FilterOperator =
    | 'equal'
    | 'contains'
    | 'in'
    | 'range';

const buildWhere = <T extends Record<string, any>>(
    query: Record<string, any>,
    filters: Partial<Record<keyof T, FilterOperator>>,
): Partial<T> => {
    const where: Partial<Record<keyof T, any>> = {};

    for (const key in filters) {
        const operator = filters[key];
        if (!operator) continue;

        const value = query[key as string];
        if (value == null || value === '') continue;

        switch (operator) {
            case 'equal':
                where[key] = value;
                break;

            case 'contains':
                where[key] = { contains: value } as any;
                break;

            case 'in':
                where[key] = { in: Array.isArray(value) ? value : [value], } as any;
                break;

            case 'range':
                where[key] = {
                    ...(value?.from && { gte: value.from }),
                    ...(value?.to && { lte: value.to }),
                } as any;
                break;
        }
    }

    return where as Partial<T>;
};

export {
    buildWhere,
    prismaPaginate,
}
