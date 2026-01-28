import { convertData } from "./prisma.convert";
import { PrismaClient } from "@/generated/prisma/client";
import { ConfigService } from "@nestjs/config";
import { prismaClientFactory } from "./prisma.factory";
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(public config: ConfigService) {
        super(prismaClientFactory(config));

        return this.$extends({
            query: {
                $allModels: {
                    async $allOperations({ args, query }) {
                        const result = await query(args);
                        return convertData(result);
                    },
                },
            },
        }) as PrismaService;
    }

    async onModuleInit() {
        try {
            await this.$connect();
            await this.$queryRaw`SELECT 1`;
            console.log("✅ Database connected");
        } catch (err) {
            console.error("❌ Database connection failed", err);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            console.log("❎ Database Disconect Successfully.");
        } catch (err) {
            console.error("❌ Database connection failed", err);
            process.exit(1);
        }

    }
}
