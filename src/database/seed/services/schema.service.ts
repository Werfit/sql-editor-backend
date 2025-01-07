import { Injectable, Logger } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SchemaSeedService {
  private logger = new Logger(SchemaSeedService.name);

  constructor(private readonly dataSource: DataSource) {}

  async run() {
    try {
      await this.dataSource.query(
        `
DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'workspace_guest') THEN
      CREATE ROLE workspace_guest NOLOGIN;
      END IF;
      END $$;
  ALTER ROLE workspace_guest SET search_path TO workspace_schema;
  REVOKE ALL ON SCHEMA public FROM workspace_guest;
  REVOKE ALL ON ALL TABLES IN SCHEMA public FROM workspace_guest;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM workspace_guest;
`
      );
    } catch (error) {
      this.logger.error(error);
      throw new Error("Failed to create workspace role");
    }
  }
}
