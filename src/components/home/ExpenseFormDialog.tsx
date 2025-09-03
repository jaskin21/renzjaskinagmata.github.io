import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Expense } from '../../types/apiSlice';
import { useForm } from 'react-hook-form';
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
} from '../../stores/apiSlice';
import { useState, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  expense: Expense | null;
}

interface ExpenseFormValues {
  description: string;
  amount: number;
  category: string;
}

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

export default function ExpenseFormDialog({
  open,
  onClose,
  onSaved,
  expense,
}: Props) {
  const isEditing = !!expense;

  const { register, handleSubmit, reset } = useForm<ExpenseFormValues>({
    defaultValues: { description: '', amount: 0, category: 'Other' },
  });

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      reset({
        description: expense.description,
        amount: expense.amount,
        category: expense.category || 'Other',
      });
    } else {
      reset({ description: '', amount: 0, category: 'Other' });
    }
  }, [expense, reset]);

  const onSubmit = async (values: ExpenseFormValues) => {
    setIsSaving(true);
    try {
      if (isEditing && expense) {
        await updateExpense({ id: expense.id, updates: values }).unwrap();
      } else {
        await createExpense(values).unwrap();
      }
      onSaved();
    } catch (err) {
      console.error('Failed to save expense:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className='fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg'>
        {/* ❌ Close button */}
        <AlertDialogCancel
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
          onClick={onClose}
        >
          ✕
        </AlertDialogCancel>

        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditing ? 'Edit Expense' : 'Create Expense'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Description */}
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Description
                </label>
                <input
                  type='text'
                  {...register('description', { required: true })}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Amount */}
              <div>
                <label className='block text-sm font-medium mb-1'>Amount</label>
                <input
                  type='number'
                  step='0.01'
                  {...register('amount', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Category dropdown */}
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Category
                </label>
                <select
                  {...register('category', { required: true })}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Footer */}
              <AlertDialogFooter className='flex justify-end gap-3 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300'
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSaving}
                  className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 min-w-[80px]'
                >
                  {isSaving ? (
                    <Loader2 className='w-4 h-4 animate-spin inline-block' />
                  ) : (
                    'Save'
                  )}
                </button>
              </AlertDialogFooter>
            </form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}