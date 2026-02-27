import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// export const queryKeys = {
//   all: (resource: string) => [resource] as const,
//   list: (resource: string, params?: Record<string, unknown>) => [resource, 'list', params] as const,
//   detail: (resource: string, id: string | number) => [resource, 'detail', id] as const,
// };

export const Query = ({ children }: { children: React.ReactNode }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}