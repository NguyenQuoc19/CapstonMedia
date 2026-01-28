export const PrismaErrorMessageMap: Record<string, string> = {
    // ===== Data / Query errors =====
    P2000: 'Value is too long for the field',
    P2001: 'Record not found',
    P2002: 'Duplicate value',
    P2003: 'Related record not found',
    P2004: 'Database constraint failed',
    P2010: 'Unknown column',
    P2014: 'Invalid relation',
    P2016: 'Invalid query',
    P2019: 'Invalid input data',
    P2025: 'Record not found',

    // ===== Connection / System errors =====
    P1000: 'Database authentication failed',
    P1001: 'Database connection failed',
    P1002: 'Database connection timeout',
    P1003: 'Database not found',
    P1008: 'Database query timeout',
    P1017: 'Database connection closed',
};
