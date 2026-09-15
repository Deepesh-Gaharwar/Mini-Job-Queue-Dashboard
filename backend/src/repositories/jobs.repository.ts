import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from "../entities/job.entity.js"
import { JobStatus } from "../enums/job_status.enum.js";

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async create(title: string, type: string): Promise<Job> {
    const job = this.jobRepository.create({
      title,
      type,
      status: JobStatus.PENDING,
    });

    return this.jobRepository.save(job);
  }

  async findAll(
    skip: number,
    take: number,
    status?: JobStatus,
  ): Promise<[Job[], number]> {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .orderBy('job.createdAt', 'DESC')
      .skip(skip)
      .take(take);

    if (status) {
      query.andWhere('job.status = :status', { status });
    }

    return query.getManyAndCount();
  }

  async findById(id: string): Promise<Job | null> {
    return this.jobRepository.findOne({
      where: { id },
    });
  }

  async updateStatus(
    id: string,
    currentStatus: JobStatus,
    newStatus: JobStatus,
  ): Promise<boolean> {
    const result = await this.jobRepository
      .createQueryBuilder()
      .update(Job)
      .set({
        status: newStatus,
      })
      .where('id = :id', { id })
      .andWhere('status = :currentStatus', { currentStatus })
      .execute();

    return result.affected === 1;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.jobRepository.delete(id);

    return result.affected === 1;
  }

  async getStatusCounts(): Promise<Record<JobStatus, number>> {
    const results = await this.jobRepository
        .createQueryBuilder('job')
        .select('job.status', 'status')
        .addSelect('COUNT(job.id)', 'count')
        .groupBy('job.status')
        .getRawMany();

    const counts: Record<JobStatus, number> = {
        [JobStatus.PENDING]: 0,
        [JobStatus.RUNNING]: 0,
        [JobStatus.COMPLETED]: 0,
        [JobStatus.FAILED]: 0,
    };

    for (const result of results) {
        counts[result.status as JobStatus] = Number(result.count);
    }

   return counts;
 }
}