import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MUSIC_NOTES_ENUM, OCTAVE_ENUM } from '../common/constants';

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

  @Column({ type: 'json' })
  musicNotes: MUSIC_NOTES_ENUM[];

  @Column({ type: 'varchar' })
  octave: OCTAVE_ENUM;
}
