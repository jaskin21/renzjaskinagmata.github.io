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
    // GET all expenses
    getExpenses: builder.query<GetExpensesResponse, { search?: string } | void>(
      {
        query: (params) => {
          if (params?.search) {
            return `/expenses?search=${encodeURIComponent(params.search)}`;
          }
          return '/expenses';
        },
        providesTags: ['Expenses'],
      }
    ),

    getExpense: builder.query<GetExpenseResponse, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: ['Expenses'],
    }),

    // POST create expense
    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (body) => ({
        url: '/expenses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Expenses'],
    }),

    // PATCH update expense
    updateExpense: builder.mutation<Expense, UpdateExpenseRequest>({
      query: ({ id, updates }) => ({
        url: `/expenses/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expenses', id },
        'Expenses',
      ],
    }),

    // DELETE expense
    deleteExpense: builder.mutation<DeleteExpenseResponse, string>({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expenses'],
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
