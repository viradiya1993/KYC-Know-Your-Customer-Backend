import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config as setConfig } from 'dotenv';
 
const check =`.${process.env.NODE_ENV}.env`

setConfig();
setConfig({ path: check.replace(/\s+/g, "") }); // use this if you use another .env file. Take the two setConfig if you use .env + other.env

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getMamcachedURL() {
    return this.getValue('MAMCACHED_SERVER_URL', true);
  }

  public getMamcachedPort() {
    return this.getValue('MAMCACHED_SERVER_PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['**/*.entity{.ts,.js}'],
      // logging: ["query", "error"],
      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE',
    'AWS_BUCKET_NAME',
    'AWS_REGION',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'BULKVERIFICATION_FOLDER_NAME',
    'INVOCATION_FOLDER_NAME',
    'REDIS_HOST',
    'REDIS_PORT',
    'AUTH_BASE_URL',
    'WALLET_BASE_URL'
  ]);
export { configService };