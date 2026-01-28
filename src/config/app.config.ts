import { registerAs } from "@nestjs/config";

export type NodeEnv = "development" | "production" | "test";

export interface ProjectConfig {
    port: number;
    nodeEnv: NodeEnv;
}

export default registerAs("project", () => {
    const port = Number(process.env.PORT ?? 3000);
    const nodeEnv = (process.env.NODE_ENV ?? "development") as NodeEnv;

    return {
        port,
        nodeEnv,
    } satisfies ProjectConfig;
});
