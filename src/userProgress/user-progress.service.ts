import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

import UserProgress from './user-progress.entity';
import { UpdateUserProgressDto } from './user-progress.dto';
import { ITaskProgress, IUserProgress, IUserProgressService } from './user-progress.interface';

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

  async getUserProgressID(userID: number, lessonID: number, taskID: number): Promise<number> {
    const userProgress = await getRepository(UserProgress)
      .createQueryBuilder('userProgress')
      .leftJoinAndSelect('userProgress.taskLesson', 'taskLesson')
      .leftJoinAndSelect('taskLesson.lessons', 'lessons')
      .leftJoinAndSelect('taskLesson.tasks', 'tasks')
      .where('userProgress.usersId = :userID', { userID })
      .andWhere('lessons.id = :lessonID', { lessonID })
      .andWhere('tasks.id = :taskID', { taskID })
      .getOne();

    return userProgress ? userProgress.id : null;
  }

  async getTaskProgress(userID: number, lessonID: number): Promise<ITaskProgress[]> {
    const taskProgress = await getRepository(UserProgress)
      .createQueryBuilder('userProgress')
      .leftJoinAndSelect('userProgress.taskLesson', 'taskLesson')
      .leftJoinAndSelect('taskLesson.tasks', 'tasks')
      .leftJoinAndSelect('taskLesson.lessons', 'lessons')
      .where('userProgress.usersId = :userID', { userID })
      .andWhere('lessons.id = :lessonID', { lessonID })
      .getMany();

    return taskProgress.map((progress) => {
      return {
        progressID: progress.id,
        taskID: progress.taskLesson.tasks.id,
        completed: progress.completed,
      };
    });
  }

  async countCompletedTasks(userID: number, lessonID: number): Promise<number> {
    return await getRepository(UserProgress)
      .createQueryBuilder('userProgress')
      .leftJoinAndSelect('userProgress.taskLesson', 'taskLesson')
      .leftJoinAndSelect('taskLesson.lessons', 'lessons')
      .leftJoinAndSelect('taskLesson.tasks', 'tasks')
      .where('userProgress.usersId = :userID', { userID })
      .andWhere('lessons.id = :lessonID', { lessonID })
      .andWhere('userProgress.completed = true')
      .getCount();
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
