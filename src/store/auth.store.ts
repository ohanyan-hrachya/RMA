import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Set<string>;
  setAuth: (
    user: User,
    accessToken: string,
    refreshToken: string,
    permissions: string[],
  ) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: {
    id: "1",
    name: "Admin User",
    email: "admin@rma.dev",
    role: "Super Admin",
    avatar: undefined,
  },
  accessToken: "mock-jwt-token",
  refreshToken: "mock-refresh-token",
  permissions: new Set([
    "users:list",
    "users:create",
    "users:update",
    "users:delete",
    "users:view",
    "jobs:list",
    "jobs:create",
    "jobs:update",
    "jobs:delete",
    "jobs:view",
    "banking:list",
    "banking:create",
    "banking:update",
    "banking:delete",
    "banking:view",
    "banking:approve",
    "overview:view",
  ]),
  setAuth: (user, accessToken, refreshToken, permissions) =>
    set({ user, accessToken, refreshToken, permissions: new Set(permissions) }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: new Set(),
    }),
  hasPermission: (permission: string) => get().permissions.has(permission),
}));
