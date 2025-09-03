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
            className='absolute top-0 right-0 text-gray-400 hover:text-gray-600'
            onClick={onClose}
          >
            ✕
          </AlertDialogCancel>
          <AlertDialogDescription className='space-y-2 border-b border-gray-200 pb-4'>
            <p>
              <strong>Description:</strong> {expense.description}
            </p>
            <p>
              <strong>Amount:</strong> ${expense.amount.toFixed(2)}
            </p>
            <p>
              <strong>Created At:</strong>{' '}
              {new Date(expense.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{' '}
              {new Date(expense.updatedAt).toLocaleString()}
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