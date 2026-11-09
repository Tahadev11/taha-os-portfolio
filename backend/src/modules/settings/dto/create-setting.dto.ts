
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  github?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  instagram?: string;
}

export class CreateSettingDto {
  @IsString()
  siteTitle: string;

  @IsOptional()
  @IsString()
  siteDescription?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  lightLogoUrl?: string;

  @IsOptional()
  @ValidateIf((_object, value) => value !== '')
  @IsUrl()
  faviconUrl?: string;

  @IsOptional()
  @IsIn(['dark', 'light', 'system'])
  theme?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  isWebsiteVisible?: boolean;
}
