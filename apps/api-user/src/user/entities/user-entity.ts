import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
  database: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: false })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
  status: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedDate: Date;

  @DeleteDateColumn({ type: 'datetime', default: null, nullable: true })
  deletedDate: Date;
}
