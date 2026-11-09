import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) {}

  // Public endpoint
  @Get()
  @ApiOperation({ summary: 'Get public portfolio profile' })
  getProfile() {
    return this.profileService.getProfile();
  }

  // Admin-only endpoint
  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create or update portfolio profile' })
  updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(updateProfileDto);
  }
}