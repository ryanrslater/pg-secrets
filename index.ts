import pg from 'pg'

import { SecretsManagerClient, GetSecretValueCommand, SecretsManagerClientConfig, GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager'

class PgSecrets {
    private readonly secretClient: SecretsManagerClient
    private readonly secretArn: string | undefined
    private readonly region: string | undefined
    private readonly accessKeyId: string | undefined
    private readonly secretAccessKey: string | undefined

    constructor() {
        if (!this.secretArn) throw new Error('Secret ARN not found')
        if (!this.region) throw new Error('Region not found')
        if (!this.accessKeyId) throw new Error('Access Key ID not found')
        if (!this.secretAccessKey) throw new Error('Secret Access Key not found')
        const config: SecretsManagerClientConfig = {
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
            region: this.region
        }
        this.secretClient = new SecretsManagerClient(config)
        this.secretArn = process.env.SECRET_ARN
    }

    private async getSecret(): Promise<pg.ClientConfig> {
        const config: GetSecretValueCommandInput = {
            SecretId: undefined
        }
        const res = await this.secretClient.send(new GetSecretValueCommand(config))
        if (!res.SecretString) throw new Error('Secret not found')
        const data = JSON.parse(res.SecretString) as pg.ClientConfig

        return data

    }
    async client(): Promise<pg.Client> {
        const data = await this.getSecret()
        const client = new pg.Client(data)
        await client.connect()
        return client
    }
}

export default PgSecrets