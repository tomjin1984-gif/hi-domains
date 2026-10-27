import { OrderDetail } from "@/components/workspace/order-detail";
export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetail id={(await params).id} role="admin" />;
}
