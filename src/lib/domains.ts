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

export interface PublicDomain {
  id: string;
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

function parsePublicDomainRow(value: unknown): PublicDomain | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, domain, extension, status, created_at } = value;

  if (
    typeof id !== "string" ||
    typeof domain !== "string" ||
    typeof status !== "string" ||
    typeof created_at !== "string"
  ) {
    return null;
  }

  return {
    id,
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

export async function getUserDomainById(domainId: string): Promise<Domain | null> {
  const normalizedDomainId = domainId.trim();

  if (!normalizedDomainId) {
    return null;
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("domains")
    .select("id, user_id, domain, extension, status, created_at")
    .eq("id", normalizedDomainId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return null;
  }

  return parseDomainRow(data);
}

function normalizeDomainLookup(value: string) {
  return value.trim().toLowerCase();
}

function parseDomainLookup(value: string) {
  const normalized = normalizeDomainLookup(value);
  const labels = normalized.split(".");

  if (labels.length < 2 || labels.some((label) => !label)) {
    return null;
  }

  const extension = labels.at(-1);
  const domain = labels.slice(0, -1).join(".");

  if (!domain || !extension) {
    return null;
  }

  return {
    domain,
    extension,
  };
}

export async function getPublicDomainByName(value: string): Promise<PublicDomain | null> {
  const normalizedDomain = normalizeDomainLookup(value);

  if (!normalizedDomain) {
    return null;
  }

  const supabase = await createClient();

  const { data: exactData, error: exactError } = await supabase
    .from("domains")
    .select("id, domain, extension, status, created_at")
    .eq("domain", normalizedDomain)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!exactError) {
    const exactDomain = parsePublicDomainRow(exactData);

    if (exactDomain) {
      return exactDomain;
    }
  }

  const parsedDomain = parseDomainLookup(normalizedDomain);

  if (!parsedDomain) {
    return null;
  }

  const { data, error } = await supabase
    .from("domains")
    .select("id, domain, extension, status, created_at")
    .eq("domain", parsedDomain.domain)
    .in("extension", [parsedDomain.extension, `.${parsedDomain.extension}`])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return parsePublicDomainRow(data);
}
