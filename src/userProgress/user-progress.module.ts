import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import UserProgress from './user-progress.entity';
import UserProgressService from './user-progress.service';
import { I_USER_PROGRESS_SERVICE } from './user-progress.constants';
import UserProgressController from './user-progress.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress])],
  controllers: [UserProgressController],
  providers: [
    {
      useClass: UserProgressService,
      provide: I_USER_PROGRESS_SERVICE,
    },
  ],
  exports: [TypeOrmModule, UserProgressModule],
})
export class UserProgressModule {}
