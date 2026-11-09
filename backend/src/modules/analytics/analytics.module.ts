
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AnalyticsController } from './analytics.controller.js';
import { AnalyticsService } from './analytics.service.js';

import {
  Project,
  ProjectSchema,
} from '../projects/schemas/project.schema.js';

import {
  Skill,
  SkillSchema,
} from '../skills/schemas/skill.schema.js';

import {
  Certificate,
  CertificateSchema,
} from '../certificates/schemas/certificate.schema.js';

import {
  Experience,
  ExperienceSchema,
} from '../experience/schemas/experience.schema.js';

import {
  Education,
  EducationSchema,
} from '../education/schemas/education.schema.js';

import {
  Message,
  MessageSchema,
} from '../messages/schemas/message.schema.js';

import {
  Resume,
  ResumeSchema,
} from '../resume/schemas/resume.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: Certificate.name, schema: CertificateSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Education.name, schema: EducationSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Resume.name, schema: ResumeSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
