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
  name: 'product',
  database: 'product',
})
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: false, unique: false })
  status: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: false })
  updatedDate: Date;

  @DeleteDateColumn({ type: 'datetime', default: null, nullable: true })
  deletedDate: Date;
}
