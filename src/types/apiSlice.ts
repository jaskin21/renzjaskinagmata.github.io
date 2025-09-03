// -----------------
// Types
// -----------------
// types/api.ts

export interface Expense {
  id: string;
  description: string;
  amount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Generic API response wrapper
export interface ApiResponse<T> {
  status: string;   // e.g., "success" or "error"
  code: number;     // HTTP status code
  message: string;  // description message
  data: T;          // generic data payload
}

// Response type for getExpenses
export type GetExpensesResponse = ApiResponse<Expense[]>;

// Response type for single expense
export type GetExpenseResponse = ApiResponse<Expense>;

export interface CreateExpenseRequest {
  description: string;
  amount: number;
}

export interface UpdateExpenseRequest {
  id: string;
  updates: Partial<Pick<Expense, 'description' | 'amount'>>;
}

export interface DeleteExpenseResponse {
  success: boolean;
}

export interface SummaryResponse {
  total: number;
}
