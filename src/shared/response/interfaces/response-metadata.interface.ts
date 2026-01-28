export interface ResponseMetadata {
    page: number;
    limit: number;
    total: number;
    orderBy?: string;
    sortType?: 'asc' | 'desc';
}