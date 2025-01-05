import type { User } from "src/user/user.entity";
import { EntityUtil } from "src/util/entity.util";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Workspace extends EntityUtil {
  @Column()
  name: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastEdit: Date;

  @ManyToOne("User", "User.workspaces", {
    onDelete: "CASCADE",
  })
  creator: User;
}
