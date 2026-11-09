import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SkillsService } from './skills.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpdateSkillDto } from './dto/update-skill.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(
    private readonly skillsService: SkillsService,
  ) {}

  // Public: Get visible skills
  @Get('public')
  @ApiOperation({ summary: 'Get all visible portfolio skills' })
  findVisible() {
    return this.skillsService.findVisible();
  }

  // Admin: Get all skills
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all skills (admin only)' })
  findAll() {
    return this.skillsService.findAll();
  }

  // Admin: Get skill by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get skill by ID (admin only)' })
  @ApiParam({ name: 'id' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  // Admin: Create skill
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a skill (admin only)' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  // Admin: Update skill
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill (admin only)' })
  @ApiParam({ name: 'id' })
  update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    return this.skillsService.update(id, updateSkillDto);
  }

  // Admin: Delete skill
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill (admin only)' })
  @ApiParam({ name: 'id' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}