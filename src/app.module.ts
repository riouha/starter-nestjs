import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    // envFilePath: join(__dirname,'.env')
  }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>{       
      return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          logging: ["error","info"],
          entities:["dist/**/*.entity{.ts,.js}"],
          ssl:true,
          // autoLoadEntities: configService.get<boolean>('database.autoLoadEntities'),
          // synchronize: false, //configService.get<boolean>('database.synchronize'),
          // dropSchema: configService.get<boolean>('database.dropSchema'),
        } as PostgresConnectionOptions
      },
        
      inject: [ConfigService],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
