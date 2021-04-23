import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DIFFICULTIES_ENUM } from '../common/constants';

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

  @Column({ type: 'int4' })
  courseID: number;
}
