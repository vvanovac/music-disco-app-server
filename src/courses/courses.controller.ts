import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Res, UseGuards } from '@nestjs/common';

import { CreateCourseDto, UpdateCourseDto } from './courses.dto';
import { ICourse, ICourseService } from './courses.interface';
import { I_COURSE_SERVICE } from './courses.constants';
import { JwtAuthGuard } from '../authentication/jwt.auth.guard';
import { AUTH_GUARD_TYPES_ENUM } from '../common/constants';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export default class CoursesController {
  constructor(
    @Inject(I_COURSE_SERVICE)
    private readonly coursesService: ICourseService,
  ) {}

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto, @Res() res): Promise<ICourse> {
    try {
      const course = await this.coursesService.createCourse(createCourseDto);
      return res.status(HttpStatus.CREATED).json(course);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get()
  async find(@Res() res): Promise<ICourse[]> {
    try {
      const courses = await this.coursesService.findCourses();
      return res.status(HttpStatus.OK).json(courses);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id, @Res() res): Promise<ICourse> {
    try {
      const course = await this.coursesService.findCourse(id);
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Put(':id')
  async update(@Param('id') id, @Body() updateCourseDto: UpdateCourseDto, @Res() res): Promise<ICourse> {
    try {
      const course = await this.coursesService.updateCourse(id, updateCourseDto);
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(new JwtAuthGuard(AUTH_GUARD_TYPES_ENUM.ADMIN))
  @Delete(':id')
  async delete(@Param('id') id, @Res() res): Promise<ICourse> {
    try {
      const course = await this.coursesService.deleteCourse(id);
      return res.status(HttpStatus.OK).json(course);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
