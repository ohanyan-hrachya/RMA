import type { PropsWithChildren } from "react";
import { usePermission } from "@/shared/hooks/use-permission";

interface Props {
    permission: string;
    fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user has the required permission.
 * Optionally renders a fallback if they don't.
 *
 * @example
 * <PermissionGate permission="users:create">
 *   <Button>Add User</Button>
 * </PermissionGate>
 */
export function PermissionGate({
    permission,
    fallback = null,
    children,
}: PropsWithChildren<Props>) {
    const can = usePermission(permission);
    return can ? <>{children}</> : <>{fallback}</>;
}
