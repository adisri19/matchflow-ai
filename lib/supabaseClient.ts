import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-anon-key"
  );

  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy.supabase.co");

  if (isMockMode) {
    const originalAuth = client.auth;
    client.auth = {
      ...originalAuth,
      getUser: async () => {
        const getCookie = (name: string) => {
          if (typeof document === "undefined") return null;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };
        const mockCookie = getCookie("mock_session");
        if (mockCookie) {
          return {
            data: {
              user: {
                id: "mock-user-id-123",
                email: decodeURIComponent(mockCookie),
                user_metadata: { role: "matchmaker" },
              } as any,
            },
            error: null,
          };
        }
        return { data: { user: null }, error: new Error("No session") as any };
      },
      signOut: async () => {
        if (typeof document !== "undefined") {
          document.cookie = "mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        }
        return { error: null };
      }
    } as any;
  }

  return client;
};
