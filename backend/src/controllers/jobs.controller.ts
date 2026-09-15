import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateJobDto } from '../dto/create_job.dto.js';
import { UpdateJobStatusDto } from '../dto/update_job_status.dto.js';
import { JobStatus } from '../enums/job_status.enum.js';
import { JobsService } from '../services/jobs.service.js';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
  ) {}

  @Post()
  async createJob(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.createJob(createJobDto);
  }

  @Get()
  async getJobs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: JobStatus,
  ) {
    const parsedPage = page ? Number(page) : 1;
    const parsedLimit = limit ? Number(limit) : 10;

    return this.jobsService.getJobs(
      parsedPage,
      parsedLimit,
      status,
    );
  }

  @Patch(':id/status')
  async updateJobStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateJobStatusDto: UpdateJobStatusDto,
  ) {
    return this.jobsService.updateJobStatus(
      id,
      updateJobStatusDto,
    );
  }

  @Delete(':id')
  async deleteJob(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.jobsService.deleteJob(id);
  }
}