import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";
import { NotFoundException } from "./notfound.exception";
import { BusinessException } from "./business.exception";
import { ApiException } from "./api.exception";

@Catch(Error)
export class HandlerException implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof NotFoundException) {
            return response
                // @ts-ignore
                .status(exception.getCode())
                .json({
                    statusCode: exception.getCode(),
                    timestamp: new Date().toISOString(),
                    message: exception.message
                });
        } else if (exception instanceof BusinessException) {
            return response
                // @ts-ignore
                .status(exception.getCode())
                .json({
                    statusCode: exception.getCode(),
                    timestamp: new Date().toISOString(),
                    message: exception.message
                });
        } else if (exception instanceof ForbiddenException) {
            return response
                // @ts-ignore
                .status(exception.getStatus())
                .json({
                    statusCode: exception.getStatus(),
                    timestamp: new Date().toISOString(),
                    message: exception.message
                });
        } else {
            return response
                // @ts-ignore
                .status(500)
                .json({
                    statusCode: 500,
                    timestamp: new Date().toISOString(),
                    message: "Internal server error"
                });
        }

    }
}