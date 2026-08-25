import { prisma } from "@/lib/db";
import { Prisma } from "@/app/generated/prisma/client";

export type AuditEntityType = "book" | "category" | "subject" | "language" | "site_setting";
export type AuditAction = "create" | "update" | "delete" | "toggle_availability";

export function logAdminAction(params: {
  adminId: string;
  entityType: AuditEntityType;
  entityId: string;
  action: AuditAction;
  detail?: Prisma.InputJsonValue;
}) {
  return prisma.adminAuditLog.create({
    data: {
      adminId: params.adminId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      detail: params.detail,
    },
  });
}
