import { mockUsersApi, mockJobsApi, mockBankingApi, mockOverviewApi } from "./mockApi";

export const SERVICE_REGISTRY: Record<string, any> = {
    users: mockUsersApi,
    jobs: mockJobsApi,
    banking: mockBankingApi,
    overview: mockOverviewApi,
};
