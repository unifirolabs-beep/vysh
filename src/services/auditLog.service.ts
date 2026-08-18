import { AuditLogEntry } from "@/types/audit.types";

export class AuditLogService {

  async logAction(entry: AuditLogEntry): Promise<void> {
  }
}

export const auditLogService = new AuditLogService();
