import { Drawer, DrawerContent } from '../ui/drawer';
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
import { format, subDays, differenceInCalendarDays } from 'date-fns';

const COLORS = [
  '#60a5fa', // softer sky blue
  '#f87171', // soft coral red
  '#22c55e',
  '#f59e0b', // warm pastel yellow-orange
  '#a78bfa', // soft lilac purple
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
  // default: last 7 days
  const today = new Date();
  const defaultStart = subDays(today, 6); // 6 days ago + today = 7 days total
  const defaultEnd = today;

  const [startDate, setStartDate] = useState<Date | null>(defaultStart);
  const [endDate, setEndDate] = useState<Date | null>(defaultEnd);

  // control popover open state
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

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

  // compute header text
  const isLast7Days =
    startDate && endDate && differenceInCalendarDays(endDate, startDate) === 6; // exactly 7 days span

  const headerText = isLast7Days
    ? 'Expense Summary (Last 7 days)'
    : 'Expense Summary';

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='fixed bottom-0 left-0 w-full h-[90vh] sm:h-[600px] bg-gray-200 border-gray-500 shadow-2xl border-t dark:border-gray-700 rounded-t-2xl flex flex-col'>
        <div className='flex-1 flex flex-col md:flex-row max-w-screen-xl mx-auto w-full p-6 gap-6'>
          {/* LEFT SECTION (40%) */}
          <div className='w-full md:w-2/5 flex items-center justify-center'>
            <div className='w-full flex flex-col justify-center gap-6'>
              {/* Header */}
              <div>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
                  {headerText}
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {startDate && endDate
                    ? `Summary Overview from ${format(
                        startDate,
                        'PPP'
                      )} to ${format(endDate, 'PPP')}`
                    : 'Choose a start and end date'}
                </p>
              </div>

              {/* Date Pickers */}
              <div className='flex flex-col sm:flex-row gap-3'>
                {/* Start Date */}
                <Popover open={openStart} onOpenChange={setOpenStart}>
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
                      onSelect={(date) => {
                        setStartDate(date ?? null);
                        setOpenStart(false); // close after select
                      }}
                      disabled={(date) => (endDate ? date > endDate : false)}
                    />
                  </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover open={openEnd} onOpenChange={setOpenEnd}>
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
                      onSelect={(date) => {
                        setEndDate(date ?? null);
                        setOpenEnd(false); // close after select
                      }}
                      disabled={(date) =>
                        startDate ? date < startDate : false
                      }
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
                  <div className='space-y-2 mt-2'>
                    {categories.map((item, i) => (
                      <div
                        key={i}
                        className='flex justify-between text-sm border-b border-gray-300 dark:border-gray-700 py-2'
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
              <div className='flex justify-between text-xl'>
                <span className='text-gray-700 font-bold dark:text-gray-300'>
                  Total:
                </span>
                <span className='font-medium text-gray-800 dark:text-gray-100'>
                  ₱{total.toLocaleString()}
                </span>
              </div>
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
      </DrawerContent>
    </Drawer>
  );
}
