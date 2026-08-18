import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/actions/admin.actions";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell admin={admin}>
      {children}
    </AdminShell>
  );
}