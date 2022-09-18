import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthorizationGuard implements CanActivate {

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        let accessToken = request.headers.authorization || "";
        accessToken = accessToken.replace("Bearer ", "")

        if (!accessToken) {
            return false;
        }

        try {
            jwt.verify(accessToken, process.env.JWT_SECRET)
            return true
        } catch (error) {
            return false;
        }
    }
}