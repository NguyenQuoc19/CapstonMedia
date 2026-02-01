export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface QueryOptions<TWhere, TOrderBy, TInclude> {
    where?: TWhere;
    orderBy?: TOrderBy;
    include?: TInclude;
    pagination?: PaginationParams;
}