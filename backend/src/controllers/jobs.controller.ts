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

import { GetJobsDto } from '../dto/get_jobs.dto.js';
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
  async getJobs(@Query() query: GetJobsDto) {
    return this.jobsService.getJobs(
      query.page,
      query.limit,
      query.status,
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