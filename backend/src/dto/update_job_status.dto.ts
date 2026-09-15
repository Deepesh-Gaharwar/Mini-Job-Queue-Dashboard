import { IsEnum } from 'class-validator';

import { JobStatus } from "../enums/job_status.enum.js";

export class UpdateJobStatusDto {
  @IsEnum(JobStatus)
  status!: JobStatus;
}