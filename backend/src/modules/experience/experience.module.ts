import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExperienceController } from './experience.controller.js';
import { ExperienceService } from './experience.service.js';

import {
  Experience,
  ExperienceSchema,
} from './schemas/experience.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Experience.name,
        schema: ExperienceSchema,
      },
    ]),
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}