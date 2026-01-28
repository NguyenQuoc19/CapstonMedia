import { HealthService } from './health.service';
import { HealthResponse } from './interfaces/health-response.interface';
import { Controller, Get } from '@nestjs/common';
import { ApiResponse, successResponse } from '../response';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get()
  async getHealthStatus(): Promise<ApiResponse<HealthResponse>> {
    const health = await this.healthService.getHealthStatus();
    return successResponse(health, 'Get health status successfully');
  }
}