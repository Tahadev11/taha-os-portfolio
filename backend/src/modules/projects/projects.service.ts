import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Project,
  ProjectDocument,
} from './schemas/project.schema.js';

import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  // Create project
  async create(createProjectDto: CreateProjectDto) {
    const existingProject = await this.projectModel
      .findOne({ slug: createProjectDto.slug })
      .exec();

    if (existingProject) {
      throw new ConflictException('A project with this slug already exists.');
    }

    const project = new this.projectModel(createProjectDto);

    return project.save();
  }

  // Get all projects (admin)
  async findAll() {
    return this.projectModel
      .find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  // Get published projects (public)
  async findPublished() {
    return this.projectModel
      .find({ status: 'published' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .exec();
  }

  // Get single project by slug (public)
  async findBySlug(slug: string) {
    const project = await this.projectModel
      .findOne({
        slug,
        status: 'published',
      })
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return project;
  }

  // Update project
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel
      .findById(id)
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (updateProjectDto.slug && updateProjectDto.slug !== project.slug) {
      const existingProject = await this.projectModel
        .findOne({ slug: updateProjectDto.slug })
        .exec();

      if (existingProject) {
        throw new ConflictException('This project slug is already in use.');
      }
    }

    Object.assign(project, updateProjectDto);

    return project.save();
  }

  // Delete project
  async remove(id: string) {
    const project = await this.projectModel
      .findByIdAndDelete(id)
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    return {
      message: 'Project deleted successfully.',
    };
  }
}