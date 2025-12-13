import { apiRequest } from "./api-client";
import {
  AssetCreate,
  AssetResponse,
  AssetUpdate,
  TotalAssetsResponse,
  SubscriptionCreate,
  SubscriptionResponse,
  SubscriptionUpdate,
  TransactionCreate,
  TransactionResponse,
  BillingAlertResponse,
  MonthlySpendingResponse,
  CategorySpendingResponse,
  SubscriptionSpendingResponse,
  AssetDistributionResponse,
  SubscriptionStatus,
  TransactionCategory,
  Token,
  UserCreate,
  UserResponse,
  ChangePasswordRequest,
} from "./api-types";

// Auth
export const authApi = {
  register: (data: UserCreate) =>
    apiRequest<UserResponse>("/api/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: URLSearchParams) =>
    apiRequest<Token>("/api/auth/login", {
      method: "POST",
      body: data,
    }),

  changePassword: (data: ChangePasswordRequest) =>
    apiRequest<void>("/api/auth/change-password", {
      method: "POST",
      body: data,
    }),
};

// Assets
export const assetsApi = {
  create: (data: AssetCreate) =>
    apiRequest<AssetResponse>("/api/assets", {
      method: "POST",
      body: data,
    }),

  list: () =>
    apiRequest<AssetResponse[]>("/api/assets", {
      method: "GET",
    }),

  getTotal: () =>
    apiRequest<TotalAssetsResponse>("/api/assets/total", {
      method: "GET",
    }),

  get: (id: number) =>
    apiRequest<AssetResponse>(`/api/assets/${id}`, {
      method: "GET",
    }),

  update: (id: number, data: AssetUpdate) =>
    apiRequest<AssetResponse>(`/api/assets/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: number) =>
    apiRequest<void>(`/api/assets/${id}`, {
      method: "DELETE",
    }),
};

// Subscriptions
export const subscriptionsApi = {
  create: (data: SubscriptionCreate) =>
    apiRequest<SubscriptionResponse>("/api/subscriptions", {
      method: "POST",
      body: data,
    }),

  list: (status?: SubscriptionStatus) =>
    apiRequest<SubscriptionResponse[]>("/api/subscriptions", {
      method: "GET",
      params: { status },
    }),

  get: (id: number) =>
    apiRequest<SubscriptionResponse>(`/api/subscriptions/${id}`, {
      method: "GET",
    }),

  update: (id: number, data: SubscriptionUpdate) =>
    apiRequest<SubscriptionResponse>(`/api/subscriptions/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id: number) =>
    apiRequest<void>(`/api/subscriptions/${id}`, {
      method: "DELETE",
    }),
};

// Transactions
export const transactionsApi = {
  create: (data: TransactionCreate) =>
    apiRequest<TransactionResponse>("/api/transactions", {
      method: "POST",
      body: data,
    }),

  list: (params?: {
    category?: TransactionCategory;
    subscription_id?: number;
    start_date?: string;
    end_date?: string;
  }) =>
    apiRequest<TransactionResponse[]>("/api/transactions", {
      method: "GET",
      params: { ...params },
    }),

  get: (id: number) =>
    apiRequest<TransactionResponse>(`/api/transactions/${id}`, {
      method: "GET",
    }),
};

// Billing
export const billingApi = {
  getAlerts: (days: number = 7) =>
    apiRequest<BillingAlertResponse[]>("/api/billing/alerts", {
      method: "GET",
      params: { days },
    }),
};

// Statistics
export const statisticsApi = {
  getMonthlySpending: (year: number, month: number) =>
    apiRequest<MonthlySpendingResponse>("/api/statistics/monthly-spending", {
      method: "GET",
      params: { year, month },
    }),

  getCategorySpending: (start_date: string, end_date: string) =>
    apiRequest<CategorySpendingResponse>("/api/statistics/category-spending", {
      method: "GET",
      params: { start_date, end_date },
    }),

  getSubscriptionSpending: (year: number, month: number) =>
    apiRequest<SubscriptionSpendingResponse>(
      "/api/statistics/subscription-spending",
      {
        method: "GET",
        params: { year, month },
      }
    ),

  getAssetDistribution: () =>
    apiRequest<AssetDistributionResponse>("/api/statistics/asset-distribution", {
      method: "GET",
    }),
};