import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class SqlExecutionerService {
  private readonly logger = new Logger(SqlExecutionerService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createWorkspace(workspaceName: string): Promise<void> {
    const schemaName = this.getSchemaName(workspaceName);

    try {
      // Create schema and role
      await this.dataSource.query(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`
      );

      // Grant schema access to the role
      await this.dataSource.query(
        `GRANT USAGE, CREATE ON SCHEMA "${schemaName}" TO "workspace_guest"`
      );
      await this.dataSource.query(
        `GRANT ALL PRIVILEGES ON SCHEMA "${schemaName}" TO "workspace_guest"`
      );

      await this.dataSource.query(
        `REVOKE ALL ON SCHEMA "${schemaName}" FROM PUBLIC`
      );

      this.logger.log(
        `Workspace "${workspaceName}" created with schema "${schemaName}"`
      );
    } catch (error) {
      throw new BadRequestException(
        `Failed to create workspace: ${error.message}`
      );
    }
  }

  async deleteWorkspace(workspaceName: string): Promise<void> {
    const schemaName = this.getSchemaName(workspaceName);

    try {
      await this.dataSource.query(`DROP SCHEMA "${schemaName}" CASCADE`);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete workspace: ${error.message}`
      );
    }
  }

  async executeQuery(workspaceName: string, query: string): Promise<any> {
    const schemaName = this.getSchemaName(workspaceName);

    if (!this.isSafeQuery(query)) {
      // copied error message from the database in order to avoid giving any hints to users if they were blocked by this validation method or they did proceed to the direct database access and failed there
      throw new ForbiddenException(
        "Query execution error: permission denied for table"
      );
    }

    try {
      await this.dataSource.query("BEGIN");
      await this.dataSource.query(`SET ROLE "workspace_guest"`);

      await this.dataSource.query(`SET search_path TO "${schemaName}"`);

      const statements = query
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);

      const result: unknown[] = [];
      for await (const statement of statements) {
        const statementResult = await this.dataSource.query(statement);
        result.push(statementResult);
      }

      await this.dataSource.query("RESET ROLE");
      await this.dataSource.query(`RESET search_path`);
      await this.dataSource.query("COMMIT");

      return result;
    } catch (error) {
      await this.dataSource.query("ROLLBACK");

      throw new BadRequestException(`Query execution error: ${error.message}`);
    }
  }

  private getSchemaName(workspaceName: string) {
    return `workspace_${workspaceName}`;
  }

  private isSafeQuery = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();

    // Blocklist disallowed patterns
    const disallowedPatterns = [
      "public.",
      "information_schema.",
      "pg_catalog.",
      '"public".',
      '"information_schema".',
      '"pg_catalog".',
    ];

    return !disallowedPatterns.some((pattern) =>
      lowerCaseQuery.includes(pattern)
    );
  };
}
