import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, ForbiddenException } from "@nestjs/common";
import { NotFoundException } from "./notfound.exception";
import { BusinessException } from "./business.exception";
import { ApiException } from "./api.exception";
import { InvalidDataException } from "./invalid-data.exception";
import { ResponseExceptionDto } from "./response-exception.dto";

@Catch(Error)
export class HandlerException implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof ApiException) {
            return response
                // @ts-ignore
                .status(exception.getCode())
                .json(
                    new ResponseExceptionDto(
                        exception.getCode(),
                        new Date().toISOString(),
                        exception.message
                    ).get()
                );
        } else if (exception instanceof InvalidDataException) {
            return response
                // @ts-ignore
                .status(exception.getCode())
                .json(
                    new ResponseExceptionDto(
                        exception.getCode(),
                        new Date().toISOString(),
                        exception.message
                    ).get()
                );
        } else if (exception instanceof BusinessException) {
            return response
                // @ts-ignore
                .status(exception.getCode())
                .json(
                    new ResponseExceptionDto(
                        exception.getCode(),
                        new Date().toISOString(),
                        exception.message
                    ).get()
                );
        } else if (exception instanceof ForbiddenException) {
            return response
                // @ts-ignore
                .status(exception.getStatus())
                .json(
                    new ResponseExceptionDto(
                        exception.getStatus(),
                        new Date().toISOString(),
                        exception.message
                    ).get()
                );
        } else if (exception instanceof BadRequestException) {
            const validationError: { [key: string]: any } = exception.getResponse() as object
            return response
                // @ts-ignore
                .status(exception.getStatus())
                .json({
                    error: validationError.message,
                    ...new ResponseExceptionDto(
                        exception.getStatus(),
                        new Date().toISOString(),
                        exception.message
                    ).get()
                });
        } else {
            return response
                // @ts-ignore
                .status(500)
                .json(
                    new ResponseExceptionDto(
                        500,
                        new Date().toISOString(),
                        "Internal server error"
                    ).get()
                );
        }

    }
}