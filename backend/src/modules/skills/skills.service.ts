import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Skill,
  SkillDocument,
} from './schemas/skill.schema.js';

import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skill.name)
    private readonly skillModel: Model<SkillDocument>,
  ) {}

  // Create skill
  async create(createSkillDto: CreateSkillDto) {
    const existingSkill = await this.skillModel.findOne({
      name: createSkillDto.name,
    }).exec();

    if (existingSkill) {
      throw new ConflictException('This skill already exists.');
    }

    const skill = new this.skillModel(createSkillDto);

    return skill.save();
  }

  // Get all skills (admin)
  async findAll() {
    return this.skillModel
      .find()
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  // Get visible skills (public)
  async findVisible() {
    return this.skillModel
      .find({ isVisible: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
  }

  // Get skill by ID
  async findOne(id: string) {
    const skill = await this.skillModel.findById(id).exec();

    if (!skill) {
      throw new NotFoundException('Skill not found.');
    }

    return skill;
  }

  // Update skill
  async update(id: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillModel.findById(id).exec();

    if (!skill) {
      throw new NotFoundException('Skill not found.');
    }

    if (updateSkillDto.name) {
      const existingSkill = await this.skillModel.findOne({
        name: updateSkillDto.name,
        _id: { $ne: id },
      }).exec();

      if (existingSkill) {
        throw new ConflictException('This skill already exists.');
      }
    }

    Object.assign(skill, updateSkillDto);

    return skill.save();
  }

  // Delete skill
  async remove(id: string) {
    const skill = await this.skillModel
      .findByIdAndDelete(id)
      .exec();

    if (!skill) {
      throw new NotFoundException('Skill not found.');
    }

    return {
      message: 'Skill deleted successfully.',
    };
  }
}