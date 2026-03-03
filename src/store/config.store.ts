import { create } from "zustand";
import type { AppConfig } from "../shared/types";
import { mockConfigApi } from "../services/mockApi";

interface ConfigState {
    config: AppConfig | null;
    isLoading: boolean;
    error: string | null;
    fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
    config: null,
    isLoading: false,
    error: null,
    fetchConfig: async () => {
        set({ isLoading: true, error: null });
        try {
            const config = await mockConfigApi.getAppConfig();
            set({ config, isLoading: false });
        } catch (err) {
            set({ error: (err as any).message || "Failed to load config", isLoading: false });
        }
    },
}));
