import { requireStaff } from "@/lib/workspace";
import { WorkspaceShell } from "@/components/workspace/shell";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "全站管理员 | hi.domains",
  robots: { index: false, follow: false },
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireStaff("admin");
  return (
    <WorkspaceShell role="admin" email={user.email ?? ""}>
      {children}
    </WorkspaceShell>
  );
}
