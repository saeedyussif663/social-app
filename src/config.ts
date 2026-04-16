import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DATABASE_USER as string,
  password: process.env.DATABASE_PASSWORD as string,
  database: process.env.DATABASE_NAME as string,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
});
