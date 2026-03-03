import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../services/queryClient";

export const Query = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
