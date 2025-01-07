import { Reflector } from "@nestjs/core";
import { Entity, EntityTarget } from "typeorm";

type Ownership<E extends typeof Entity = typeof Entity> = {
  entity: EntityTarget<E>;
  field: string;
};

export const Owner = Reflector.createDecorator<Ownership[]>();
