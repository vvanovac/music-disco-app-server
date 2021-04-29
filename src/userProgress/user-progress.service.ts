import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import UserProgress from './user-progress.entity';
import { UpdateUserProgressDto } from './user-progress.dto';
import { IUserProgress, IUserProgressService } from './user-progress.interface';

@Injectable()
export default class UserProgressService implements IUserProgressService {
  constructor(
    @InjectRepository(UserProgress)
    private userProgressRepository: Repository<UserProgress>,
  ) {}

  async createUserProgress(userProgress: IUserProgress): Promise<IUserProgress> {
    const inserted = await this.userProgressRepository.insert(userProgress);

    return this.findOneUserProgress(inserted.raw[0].id);
  }

  async findAllUserProgress(): Promise<IUserProgress[]> {
    return await this.userProgressRepository.find({ order: { id: 'ASC' } });
  }

  async findOneUserProgress(id: number): Promise<IUserProgress> {
    return (await this.userProgressRepository.findOne(id)) || null;
  }

  async updateUserProgress(id: number, userProgress: UpdateUserProgressDto): Promise<IUserProgress> {
    const target = await this.findOneUserProgress(id);

    if (!target) {
      throw new Error('Not Found');
    }

    if (Object.keys(userProgress).length > 0) {
      await this.userProgressRepository.update({ id }, { ...userProgress });
    }
    return this.findOneUserProgress(id);
  }
}
