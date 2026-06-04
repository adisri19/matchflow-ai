export const allowedUsers: string[] = [
  "demo@tdc.com",
  "admin@tdc.com",
  "test@tdc.com"
];

export function isAllowed(email: string): boolean {
  if (!email) return false;
  return allowedUsers.includes(email.trim().toLowerCase());
}
