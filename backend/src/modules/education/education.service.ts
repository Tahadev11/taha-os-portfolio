import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Education,
  EducationDocument,
} from './schemas/education.schema.js';

import { CreateEducationDto } from './dto/create-education.dto.js';
import { UpdateEducationDto } from './dto/update-education.dto.js';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education.name)
    private readonly educationModel: Model<EducationDocument>,
  ) {}

  async create(createEducationDto: CreateEducationDto) {
    const education = new this.educationModel(createEducationDto);
    return education.save();
  }

  async findAll() {
    return this.educationModel
      .find()
      .sort({ sortOrder: 1, startDate: -1 })
      .exec();
  }

  async findVisible() {
    return this.educationModel
      .find({ isVisible: true })
      .sort({ sortOrder: 1, startDate: -1 })
      .exec();
  }

  async findOne(id: string) {
    const education = await this.educationModel
      .findById(id)
      .exec();

    if (!education) {
      throw new NotFoundException('Education record not found.');
    }

    return education;
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ) {
    const education = await this.educationModel
      .findById(id)
      .exec();

    if (!education) {
      throw new NotFoundException('Education record not found.');
    }

    Object.assign(education, updateEducationDto);

    return education.save();
  }

  async remove(id: string) {
    const education = await this.educationModel
      .findByIdAndDelete(id)
      .exec();

    if (!education) {
      throw new NotFoundException('Education record not found.');
    }

    return {
      message: 'Education record deleted successfully.',
    };
  }
}