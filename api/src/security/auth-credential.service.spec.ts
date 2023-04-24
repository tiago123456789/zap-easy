import { RepositoryInterface } from "./adapters/repositories/repository.interface"
import { AuthCredentialService } from "./auth-credential.service"
import { AuthInterface } from "../common/adapters/auth/auth.interface"
import { TypeAuthCredential } from "../common/types/type-auth-credential"
import { AuthCredential } from "./auth-credential.entity"

describe("AuthCredentialService", () => {
    const fakeClientId = '332bdfc1-605c-4bba-ac76-412f707071ac'
    const fakeDomain = "localhost"
    const authCredential = new AuthCredential()
    authCredential.clientId = fakeClientId;
    authCredential.domain = fakeDomain;
    authCredential.type = TypeAuthCredential.CLIENT_WEBSOCKET;

    let repository: jest.Mocked<RepositoryInterface<AuthCredential>> = {
        findByClientId: jest.fn(),
        save: jest.fn(),
        findByFields: jest.fn(),
    }
    let jwtAuth: jest.Mocked<AuthInterface> = {
        isValid: jest.fn(),
        generateCredentials: jest.fn()
    }

    beforeEach(() => {
        repository = {
            findByClientId: jest.fn(),
            save: jest.fn(),
            findByFields: jest.fn(),
        }
        jwtAuth = {
            isValid: jest.fn(),
            generateCredentials: jest.fn()
        }
    })

    it(
        "Should be throw exception when authenticate client websocket client id is invalid",
        async () => {
            try {
                const authCredentialService = new AuthCredentialService(
                    repository, jwtAuth
                )

                repository.findByClientId.mockResolvedValue(null)
                await authCredentialService.authenticateClientWebsocket(fakeClientId, fakeDomain)
            } catch (error) {
                expect(error.message).toBe("Credential invalid.")
            }

        })


    it(
        "Should be throw exception when authenticate client websocket client id is valid, but domain is different",
        async () => {
            try {
                const authCredentialService = new AuthCredentialService(
                    repository, jwtAuth
                )

                repository.findByClientId.mockResolvedValue(authCredential)
                await authCredentialService.authenticateClientWebsocket(fakeClientId, `${fakeDomain}a`)
            } catch (error) {
                expect(error.message).toBe("Credential invalid.")
            }

        })



    it(
        "Should be authenticate client websocket success",
        async () => {
            const authCredentialService = new AuthCredentialService(
                repository, jwtAuth
            )

            repository.findByClientId.mockResolvedValue(authCredential)
            await authCredentialService.authenticateClientWebsocket(fakeClientId, fakeDomain)
        })


    it(
        "Should be throw exception when try create auth credential and type is invalid",
        async () => {
            try {
                const authCredentialService = new AuthCredentialService(
                    repository, jwtAuth
                )

                await authCredentialService.create({ type: "Test" })
            } catch (error) {
                expect(error.message).toBe("Type is invalid. Type valid are: client websocket, api and websocket")
            }

        })

    it(
        "Should be create auth credential success",
        async () => {
            const authCredentialService = new AuthCredentialService(
                repository, jwtAuth
            )

            const authCredential = new AuthCredential();
            authCredential.clientId = fakeClientId;
            authCredential.clientSecret = fakeClientId;
            authCredential.id = fakeClientId;
            authCredential.type = TypeAuthCredential.API

            repository.save.mockResolvedValue(authCredential)
            const authCredentialSaved = await authCredentialService.create({ type: TypeAuthCredential.API })
            expect(repository.save).toHaveBeenCalled();
            expect(authCredentialSaved.clientId).toBe(fakeClientId)
            expect(authCredentialSaved.clientSecret).toBe(fakeClientId)
            expect(authCredentialSaved.type).toBe(TypeAuthCredential.API)
        })


    it(
        "Should be throw exception when try auth and credential is invalid",
        async () => {
            try {
                const authCredentialService = new AuthCredentialService(
                    repository, jwtAuth
                )

                repository.findByFields.mockResolvedValue([])
                await authCredentialService.authenticate({
                    clientId: fakeClientId, clientSecret: fakeClientId
                })
            } catch (error) {
                expect(error.message).toBe("Credentials invalid!")
            }

        })

        it(
            "Should be throw exception when try auth with credential valid",
            async () => {
                    const authCredentialService = new AuthCredentialService(
                        repository, jwtAuth
                    )
    
                    repository.findByFields.mockResolvedValue([
                        authCredential
                    ])
                    await authCredentialService.authenticate({
                        clientId: fakeClientId, clientSecret: fakeClientId
                    })
                    expect(jwtAuth.generateCredentials).toBeCalled();
            })
})