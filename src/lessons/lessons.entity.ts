import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DIFFICULTIES_ENUM } from '../common/constants';
import Courses from '../courses/courses.entity';

@Entity()
export default class Lessons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int', array: true })
  listOfTasks: number[];

  @Column({ type: 'varchar' })
  difficulty: DIFFICULTIES_ENUM;

  @ManyToOne(() => Courses, (courses: Courses) => courses.id, { onDelete: 'CASCADE' })
  courses: Courses;
}
