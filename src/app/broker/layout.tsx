import { requireStaff } from "@/lib/workspace";
import { WorkspaceShell } from "@/components/workspace/shell";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "经纪人接单后台 | hi.domains",
  robots: { index: false, follow: false },
};
export default async function BrokerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireStaff("broker");
  return (
    <WorkspaceShell role="broker" email={user.email ?? ""}>
      {children}
    </WorkspaceShell>
  );
}
