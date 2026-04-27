import {
  Controller,
  Get,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { NotificationResponseDto } from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user notifications',
    description: 'Retrieves all notifications for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: [NotificationResponseDto],
  })
  async getNotifications(@Request() req: { user: { id: string } }): Promise<NotificationResponseDto[]> {
    const userId = req.user.id;
    const notifications = await this.notificationService.findForUser(userId);
    return notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      severity: notification.severity,
      metadata: notification.metadata,
      read: notification.read,
      createdAt: notification.createdAt,
    }));
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark notification as read',
    description: 'Marks a specific notification as read for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read successfully',
  })
  async markAsRead(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ): Promise<void> {
    const userId = req.user.id;
    await this.notificationService.markAsRead(id, userId);
  }
}