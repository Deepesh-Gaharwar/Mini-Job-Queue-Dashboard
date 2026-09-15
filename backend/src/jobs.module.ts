import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobsController } from './controllers/jobs.controller.js';
import { Job } from './entities/job.entity.js';
import { JobsRepository } from './repositories/jobs.repository.js';
import { JobsService } from './services/jobs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
})
export class JobsModule {}