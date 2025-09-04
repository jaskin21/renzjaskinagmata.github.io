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
import useToast from '../../hook/useToast';
import { handleFetchBaseQueryError } from '../../utils/errorFactory';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    defaultValues: { description: '', amount: 0, category: 'Other' },
  });
  const { showSuccessToast, showErrorToast } = useToast();

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

  useEffect(() => {
    if (!open) {
      reset({ description: '', amount: 0, category: 'Other' });
    }
  }, [open, reset]);

  const onSubmit = async (values: ExpenseFormValues) => {
    setIsSaving(true);
    try {
      if (isEditing && expense) {
        await updateExpense({ id: expense.id, updates: values }).unwrap();
        showSuccessToast(`Expense updated successfully.`);
      } else {
        await createExpense(values).unwrap();
        showSuccessToast(`New expense created.`);
        reset({ description: '', amount: 0, category: 'Other' });
      }
      onSaved();
    } catch (error) {
      const errorMessage = handleFetchBaseQueryError(
        error as FetchBaseQueryError,
        'Failed to save expense. Please try again.',
        true
      );
      showErrorToast(errorMessage);
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
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 3,
                      message: 'Description must be at least 3 characters',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Description cannot exceed 100 characters',
                    },
                  })}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className='block text-sm font-medium mb-1'>Amount</label>
                <input
                  type='text'
                  inputMode='numeric'
                  {...register('amount', {
                    required: 'Amount is required',
                    validate: (value) =>
                      Number(value) > 0 || 'Amount must be greater than 0',
                    setValueAs: (value) => {
                      if (!value) return 0;

                      // keep only digits
                      let cleaned = value.toString().replace(/[^\d]/g, '');

                      // remove leading zeros
                      cleaned = cleaned.replace(/^0+(?!$)/, '');

                      return cleaned ? Number(cleaned) : 0;
                    },
                  })}
                  onChange={(e) => {
                    // keep only digits
                    let value = e.target.value.replace(/[^\d]/g, '');

                    // remove leading zeros
                    value = value.replace(/^0+(?!$)/, '');

                    // update field display
                    if (value) {
                      e.target.value = Number(value).toLocaleString();
                    } else {
                      e.target.value = ''; // allow clear
                    }
                  }}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500'
                />
                {errors.amount && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.amount.message}
                  </p>
                )}
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
