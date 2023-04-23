import { ApiProperty } from "@nestjs/swagger";

export class CreatedWebhookDto {

    @ApiProperty({ 
        example: "http://localhost:3000/webhooks/4a0850e1-8965-4a24-a695-8adb5ad1fdd6?key=4a0850e1-8965-4a24-a695-8adb5ad1fdd6",
        description: "The webhook url you can use for send text message for What'sapp phone number"
    })
    url: string;

    @ApiProperty({ 
        example: "4a0850e1-8965-4a24-a695-8adb5ad1fdd6",
        description: "The id of register on database"
    })
    id: string;

    @ApiProperty({ 
        example: "4a0850e1-8965-4a24-a695-8adb5ad1fdd6",
        description: "The key is used to check if request made of one application for zap-easy api is valid"
    })
    @ApiProperty()
    key: string;
}