import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useAdminOrders = () => {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api("/admin/orders"),
  });
};

export const useAdminVendors = () => {
  return useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => api("/admin/vendors"),
  });
};

export const useAdminWithdrawals = () => {
  return useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: () => api("/admin/withdrawals"),
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => api("/admin/users"),
  });
};
