import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  hash: string;

  @Column({ type: 'varchar' })
  salt: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'boolean', nullable: true })
  isAdmin: boolean;
}
