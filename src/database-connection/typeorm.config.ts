import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from "config";

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    url: process.env.RDS_URL || dbConfig.url,
    entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
    ],
    synchronize: dbConfig.synchronize,
    useUnifiedTopology: true
}