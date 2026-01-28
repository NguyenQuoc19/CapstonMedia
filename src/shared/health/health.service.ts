import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HealthResponse } from './interfaces/health-response.interface';

@Injectable()
export class HealthService {
    constructor(private readonly prisma: PrismaService) { }

    async getHealthStatus(): Promise<HealthResponse> {
        const result: HealthResponse = {
            status: 'ok',
            liveness: 'alive',
            readiness: 'ready',
            database: {
                status: 'connected',
            },
            timestamp: new Date().toISOString(),
        };

        await this.prisma.$queryRaw`SELECT 1`;
        const connections: any[] = await this.prisma.$queryRaw`SELECT CONNECTION_ID() as id`;
        result.database.connections = connections.length;

        return result;
    }
}
