
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Setting,
  SettingDocument,
} from './schemas/setting.schema.js';

import { CreateSettingDto } from './dto/create-setting.dto.js';
import { UpdateSettingDto } from './dto/update-setting.dto.js';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name)
    private readonly settingModel: Model<SettingDocument>,
  ) { }

  async create(createSettingDto: CreateSettingDto) {
    const existingSettings = await this.settingModel.findOne().exec();

    if (existingSettings) {
      return {
        message: 'Settings already exist. Use update instead.',
        settings: existingSettings,
      };
    }

    const settings = await this.settingModel.create(createSettingDto);

    return {
      message: 'Settings created successfully',
      settings,
    };
  }

  async getPublicSettings() {
    const settings = await this.settingModel
      .findOne()
      .select(
        'siteTitle siteDescription seoTitle seoDescription seoKeywords logoUrl faviconUrl theme socialLinks contactEmail contactPhone isWebsiteVisible maintenanceMode',
      )
      .select(
        'siteTitle siteDescription seoTitle seoDescription seoKeywords logoUrl lightLogoUrl faviconUrl theme socialLinks contactEmail contactPhone isWebsiteVisible maintenanceMode',
      )
      .lean()
      .exec();

    if (!settings) {
      throw new NotFoundException('Website settings not found');
    }

    return settings;
  }

  async getAdminSettings() {
    const settings = await this.settingModel.findOne().lean().exec();

    if (!settings) {
      throw new NotFoundException('Website settings not found');
    }

    return settings;
  }

  async update(updateSettingDto: UpdateSettingDto) {
    const settings = await this.settingModel.findOne().exec();

    if (!settings) {
      throw new NotFoundException(
        'Website settings not found. Create settings first.',
      );
    }

    settings.set(updateSettingDto);

    await settings.save();

    return {
      message: 'Settings updated successfully',
      settings,
    };
  }
}
