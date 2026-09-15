import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateJobDto } from '../dto/create_job.dto.js';
import { GetJobsDto } from '../dto/get_jobs.dto.js';
import { UpdateJobStatusDto } from '../dto/update_job_status.dto.js';
import { JobStatus } from '../enums/job_status.enum.js';
import { JobsRepository } from '../repositories/jobs.repository.js';

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
  ) {}

  async createJob(createJobDto: CreateJobDto) {
    const { title, type } = createJobDto;

    const job = await this.jobsRepository.create(title, type);

    return {
      message: 'Job created successfully',
      data: job,
    };
  }

  async getJobs(getJobsDto: GetJobsDto) {
    const {
      page = 1,
      limit = 10,
      status,
    } = getJobsDto;

    const skip = (page - 1) * limit;

    const [jobs, total] = await this.jobsRepository.findAll(
      skip,
      limit,
      status,
    );

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateJobStatus(
    id: string,
    updateJobStatusDto: UpdateJobStatusDto,
  ) {
    const { status: newStatus } = updateJobStatusDto;

    const job = await this.jobsRepository.findById(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (!this.isValidTransition(job.status, newStatus)) {
      throw new ConflictException(
        `Invalid status transition from ${job.status} to ${newStatus}`,
      );
    }

    const updated = await this.jobsRepository.updateStatus(
      id,
      job.status,
      newStatus,
    );

    if (!updated) {
      throw new ConflictException(
        'Job status was changed by another request. Please refresh and try again.',
      );
    }

    const updatedJob = await this.jobsRepository.findById(id);

    return {
      message: 'Job status updated successfully',
      data: updatedJob,
    };
  }

  async deleteJob(id: string) {
    const deleted = await this.jobsRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'Job deleted successfully',
    };
  }

  private isValidTransition(
    currentStatus: JobStatus,
    newStatus: JobStatus,
  ): boolean {
    const allowedTransitions: Record<JobStatus, JobStatus[]> = {
      [JobStatus.PENDING]: [
        JobStatus.RUNNING,
        JobStatus.FAILED,
      ],

      [JobStatus.RUNNING]: [
        JobStatus.COMPLETED,
        JobStatus.FAILED,
      ],

      [JobStatus.COMPLETED]: [],

      [JobStatus.FAILED]: [],
    };

    return allowedTransitions[currentStatus].includes(newStatus);
  }
}