import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'kemi',
    password: 'oluwakemi',
    database: 'greencoder',
    entities: [__dirname + '/**/*.entity.{ts,js}'],
    synchronize: true
};

export default config;