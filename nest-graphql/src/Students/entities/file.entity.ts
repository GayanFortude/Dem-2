import { ObjectType, Field,ID, Directive } from '@nestjs/graphql';
import { Column, Entity,  PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  path: string;
  @Column()
  status: boolean;
}


