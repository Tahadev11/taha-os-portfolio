import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { createTransport } from 'nodemailer';

import {
  Message,
  MessageDocument,
} from './schemas/message.schema.js';

import { CreateMessageDto } from './dto/create-message.dto.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { ReplyMessageDto } from './dto/reply-message.dto.js';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,

    private readonly configService: ConfigService,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const message = new this.messageModel(createMessageDto);
    return message.save();
  }

  async findAll() {
    return this.messageModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const message = await this.messageModel
      .findById(id)
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    // Automatically mark unread messages as read when opened.
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    return message;
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messageModel
      .findById(id)
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    Object.assign(message, updateMessageDto);

    return message.save();
  }

  async reply(
    id: string,
    replyMessageDto: ReplyMessageDto,
  ) {
    const message = await this.messageModel
      .findById(id)
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(
      this.configService.get<string>('SMTP_PORT') || 465,
    );
    const secure =
      this.configService.get<string>('SMTP_SECURE') === 'true';

    const emailUser =
      this.configService.get<string>('SMTP_USER');

    const emailPassword =
      this.configService.get<string>('SMTP_PASSWORD');

    const fromName =
      this.configService.get<string>('SMTP_FROM_NAME') ||
      'Taha Siddique';

    if (!host || !emailUser || !emailPassword) {
      throw new InternalServerErrorException(
        'SMTP email configuration is incomplete. Please check your backend environment variables.',
      );
    }

    if (!Number.isInteger(port) || port <= 0) {
      throw new InternalServerErrorException(
        'Invalid SMTP port configuration.',
      );
    }

    const transporter = createTransport({
      host,
      port,
      secure,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    try {
      await transporter.sendMail({
        from: {
          name: fromName,
          address: emailUser,
        },

        to: message.email,

        subject: message.subject
          ? `Re: ${message.subject}`
          : 'Reply to your message',

        text: `${replyMessageDto.reply.trim()}\n\nRegards,\n${fromName}`,
      });
    } catch (error) {
      console.error('Email sending failed:', error);

      throw new InternalServerErrorException(
        'Unable to send email. Please check your SMTP configuration and try again.',
      );
    }

    // Save the reply only after successful email delivery.
    message.replies.push({
      body: replyMessageDto.reply.trim(),
      sentAt: new Date(),
      from: emailUser,
      to: message.email,
    });

    message.status = 'replied';

    await message.save();

    return {
      message: 'Reply sent successfully.',
      data: message,
    };
  }

  async remove(id: string) {
    const message = await this.messageModel
      .findByIdAndDelete(id)
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found.');
    }

    return {
      message: 'Message deleted successfully.',
    };
  }

  async getUnreadCount() {
    return this.messageModel.countDocuments({
      status: 'unread',
    }).exec();
  }
}