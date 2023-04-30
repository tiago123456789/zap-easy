import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { MessageDto } from "./message.dto";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class TextMessageBatchDto {

    @ApiProperty({
        isArray: true,
        type: () => MessageDto
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    @Type(() => MessageDto)
    messages: MessageDto[]
}