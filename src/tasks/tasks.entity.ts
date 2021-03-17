import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Tasks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  subtitle: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  descriptionImage: string;
}
