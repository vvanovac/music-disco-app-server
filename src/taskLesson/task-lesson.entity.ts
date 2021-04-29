import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { DIFFICULTIES_ENUM } from '../common/constants';
import Lessons from '../lessons/lessons.entity';
import Tasks from '../tasks/tasks.entity';

@Entity()
export default class TaskLesson {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lessons, (lessons: Lessons) => lessons.id)
  lessons: Lessons;

  @ManyToOne(() => Tasks, (tasks: Tasks) => tasks.id)
  tasks: Tasks;

  @Column({ type: 'varchar' })
  difficulty: DIFFICULTIES_ENUM;

  @Column({ type: 'int4' })
  taskOrder: number;
}
