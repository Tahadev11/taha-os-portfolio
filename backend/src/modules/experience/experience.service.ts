import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Experience,
  ExperienceDocument,
} from './schemas/experience.schema.js';

import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto) {
    const experience = new this.experienceModel(createExperienceDto);
    return experience.save();
  }

  async findAll() {
    return this.experienceModel
      .find()
      .sort({ sortOrder: 1, startDate: -1 })
      .exec();
  }

  async findVisible() {
    return this.experienceModel
      .find({ isVisible: true })
      .sort({ sortOrder: 1, startDate: -1 })
      .exec();
  }

  async findOne(id: string) {
    const experience = await this.experienceModel
      .findById(id)
      .exec();

    if (!experience) {
      throw new NotFoundException('Experience not found.');
    }

    return experience;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
  ) {
    const experience = await this.experienceModel
      .findById(id)
      .exec();

    if (!experience) {
      throw new NotFoundException('Experience not found.');
    }

    Object.assign(experience, updateExperienceDto);

    return experience.save();
  }

  async remove(id: string) {
    const experience = await this.experienceModel
      .findByIdAndDelete(id)
      .exec();

    if (!experience) {
      throw new NotFoundException('Experience not found.');
    }

    return {
      message: 'Experience deleted successfully.',
    };
  }
}