import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty, Length } from 'class-validator';

export class ScheduleMessageDto {

    @ApiProperty({
        example: "551112341234",
        description: "The what'sapp phone number of person you need send text message. Example of phone number: 5562911112222 of structure of phone number is country code + DDD + phone number"
    })
    @IsNotEmpty()
    to: string;

    @ApiProperty({
        example: "message to send",
    })
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        example: "instance id here",
        description: "The instance id to notify schedule message to specific instance."
    })
    instanceId?: string;

    @ApiProperty({
        example: "message to send",
        description: "Date to notify schedule message. For example: 2023-05-05 19:00:00"
    })
    @IsDateString()
    scheduledAt: Date;
}