import { EntityUtil } from "src/util/entity.util";
import { Workspace } from "src/workspace/workspace.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("users")
export class User extends EntityUtil {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: "varchar", nullable: true })
  session: string | null;

  @OneToMany(() => Workspace, (workspace) => workspace.creator)
  workspaces: Workspace[];
}
