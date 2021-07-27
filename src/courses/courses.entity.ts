import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { INSTRUMENT_ENUM } from '../common/constants';

@Entity()
export default class Courses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  instrument: INSTRUMENT_ENUM;
}
