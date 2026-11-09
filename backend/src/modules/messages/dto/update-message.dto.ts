import { IsIn } from 'class-validator';

export class UpdateMessageDto {
  @IsIn(['read', 'unread'])
  status: string;
}