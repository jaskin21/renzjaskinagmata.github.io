import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '../ui/drawer';
import { Button } from '../ui/button';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { X } from 'lucide-react';

// Dummy data for now
const data = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Entertainment', value: 200 },
  { name: 'Utilities', value: 100 },
];

const COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
];

export default function SummaryDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const total = data.reduce((s, e) => s + e.value, 0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='fixed bottom-0 left-0 w-full h-[600px] bg-background shadow-xl border-t rounded-t-2xl p-4 flex flex-col'>
        {/* Header */}
        <DrawerHeader className='p-0 mb-2 flex items-center justify-between'>
          <div>
            <DrawerTitle>Expense Summary</DrawerTitle>
            <DrawerDescription>Overview of spending</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' aria-label='Close'>
              <X className='h-5 w-5' />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Middle content */}
        <div className='flex-1 flex items-center justify-center'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl px-4'>
            {/* Summary Section */}
            <div className='space-y-2'>
              <div className='text-lg font-semibold'>
                Total: ₱{total.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground'>
                Items: {data.length}
              </div>

              <div className='space-y-2 mt-2'>
                {data.map((item, i) => {
                  const percent = total > 0 ? (item.value / total) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className='flex justify-between text-sm border-b last:border-b-0 py-1'
                    >
                      <span>
                        {item.name}{' '}
                        <span className='text-xs text-muted-foreground'>
                          ({percent.toFixed(1)}%)
                        </span>
                      </span>
                      <span className='font-medium'>
                        ₱{item.value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie Chart */}
            <div className='h-48'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey='value'
                    nameKey='name'
                    outerRadius={80}
                    label
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => `₱${v.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-2'>
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
