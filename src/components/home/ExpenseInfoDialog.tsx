import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { Expense } from '../../types/apiSlice';
import { format } from 'date-fns';

interface Props {
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExpenseInfoDialog({
  expense,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <AlertDialog open={!!expense} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Expense Details</AlertDialogTitle>
          <AlertDialogCancel
            className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
            onClick={onClose}
          >
            ✕
          </AlertDialogCancel>
          <AlertDialogDescription className='space-y-2 border-b border-gray-200 pb-4'>
            <p>
              <strong>Description:</strong> {expense.description}
            </p>
            <p>
              <strong>Category:</strong> {expense.category}
            </p>
            <p>
              <strong>Amount:</strong>{' '}
              {expense.amount.toLocaleString('en-PH', {
                style: 'currency',
                currency: 'PHP',
              })}
            </p>
            <p>
              <strong>Created:</strong>{' '}
              {format(new Date(expense.createdAt), 'MMMM d, yyyy @h:mm:ss a')}
            </p>

            <p>
              <strong>Updated:</strong>{' '}
              {format(new Date(expense.updatedAt), 'MMMM d, yyyy @h:mm:ss a')}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex justify-end gap-3 pt-4'>
          <button
            type='button'
            onClick={onDelete}
            className='rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700'
          >
            Delete
          </button>
          <button
            type='button'
            onClick={onEdit}
            className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            Edit
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}