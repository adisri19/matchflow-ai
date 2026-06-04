import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy.supabase.co");

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored
          }
        },
      },
    }
  );

  if (isMockMode) {
    const originalAuth = client.auth;
    client.auth = {
      ...originalAuth,
      getUser: async () => {
        const hasMockCookie = cookieStore.has("mock_session");
        if (hasMockCookie) {
          const email = cookieStore.get("mock_session")?.value || "demo@tdc.com";
          return {
            data: {
              user: {
                id: "mock-user-id-123",
                email: email,
                user_metadata: { role: "matchmaker" },
              } as any,
            },
            error: null,
          };
        }
        return { data: { user: null }, error: new Error("No session") as any };
      },
      signOut: async () => {
        cookieStore.delete("mock_session");
        return { error: null };
      }
    } as any;
  }

  return client;
}
