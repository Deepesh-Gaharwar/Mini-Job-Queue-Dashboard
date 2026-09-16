import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Job } from './entities/job.entity.js';
import { JobsModule } from './jobs.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',

        url: configService.getOrThrow<string>(
          'DATABASE_URL',
        ),

        entities: [Job],

        synchronize:
          configService.get<string>('NODE_ENV') !==
          'production',
      }),
    }),

    JobsModule,
  ],
})
export class AppModule {}