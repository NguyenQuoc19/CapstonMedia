export type HealthStatus = 'ok' | 'error';

export type LivenessStatus = 'alive' | 'dead';

export type ReadinessStatus = 'ready' | 'not-ready';

export type DatabaseStatus = 'connected' | 'disconnected';

export interface DatabaseHealth {
    error?: string;
    status: DatabaseStatus;
    connections?: number;
}

export interface HealthResponse {
    status: HealthStatus;
    database: DatabaseHealth;
    liveness: LivenessStatus;
    readiness: ReadinessStatus;
    timestamp: string;
}


