import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface Domain {
  id: string;
  user_id: string;
  domain: string;
  extension: string | null;
  status: string;
  created_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseDomainRow(value: unknown): Domain | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, user_id, domain, extension, status, created_at } = value;

  if (
    typeof id !== "string" ||
    typeof user_id !== "string" ||
    typeof domain !== "string" ||
    typeof status !== "string" ||
    typeof created_at !== "string"
  ) {
    return null;
  }

  return {
    id,
    user_id,
    domain,
    extension: typeof extension === "string" ? extension : null,
    status,
    created_at,
  };
}

export async function getUserDomains(): Promise<Domain[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("domains")
    .select("id, user_id, domain, extension, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  const rows: unknown[] = Array.isArray(data) ? data : [];

  return rows
    .map((row) => parseDomainRow(row))
    .filter((domain): domain is Domain => domain !== null);
}
