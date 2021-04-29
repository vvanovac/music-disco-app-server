import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import Users from '../authentication/users.entity';
import TaskLesson from '../taskLesson/task-lesson.entity';

@Entity()
export default class UserProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users: Users) => users.id)
  users: Users;

  @ManyToOne(() => TaskLesson, (taskLesson: TaskLesson) => taskLesson.id)
  taskLesson: TaskLesson;

  @Column({ type: 'boolean' })
  completed: boolean;

  @Column({ type: 'date' })
  completionDate: Date;
}
