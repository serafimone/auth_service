import { Entity, PrimaryColumn, Column } from 'typeorm';
import AbstractEntity from '../../core/entity/abstract.entity';

@Entity({ name: 'user' })
export class User extends AbstractEntity {

  @PrimaryColumn('integer')
  public id!: number

  @Column('varchar')
  public login!: string

  @Column('varchar')
  public password!: string

}