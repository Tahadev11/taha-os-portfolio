import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module.js';
import { AdminsModule } from './modules/admins/admins.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';
import { CertificatesModule } from './modules/certificates/certificates.module.js';
import { ExperienceModule } from './modules/experience/experience.module.js';
import { EducationModule } from './modules/education/education.module.js';
import { MessagesModule } from './modules/messages/messages.module.js';
import { ResumeModule } from './modules/resume/resume.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    AuthModule,
    AdminsModule,
    ProfileModule,
    ProjectsModule,
    SkillsModule,
    CertificatesModule,
    ExperienceModule,
    EducationModule,
    MessagesModule,
    ResumeModule,
    UploadsModule,
    AnalyticsModule,
    SettingsModule,
  ],
})
export class AppModule {}