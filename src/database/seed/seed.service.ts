import { Injectable } from "@nestjs/common";
import { SchemaSeedService } from "./services/schema.service";

@Injectable()
export class SeedService {
  constructor(private readonly schemaSeedService: SchemaSeedService) {}

  async run() {
    await this.schemaSeedService.run();
  }
}
