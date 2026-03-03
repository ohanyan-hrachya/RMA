import { delay } from "@/shared/helpers";
import { APP_CONFIG } from "./mock/config";

export * from "./mock/data";
export * from "./mock/api-logic";
export * from "./mock/config";

export const mockConfigApi = {
    getAppConfig: async () => {
        await delay(300);
        return APP_CONFIG;
    }
};
