import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { I_USER_PROGRESS_SERVICE } from './user-progress.constants';
import { ITaskProgress, IUserProgress, IUserProgressService } from './user-progress.interface';
import { JwtAuthGuard } from '../authentication/jwt.auth.guard';
import { AUTH_GUARD_TYPES_ENUM } from '../common/constants';
import { CreateUserProgressDto, UpdateUserProgressDto } from './user-progress.dto';

@UseGuards(JwtAuthGuard)
@Controller('userProgress')
export default class UserProgressController {
  constructor(
    @Inject(I_USER_PROGRESS_SERVICE)
    private readonly userProgressService: IUserProgressService,
  ) {}

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.AUTHORIZED))
  @Post()
  async create(@Body() createUserProgressDto: CreateUserProgressDto, @Res() res): Promise<IUserProgress> {
    try {
      const userProgress = await this.userProgressService.createUserProgress(createUserProgressDto);
      return res.status(HttpStatus.CREATED).json(userProgress);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async find(@Res() res): Promise<IUserProgress[]> {
    try {
      const userProgress = await this.userProgressService.findAllUserProgress();
      return res.status(HttpStatus.OK).json(userProgress);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id, @Res() res): Promise<IUserProgress> {
    try {
      const userProgress = await this.userProgressService.findOneUserProgress(id);
      return res.status(HttpStatus.OK).json(userProgress);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/id/:userID/:lessonID/:taskID')
  async getUserProgressID(
    @Param('userID') userID,
    @Param('lessonID') lessonID,
    @Param('taskID') taskID,
    @Res() res,
  ): Promise<number> {
    try {
      const id = await this.userProgressService.getUserProgressID(userID, lessonID, taskID);
      return res.status(HttpStatus.OK).json(id);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/taskProgress/:userID/:lessonID')
  async getTaskProgress(@Param('userID') userID, @Param('lessonID') lessonID, @Res() res): Promise<ITaskProgress[]> {
    try {
      const taskProgress = await this.userProgressService.getTaskProgress(userID, lessonID);
      return res.status(HttpStatus.OK).json(taskProgress);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('/completedTasks/:userID/:lessonID')
  async countCompletedTasks(
    @Param('userID') userID,
    @Param('lessonID') lessonID,
    @Res() res,
  ): Promise<ITaskProgress[]> {
    try {
      const count = await this.userProgressService.countCompletedTasks(userID, lessonID);
      return res.status(HttpStatus.OK).json(count);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.AUTHORIZED))
  @Put(':id')
  async update(
    @Param('id') id,
    @Body() updateUserProgressDto: UpdateUserProgressDto,
    @Res() res,
  ): Promise<IUserProgress> {
    try {
      const userProgress = await this.userProgressService.updateUserProgress(id, updateUserProgressDto);
      return res.status(HttpStatus.OK).json(userProgress);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
