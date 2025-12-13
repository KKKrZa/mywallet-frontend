export type AssetType = "bank" | "payment" | "cash" | "investment";

export type BillingCycle = "weekly" | "monthly" | "yearly";

export type SubscriptionCategory = "video" | "music" | "software" | "cloud" | "other";

export type SubscriptionStatus = "active" | "paused" | "canceled";

export type TransactionCategory = "subscription" | "food" | "salary" | "other";

export type TransactionType = "income" | "expense";

export interface Token {
  access_token: string;
  token_type: string;
}

export interface UserCreate {
  username: string;
  email?: string | null;
  password: string;
}

export interface UserResponse {
  username: string;
  email?: string | null;
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface AssetCreate {
  name: string;
  type: AssetType;
  balance: number | string;
  currency?: string;
}

export interface AssetUpdate {
  name?: string | null;
  type?: AssetType | null;
  balance?: number | string | null;
  currency?: string | null;
}

export interface AssetResponse {
  id: number;
  user_id: number;
  name: string;
  type: AssetType;
  balance: string; // Decimal returned as string
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface AssetDistributionItem {
  asset_id: number;
  asset_name: string;
  asset_type: string;
  balance: string;
  percentage: string;
}

export interface AssetDistributionResponse {
  assets: AssetDistributionItem[];
  total_assets: string;
}

export interface TotalAssetsResponse {
  total: string;
  user_id: number;
}

export interface SubscriptionCreate {
  name: string;
  category: SubscriptionCategory;
  amount: number | string;
  billing_cycle: BillingCycle;
  next_billing_date: string; // Date string YYYY-MM-DD
  auto_renew?: boolean;
  asset_id?: number | null;
  status?: SubscriptionStatus;
}

export interface SubscriptionUpdate {
  name?: string | null;
  category?: SubscriptionCategory | null;
  amount?: number | string | null;
  billing_cycle?: BillingCycle | null;
  next_billing_date?: string | null;
  auto_renew?: boolean | null;
  asset_id?: number | null;
  status?: SubscriptionStatus | null;
}

export interface SubscriptionResponse {
  id: number;
  user_id: number;
  name: string;
  category: SubscriptionCategory;
  amount: string;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  auto_renew: boolean;
  asset_id: number | null;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionSpendingResponse {
  year: number;
  month: number;
  total_subscription_spending: string;
}

export interface TransactionCreate {
  type: TransactionType;
  category: TransactionCategory;
  amount: number | string;
  date: string; // Date string YYYY-MM-DD
  description?: string | null;
  subscription_id?: number | null;
  asset_id?: number | null;
}

export interface TransactionResponse {
  id: number;
  user_id: number;
  type: TransactionType;
  category: TransactionCategory;
  amount: string;
  date: string;
  description: string | null;
  subscription_id: number | null;
  asset_id: number | null;
  created_at: string;
}

export interface CategorySpendingItem {
  category: string;
  amount: string;
}

export interface CategorySpendingResponse {
  categories: CategorySpendingItem[];
  total: string;
}

export interface MonthlySpendingResponse {
  year: number;
  month: number;
  total_spending: string;
}

export interface BillingAlertResponse {
  subscription_id: number;
  subscription_name: string;
  amount: string;
  billing_date: string;
  asset_id: number | null;
  asset_name: string | null;
  days_until_billing: number;
}

export interface BillingProcessRequest {
  target_date: string;
}

export interface BillingResultItem {
  subscription_id: number;
  subscription_name: string;
  amount: string;
  asset_id: number | null;
  success: boolean;
  message: string;
}

export interface BillingResultResponse {
  processed_date: string;
  total_processed: number;
  successful: number;
  failed: number;
  results: BillingResultItem[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}