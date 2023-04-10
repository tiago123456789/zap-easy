import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredential } from "src/security/auth-credential.entity";
import { Repository } from "typeorm";
import { RepositoryInterface } from "./repository.interface"

export class AuthCredentialRepository implements RepositoryInterface<AuthCredential> {
   
    constructor(
        @InjectRepository(AuthCredential) private repository: Repository<AuthCredential>,
    ) { }

    findByClientId(clientId: string): Promise<AuthCredential> {
        return this.repository.findOne({
            where: {
                clientId: clientId,
            }
        })
    }
   
    save(newRegister: AuthCredential): Promise<AuthCredential> {
        return this.repository.save(newRegister)
    }
   
    findByFields(fields: { [key: string]: any; }): Promise<AuthCredential[]> {
        return this.repository.find({
            where: fields
        })
    }

}