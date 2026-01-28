export type JwtPayload = {
    sub: string;
    roles: string[];
    permissions?: string[];
    iat?: number;
    exp?: number;
};
