"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  addOrderNote,
  createOrder,
  saveBrokerAccess,
  updateOrder,
  updateDomainStatus,
  updateProfile,
  type ActionResult,
} from "@/app/workspace-actions";
import type { StaffAccess, WorkspaceOrder } from "@/lib/workspace";

const input =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:bg-slate-100";
const label = "block text-sm font-medium text-slate-600";
export type PersonOption = {
  id: string;
  email: string;
  full_name?: string | null;
};
export function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="min-h-10 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-wait disabled:opacity-50"
    >
      {pending ? "正在保存…" : children}
    </button>
  );
}
function TransitionButton({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      name="status"
      value={value}
      className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      type="submit"
    >
      {pending ? "正在保存…" : children}
    </button>
  );
}
function Message({ state }: { state: ActionResult }) {
  return (
    <div aria-live="polite">
      {state.error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
        >
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-3 rounded-xl bg-teal-50 p-3 text-sm text-teal-800">
          {state.success}
        </p>
      )}
    </div>
  );
}
export function BrokerAccessForm({
  person,
  access,
}: {
  person: PersonOption;
  access?: StaffAccess;
}) {
  const [state, action] = useActionState(saveBrokerAccess, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="user_id" value={person.id} />
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {(
          [
            ["active", "开通经纪人后台"],
            ["can_accept_orders", "接单 / 拒单"],
            ["can_update_orders", "推进订单状态"],
            ["can_add_notes", "添加跟进记录"],
          ] as const
        ).map(([name, title]) => (
          <label key={name} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={name}
              defaultChecked={access ? access[name] : name !== "active"}
              className="size-4 accent-teal-700"
            />
            {title}
          </label>
        ))}
      </div>
      <Submit>保存授权</Submit>
      <Message state={state} />
    </form>
  );
}
export function NewOrderForm({ people }: { people?: PersonOption[] }) {
  const [state, action] = useActionState(createOrder, {});
  return (
    <form action={action} className="space-y-4">
      {people && (
        <label className={label}>
          委托用户
          <select name="owner_id" required className={input}>
            <option value="">选择用户</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.email}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          完整域名
          <input
            className={input}
            name="domain_name"
            placeholder="example.com"
            required
            maxLength={253}
          />
        </label>
        <label className={label}>
          委托类型
          <select className={input} name="service_type">
            <option value="sale">出售域名</option>
            <option value="acquisition">收购域名</option>
          </select>
        </label>
      </div>
      <label className={label}>
        目标金额 / 预算（USD，可选）
        <input
          className={input}
          name="budget"
          type="number"
          min="0"
          max="999999999999.99"
          step="0.01"
          placeholder="例如 5000"
        />
      </label>
      <label className={label}>
        委托说明
        <textarea
          className={input}
          name="brief"
          rows={4}
          required
          minLength={5}
          maxLength={3000}
          placeholder="说明出售目标、收购需求和期望时间，管理员将分配经纪人跟进。"
        />
      </label>
      <p className="text-xs leading-5 text-slate-500">
        金额仅用于委托沟通，不会发起付款或交易。请确认你有权委托该域名。
      </p>
      <Submit>提交委托</Submit>
      <Message state={state} />
    </form>
  );
}
export function AdminOrderForm({
  order,
  brokers,
}: {
  order: WorkspaceOrder;
  brokers: PersonOption[];
}) {
  const [state, action] = useActionState(updateOrder, {});
  const [status, setStatus] = useState(order.status);
  const closed = ["completed", "cancelled"].includes(order.status);
  if (closed)
    return (
      <p className="text-sm text-slate-500">订单已关闭，保留记录供查阅。</p>
    );
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="order_id" value={order.id} />
      <input type="hidden" name="version" value={order.version} />
      <label className={label}>
        分配经纪人
        <select
          className={input}
          name="broker_id"
          defaultValue={order.broker_id ?? ""}
          disabled={status === "pending"}
          required={!["pending", "cancelled"].includes(status)}
        >
          <option value="">未分配</option>
          {order.broker_id &&
            !brokers.some((b) => b.id === order.broker_id) && (
              <option value={order.broker_id}>
                原经纪人（已停用 / 无接单权限）
              </option>
            )}
          {brokers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.email}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        订单状态
        <select
          className={input}
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">待分配（清除经纪人）</option>
          <option value="assigned">待接单（分配 / 重新分配）</option>
          <option value="accepted">已接单</option>
          <option value="in_progress">跟进中</option>
          <option value="completed">已完成</option>
          <option value="declined">已拒单</option>
          <option value="cancelled">已取消</option>
        </select>
      </label>
      <Submit>更新分配与状态</Submit>
      <Message state={state} />
    </form>
  );
}
export function BrokerOrderForm({
  order,
  access,
}: {
  order: WorkspaceOrder;
  access: StaffAccess;
}) {
  const [state, action] = useActionState(updateOrder, {});
  const transitions: Record<string, [string, string][]> = {
    assigned: [
      ["accepted", "接受委托"],
      ["declined", "拒绝委托"],
    ],
    accepted: [["in_progress", "开始跟进"]],
    in_progress: [["completed", "标记完成"]],
  };
  const options = transitions[order.status] ?? [];
  const permitted =
    order.status === "assigned"
      ? access.can_accept_orders
      : access.can_update_orders;
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="order_id" value={order.id} />
      <input type="hidden" name="version" value={order.version} />
      {options.length && permitted ? (
        <div className="flex flex-wrap gap-2">
          {options.map(([value, title]) => (
            <TransitionButton key={value} value={value}>
              {title}
            </TransitionButton>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          {options.length
            ? "当前操作权限未开通，请联系管理员。"
            : "此订单暂无可执行的状态操作。"}
        </p>
      )}
      <Message state={state} />
    </form>
  );
}
export function NoteForm({ orderId }: { orderId: string }) {
  const [state, action] = useActionState(addOrderNote, {});
  return (
    <form action={action} className="mt-5 space-y-3">
      <input type="hidden" name="order_id" value={orderId} />
      <label className={label}>
        新增内部跟进
        <textarea
          name="body"
          className={input}
          required
          maxLength={2000}
          rows={3}
          placeholder="记录沟通进展、下一步行动或交接事项。"
        />
      </label>
      <Submit>保存跟进</Submit>
      <Message state={state} />
    </form>
  );
}
export function DomainStatusForm({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [state, action] = useActionState(updateDomainStatus, {});
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>
        域名状态
      </label>
      <select
        id={`status-${id}`}
        className={input}
        name="status"
        defaultValue={status}
      >
        <option value="active">正常</option>
        <option value="on_hold">暂缓</option>
        <option value="sold">已售出</option>
        <option value="archived">已归档</option>
      </select>
      <Submit>保存</Submit>
      <Message state={state} />
    </form>
  );
}
export function ProfileForm({ person }: { person: PersonOption }) {
  const [state, action] = useActionState(updateProfile, {});
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="id" value={person.id} />
      <label className={label}>
        显示名称
        <input
          className={input}
          name="full_name"
          defaultValue={person.full_name ?? ""}
          maxLength={100}
        />
      </label>
      <Submit>保存资料</Submit>
      <Message state={state} />
    </form>
  );
}
