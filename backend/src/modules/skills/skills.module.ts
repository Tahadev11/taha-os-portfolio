import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SkillsController } from './skills.controller.js';
import { SkillsService } from './skills.service.js';

import {
  Skill,
  SkillSchema,
} from './schemas/skill.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Skill.name,
        schema: SkillSchema,
      },
    ]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}