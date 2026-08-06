import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  plan: string;
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, plan")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data || typeof data.id !== "string") {
    return null;
  }

  return {
    id: data.id,
    email: typeof data.email === "string" ? data.email : null,
    full_name: typeof data.full_name === "string" ? data.full_name : null,
    plan: typeof data.plan === "string" && data.plan ? data.plan : "free",
  };
}
