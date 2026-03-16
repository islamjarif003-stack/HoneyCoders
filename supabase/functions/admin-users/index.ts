import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZGNta3NtaWNiYnVwdmpxbG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTc4NTUsImV4cCI6MjA4OTE3Mzg1NX0.dVx8xKJr3cQ0YY9o0Rxw0s1A_UDWS4OBq0wEDi5q1SI";

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error("Missing env vars:", { hasUrl: !!supabaseUrl, hasKey: !!serviceRoleKey, hasAnon: !!anonKey });
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Verify admin role
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) throw new Error("Not authorized");

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { action, userId, ...params } = await req.json();

    let result: any = { success: true };

    switch (action) {
      case "update_role": {
        const { role, add } = params;
        if (add) {
          const { error } = await adminClient.from("user_roles").upsert(
            { user_id: userId, role },
            { onConflict: "user_id,role" }
          );
          if (error) throw error;
        } else {
          const { error } = await adminClient.from("user_roles").delete()
            .eq("user_id", userId).eq("role", role);
          if (error) throw error;
        }
        break;
      }

      case "update_status": {
        const { status } = params;
        const { error } = await adminClient.from("profiles").update({ account_status: status }).eq("user_id", userId);
        if (error) throw error;

        if (status === "suspended") {
          await adminClient.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
        } else {
          await adminClient.auth.admin.updateUserById(userId, { ban_duration: "none" });
        }
        break;
      }

      case "reset_password": {
        const { data: userData } = await adminClient.auth.admin.getUserById(userId);
        if (!userData?.user?.email) throw new Error("User email not found");
        const { data, error } = await adminClient.auth.admin.generateLink({
          type: "recovery",
          email: userData.user.email,
        });
        if (error) throw error;
        result = { success: true, message: "Password reset link generated", link: data?.properties?.action_link };
        break;
      }

      case "delete_user": {
        const { error } = await adminClient.auth.admin.deleteUser(userId);
        if (error) throw error;
        break;
      }

      default:
        throw new Error("Unknown action");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
