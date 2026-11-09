import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Profile,
  ProfileDocument,
} from './schemas/profile.schema.js';

import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
  ) {}

  // Get public profile
  async getProfile() {
    return this.profileModel.findOne().lean().exec();
  }

  // Create or update profile
  async updateProfile(updateProfileDto: UpdateProfileDto) {
    const existingProfile = await this.profileModel.findOne().exec();

    if (existingProfile) {
      Object.assign(existingProfile, updateProfileDto);

      return existingProfile.save();
    }

    // Required fields for the first profile creation
    const { fullName, professionalTitle, email } = updateProfileDto;

    if (!fullName || !professionalTitle || !email) {
      throw new BadRequestException(
        'fullName, professionalTitle and email are required to create the initial profile.',
      );
    }

    const newProfile = new this.profileModel(updateProfileDto);

    return newProfile.save();
  }
}