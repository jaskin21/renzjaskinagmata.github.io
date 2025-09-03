// -----------------
// Types
// -----------------
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Generic API response wrapper
export interface ApiResponse<T> {
  status: string; 
  code: number; 
  message: string; 
  data: T;     
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

// types
export interface SummaryCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface SummaryData {
  total: number;
  items: number;
  categories: SummaryCategory[];
}

export interface SummaryResponse {
  status: string; // e.g. "success"
  code: number; // e.g. 200
  message: string; // e.g. "Summary fetched successfully"
  data: SummaryData;
}

