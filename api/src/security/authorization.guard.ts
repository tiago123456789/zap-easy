import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Provider } from "src/common/constants/provider";
import { AuthInterface } from "src/common/adapters/auth/auth.interface";

@Injectable()
export class AuthorizationGuard implements CanActivate {

    constructor(
        @Inject(Provider.AUTH) private jwtAuth: AuthInterface
    ) {
    }

     canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        let accessToken = request.headers.authorization || "";
        return this.jwtAuth.isValid(accessToken);
    }
}