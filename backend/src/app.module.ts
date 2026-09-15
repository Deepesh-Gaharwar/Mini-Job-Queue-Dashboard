import { Module } from '@nestjs/common';

import { JobsModule } from "./jobs.module.js";

@Module({
  imports: [JobsModule],
})
export class AppModule {}