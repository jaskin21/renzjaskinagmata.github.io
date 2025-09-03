// src/store/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CreateExpenseRequest,
  DeleteExpenseResponse,
  Expense,
  GetExpenseResponse,
  GetExpensesResponse,
  SummaryResponse,
  UpdateExpenseRequest,
} from '../types/apiSlice';

const baseUrl = import.meta.env.VITE_BASE_URL; // e.g. "http://localhost:5000"

// -----------------
// API Slice
// -----------------
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Expenses'],

  endpoints: (builder) => ({
    // ✅ GET all expenses
    getExpenses: builder.query<GetExpensesResponse, { search?: string } | void>(
      {
        query: (params) =>
          params?.search
            ? `/expenses?search=${encodeURIComponent(params.search)}`
            : '/expenses',
        providesTags: (result) =>
          result?.data
            ? [
                // Individual expense tags
                ...result.data.map((expense) => ({
                  type: 'Expenses' as const,
                  id: expense.id,
                })),
                // Full list tag
                { type: 'Expenses', id: 'LIST' },
              ]
            : [{ type: 'Expenses', id: 'LIST' }],
      }
    ),

    // ✅ GET single expense
    getExpense: builder.query<GetExpenseResponse, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Expenses', id }],
    }),

    // ✅ POST create expense
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (body) => ({
        url: '/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Expenses', id: 'LIST' }],
    }),

    // ✅ PATCH update expense
    updateExpense: builder.mutation<Expense, UpdateExpenseRequest>({
      query: ({ id, updates }) => ({
        url: `/expenses/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expenses', id }, // invalidate single
        { type: 'Expenses', id: 'LIST' }, // invalidate list
      ],
    }),

    // ✅ DELETE expense
    deleteExpense: builder.mutation<DeleteExpenseResponse, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Expenses', id }, // remove deleted one
        { type: 'Expenses', id: 'LIST' }, // refresh list
      ],
    }),

    // GET summary with optional date range
    getSummary: builder.query<
      SummaryResponse,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: '/expenses/summary/total',
        method: 'GET',
        params: { startDate, endDate },
      }),
    }),
  }),
});

// -----------------
// Auto Hooks
// -----------------
export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetSummaryQuery,
} = apiSlice;
