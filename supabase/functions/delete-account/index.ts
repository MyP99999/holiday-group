import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jwtIssuedAt(token: string) {
  try {
    const encoded = token.split(".")[1];
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return Number(JSON.parse(atob(padded)).iat || 0);
  } catch {
    return 0;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  const authorization = request.headers.get("Authorization") || "";
  const accessToken = authorization.replace(/^Bearer\s+/i, "");
  if (!accessToken) return json({ error: "AUTH_REQUIRED" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return json({ error: "SERVER_NOT_CONFIGURED" }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser(accessToken);
  if (userError || !userData.user) return json({ error: "AUTH_REQUIRED" }, 401);

  // The browser reauthenticates with the account password immediately before this
  // call. Reject an older access token so an unattended session cannot delete the account.
  const issuedAt = jwtIssuedAt(accessToken);
  const tokenAgeSeconds = Math.floor(Date.now() / 1000) - issuedAt;
  if (!issuedAt || tokenAgeSeconds < -30 || tokenAgeSeconds > 300) {
    return json({ error: "REAUTHENTICATION_REQUIRED" }, 401);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: preparation, error: preparationError } = await admin.rpc(
    "prepare_account_deletion",
    { p_user_id: userData.user.id },
  );
  if (preparationError) {
    console.error("Account deletion preparation failed", preparationError);
    return json({ error: "ACCOUNT_CLEANUP_FAILED" }, 500);
  }

  // Remove user-owned avatars before deleting auth.users. Supabase prevents user
  // deletion while the account still owns Storage objects.
  for (let pass = 0; pass < 20; pass += 1) {
    const { data: files, error: listError } = await admin.storage
      .from("avatars")
      .list(userData.user.id, { limit: 100, offset: 0 });
    if (listError) return json({ error: "AVATAR_CLEANUP_FAILED" }, 500);
    if (!files?.length) break;

    const paths = files
      .filter((file) => file.name && file.id)
      .map((file) => `${userData.user.id}/${file.name}`);
    if (!paths.length) break;

    const { error: removeError } = await admin.storage.from("avatars").remove(paths);
    if (removeError) return json({ error: "AVATAR_CLEANUP_FAILED" }, 500);
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(userData.user.id);
  if (deleteError) {
    console.error("Auth user deletion failed", deleteError);
    return json({ error: "ACCOUNT_DELETE_FAILED" }, 500);
  }

  return json({ deleted: true, preparation });
});
