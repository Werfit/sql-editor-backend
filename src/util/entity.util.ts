import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";

export abstract class EntityUtil extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: string;
}
