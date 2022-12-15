import pg from 'pg'

import { SecretsManagerClient, GetSecretValueCommand, SecretsManagerClientConfig, GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager'

type SecretResponse = {
    username: string
    password: string
    host: string
    port: number
    database: string
}

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

    private async getSecret(): Promise<SecretResponse> {
        const config: GetSecretValueCommandInput = {
            SecretId: undefined
        }
        const res = await this.secretClient.send(new GetSecretValueCommand(config))
        if (!res.SecretString) throw new Error('Secret not found')
        const data = JSON.parse(res.SecretString) as SecretResponse

        return data

    }
    async client(): Promise<pg.Client> {
 
        const data = await this.getSecret()

        const clientCongig: pg.ClientConfig = {
            user: data.username,
            password: data.password,
            host: data.host,
            port: data.port,
            database: data.database
        }
        const client = new pg.Client(clientCongig)
        return client
    }
    async pool(): Promise<pg.Pool> {
        const data = await this.getSecret()

        const poolConfig: pg.PoolConfig = {
            user: data.username,
            password: data.password,
            host: data.host,
            port: data.port,
            database: data.database
        }

        const pool = new pg.Pool(poolConfig)
        return pool
    }
}

export default PgSecrets