import { ApiProperty } from '@nestjs/swagger';
import { NotificationType, NotificationSeverity } from '../notification.entity';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: NotificationSeverity })
  severity: NotificationSeverity;

  @ApiProperty({ required: false })
  metadata?: Record<string, unknown>;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;
}