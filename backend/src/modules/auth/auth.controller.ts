import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login as portfolio administrator' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

@Get('me')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
@ApiOperation({ summary: 'Get currently authenticated administrator' })
getMe(
  @CurrentAdmin()
  admin: {
    id: string;
    email: string;
    role: string;
  },
) {
  return {
    message: 'Authenticated administrator',
    admin,
  };
}
}