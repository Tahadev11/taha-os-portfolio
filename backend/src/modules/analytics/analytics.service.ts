
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project } from '../projects/schemas/project.schema.js';
import { Skill } from '../skills/schemas/skill.schema.js';
import { Certificate } from '../certificates/schemas/certificate.schema.js';
import { Experience } from '../experience/schemas/experience.schema.js';
import { Education } from '../education/schemas/education.schema.js';
import { Message } from '../messages/schemas/message.schema.js';
import { Resume } from '../resume/schemas/resume.schema.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,

    @InjectModel(Skill.name)
    private readonly skillModel: Model<Skill>,

    @InjectModel(Certificate.name)
    private readonly certificateModel: Model<Certificate>,

    @InjectModel(Experience.name)
    private readonly experienceModel: Model<Experience>,

    @InjectModel(Education.name)
    private readonly educationModel: Model<Education>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Resume.name)
    private readonly resumeModel: Model<Resume>,
  ) {}

  async getOverview() {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      totalSkills,
      visibleSkills,
      totalCertificates,
      visibleCertificates,
      totalExperience,
      visibleExperience,
      totalEducation,
      visibleEducation,
      totalMessages,
      unreadMessages,
      activeResumes,
      recentMessages,
    ] = await Promise.all([
      this.projectModel.countDocuments().exec(),
      this.projectModel.countDocuments({ status: 'published' }).exec(),
      this.projectModel.countDocuments({ status: 'draft' }).exec(),

      this.skillModel.countDocuments().exec(),
      this.skillModel.countDocuments({ isVisible: true }).exec(),

      this.certificateModel.countDocuments().exec(),
      this.certificateModel.countDocuments({ isVisible: true }).exec(),

      this.experienceModel.countDocuments().exec(),
      this.experienceModel.countDocuments({ isVisible: true }).exec(),

      this.educationModel.countDocuments().exec(),
      this.educationModel.countDocuments({ isVisible: true }).exec(),

      this.messageModel.countDocuments().exec(),
      this.messageModel.countDocuments({ status: 'unread' }).exec(),

      this.resumeModel.countDocuments({ isActive: true }).exec(),

      this.messageModel
        .find()
        .select('name email subject status createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .exec(),
    ]);

    return {
      message: 'Analytics overview retrieved successfully',

      overview: {
        projects: {
          total: totalProjects,
          published: publishedProjects,
          draft: draftProjects,
        },

        skills: {
          total: totalSkills,
          visible: visibleSkills,
        },

        certificates: {
          total: totalCertificates,
          visible: visibleCertificates,
        },

        experience: {
          total: totalExperience,
          visible: visibleExperience,
        },

        education: {
          total: totalEducation,
          visible: visibleEducation,
        },

        messages: {
          total: totalMessages,
          unread: unreadMessages,
        },

        resume: {
          active: activeResumes,
        },
      },

      recentMessages,
    };
  }
}
