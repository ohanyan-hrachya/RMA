import { useAuthStore } from "@/store";

/**
 * Returns true if the current user has the given permission string.
 * Example: usePermission("users:create")
 */
export function usePermission(permission: string): boolean {
    return useAuthStore((s) => s.permissions.has(permission));
}
