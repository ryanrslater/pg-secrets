import pg from 'pg'

import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

class PgSecrets {
    private readonly client: SecretsManagerClient
    private readonly secretArn: string | undefined

    constructor() {
        this.client = new SecretsManagerClient({})
        this.secretArn = process.env.SECRET_ARN
    }

    private async getSecret(secretId: string) {
        
        const { SecretString } = await this.client.getSecretValue({
            Secret
        })
    }
}
export default PgSecrets