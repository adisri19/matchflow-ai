"use server";

import { createClient } from "@/lib/supabaseServer";
import { isAllowed } from "@/lib/allowedUsers";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  // Double check allowlist even on login just in case
  if (!isAllowed(email)) {
    return { error: "Access restricted to authorized matchmakers." };
  }

  const supabase = await createClient();

  // Try to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    // Self-healing demo account seeding:
    // If it's the demo account and it doesn't exist, sign it up automatically
    if (email === "demo@tdc.com" && signInError.message.includes("Invalid login credentials")) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: "matchmaker",
          },
        },
      });

      if (!signUpError) {
        // Sign in again after automatic signup
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!retryError) {
          redirect("/dashboard");
        }
      }
    }

    return { error: signInError.message };
  }

  redirect("/dashboard");
}

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  // Server-side allowlist enforcement
  if (!isAllowed(email)) {
    return { error: "Access restricted to authorized matchmakers." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: "matchmaker",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Automatically sign in after signup if email verification is disabled
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!signInError) {
    redirect("/dashboard");
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
