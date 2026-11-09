import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminsController } from './admins.controller.js';
import { AdminsService } from './admins.service.js';
import { Admin, AdminSchema } from './schemas/admin.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Admin.name,
        schema: AdminSchema,
      },
    ]),
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [MongooseModule, AdminsService],
})
export class AdminsModule {}