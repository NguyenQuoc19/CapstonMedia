import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );

        if (!required) return true;

        const user = ctx.switchToHttp().getRequest().user;

        const has = required.every(p =>
            user.permissions?.includes(p),
        );

        if (!has) throw new ForbiddenException('You are not allowed to access this resource');

        return true;
    }
}
