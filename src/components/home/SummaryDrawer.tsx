import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useGetSummaryQuery } from '../../stores/apiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
];

interface SummaryDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SummaryDrawer({
  open,
  onOpenChange,
}: SummaryDrawerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const queryArg =
    startDate && endDate
      ? {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        }
      : skipToken;

  const { data, isFetching, isError } = useGetSummaryQuery(queryArg);

  const summary = data?.data;
  const total = summary?.total ?? 0;
  const categories = summary?.categories ?? [];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='fixed bottom-0 left-0 w-full h-[90vh] sm:h-[600px] bg-white dark:bg-gray-900 shadow-2xl border-t border-gray-200 dark:border-gray-700 rounded-t-2xl flex flex-col'>
        {/* Main container with card-like style */}
        <div className='flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full p-6 gap-6'>
          {/* LEFT SECTION (40%) */}
          <div className='w-full md:w-2/5 flex items-center justify-center'>
            <div className='w-full flex flex-col justify-center gap-6'>
              {/* Header */}
              <div>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                  Expense Summary
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Select a date range to view summary
                </p>
              </div>

              {/* Date Pickers */}
              <div className='flex flex-col sm:flex-row gap-3'>
                {/* Start Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2 w-full sm:w-auto'
                    >
                      <CalendarIcon className='h-4 w-4' />
                      {startDate ? format(startDate, 'PPP') : 'Start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0'>
                    <Calendar
                      mode='single'
                      selected={startDate ?? undefined}
                      onSelect={(date) => setStartDate(date ?? null)}
                    />
                  </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='flex items-center gap-2 w-full sm:w-auto'
                    >
                      <CalendarIcon className='h-4 w-4' />
                      {endDate ? format(endDate, 'PPP') : 'End date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0'>
                    <Calendar
                      mode='single'
                      selected={endDate ?? undefined}
                      onSelect={(date) => setEndDate(date ?? null)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Summary */}
              {isFetching ? (
                <p className='text-gray-500'>Loading summary...</p>
              ) : isError ? (
                <p className='text-red-500'>Failed to fetch summary.</p>
              ) : !summary ? (
                <p className='text-gray-500'>No summary to display.</p>
              ) : (
                <div className='flex flex-col gap-3'>
                  <div className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                    Total: ₱{total.toLocaleString()}
                  </div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    Items: {summary.items}
                  </div>

                  <div className='space-y-2 mt-2'>
                    {categories.map((item, i) => (
                      <div
                        key={i}
                        className='flex justify-between text-sm border-b border-gray-200 dark:border-gray-700 last:border-b-0 py-1'
                      >
                        <span className='text-gray-700 dark:text-gray-300'>
                          {item.category}{' '}
                          <span className='text-xs text-gray-500 dark:text-gray-400'>
                            ({item.percentage.toFixed(1)}%)
                          </span>
                        </span>
                        <span className='font-medium text-gray-800 dark:text-gray-100'>
                          ₱{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION (60%) */}
          <div className='w-full md:w-3/5 flex items-center justify-center'>
            {categories.length === 0 ? (
              <p className='text-gray-500'>No data to display</p>
            ) : (
              <ResponsiveContainer width='100%' height='80%'>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey='amount'
                    nameKey='category'
                    outerRadius={120}
                    label={({ name, percent }) =>
                      `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`
                    }
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `₱${v.toLocaleString()}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <DrawerClose asChild>
            <Button className='w-full' variant='secondary'>
              Close
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}


