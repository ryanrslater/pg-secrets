import pg from 'pg'

import { SecretsManagerClient, GetSecretValueCommand, SecretsManagerClientConfig} from '@aws-sdk/client-secrets-manager'

class PgSecrets {
    private readonly client: SecretsManagerClient
    private readonly secretArn: string | undefined
    private readonly region: string | undefined
    private readonly accessKeyId: string | undefined
    private readonly secretAccessKey: string | undefined

    constructor() {
        const config: SecretsManagerClientConfig = {
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey
            }
        }
        this.client = new SecretsManagerClient({
            region: this.region,

        })
        this.secretArn = process.env.SECRET_ARN
    }

    private async getSecret(secretId: string) {

        const { SecretString } = await this.client.send(new GetSecretValueCommand({ SecretId: secretId }))
    }
}
export default PgSecrets