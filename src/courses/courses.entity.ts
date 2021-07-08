import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;
}
