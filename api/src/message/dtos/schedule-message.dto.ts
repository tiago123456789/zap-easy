import { IsDate, IsDateString, IsNotEmpty, Length } from 'class-validator';

export class ScheduleMessageDto {

    @IsNotEmpty()
    to: string;

    @IsNotEmpty()
    text: string;

    instanceId?: string;

    @IsDateString()
    scheduledAt: Date;
}