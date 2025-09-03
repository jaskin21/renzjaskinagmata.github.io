import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from '../stores/apiSlice';
import { Expense } from '../types/apiSlice';
import { useState } from 'react';
import { Plus, List, Trash2, Loader2 } from 'lucide-react'; // ✅ icons

export default function ExpensesTable() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useGetExpensesQuery(
    search ? { search } : undefined
  );
  const expenses: Expense[] = data?.data || [];

  const [deleteExpense] = useDeleteExpenseMutation();

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ checklist state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allChecked =
    expenses.length > 0 && selectedIds.length === expenses.length;

  // ✅ deleting state
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCheckAll = () => {
    if (allChecked) {
      setSelectedIds([]);
    } else {
      setSelectedIds(expenses.map((e) => e.id));
    }
  };

  // ✅ bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);

    try {
      await Promise.all(selectedIds.map((id) => deleteExpense(id).unwrap()));
      setSelectedIds([]); // clear selection
      await refetch(); // reload expenses
    } catch (err) {
      console.error('Failed to delete expenses:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='max-w-screen-xl mx-auto px-6'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* Table header */}
        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              Expense Summary
            </h2>

            {/* ✅ Show delete button if any selected */}
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className='flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50'
              >
                {isDeleting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className='w-4 h-4' /> Delete Selected
                  </>
                )}
              </button>
            )}
          </div>

          {/* 🔍 Search bar */}
          <input
            type='text'
            placeholder='Search expenses...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isDeleting}
            className='flex-1 max-w-xs px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50'
          />

          <span className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
            Total Records: {expenses.length}
          </span>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <Table className={isDeleting ? 'opacity-50 pointer-events-none' : ''}>
            <TableHeader>
              <TableRow className='bg-gray-100 dark:bg-gray-800'>
                {/* ✅ Checkbox column */}
                <TableHead className='px-4 py-4'>
                  <input
                    type='checkbox'
                    checked={allChecked}
                    onChange={toggleCheckAll}
                    disabled={isDeleting}
                  />
                </TableHead>
                <TableHead className='px-6 py-4 font-semibold text-gray-700 dark:text-gray-200'>
                  Description
                </TableHead>
                <TableHead className='px-6 py-4 font-semibold text-gray-700 dark:text-gray-200'>
                  Created At
                </TableHead>
                <TableHead className='px-6 py-4 font-semibold text-gray-700 dark:text-gray-200'>
                  Updated At
                </TableHead>
                <TableHead className='px-6 py-4 font-semibold text-gray-700 dark:text-gray-200'>
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-10 text-gray-500 dark:text-gray-400'
                  >
                    Loading expenses...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-10 text-red-500 font-medium'
                  >
                    Failed to load expenses.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                expenses.map((expense) => (
                  <AlertDialog key={expense.id}>
                    <AlertDialogTrigger asChild>
                      <TableRow
                        onClick={() => {
                          setSelectedExpense(expense);
                          setIsEditing(false);
                        }}
                        className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                      >
                        {/* ✅ Checkbox */}
                        <TableCell className='px-4 py-4'>
                          <input
                            type='checkbox'
                            checked={selectedIds.includes(expense.id)}
                            disabled={isDeleting}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleCheck(expense.id)}
                          />
                        </TableCell>

                        <TableCell className='px-6 py-4 font-medium text-gray-800 dark:text-gray-100'>
                          {expense.description}
                        </TableCell>
                        <TableCell className='px-6 py-4 text-gray-600 dark:text-gray-300'>
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='px-6 py-4 text-gray-600 dark:text-gray-300'>
                          {new Date(expense.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='px-6 py-4 text-gray-600 dark:text-gray-300'>
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {isEditing ? 'Edit Expense' : 'Expense Details'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {!isEditing && selectedExpense && (
                            <div className='space-y-2'>
                              <p>
                                <strong>Description:</strong>{' '}
                                {selectedExpense.description}
                              </p>
                              <p>
                                <strong>Amount:</strong> $
                                {selectedExpense.amount.toFixed(2)}
                              </p>
                              <p>
                                <strong>Created At:</strong>{' '}
                                {new Date(
                                  selectedExpense.createdAt
                                ).toLocaleString()}
                              </p>
                              <p>
                                <strong>Updated At:</strong>{' '}
                                {new Date(
                                  selectedExpense.updatedAt
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}

                          {isEditing && selectedExpense && (
                            <form className='space-y-4'>
                              <div>
                                <label className='block text-sm font-medium mb-1'>
                                  Description
                                </label>
                                <input
                                  type='text'
                                  defaultValue={selectedExpense.description}
                                  className='w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-1'>
                                  Amount
                                </label>
                                <input
                                  type='number'
                                  step='0.01'
                                  defaultValue={selectedExpense.amount}
                                  className='w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                              </div>
                            </form>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        {!isEditing ? (
                          <>
                            <AlertDialogAction>Ok</AlertDialogAction>
                            <button
                              type='button'
                              onClick={() => setIsEditing(true)}
                              className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                            >
                              Edit
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type='button'
                              onClick={() => setIsEditing(false)}
                              className='rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            >
                              Cancel
                            </button>
                            <button
                              type='submit'
                              className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                            >
                              Save
                            </button>
                          </>
                        )}
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}

              {!isLoading && !isError && expenses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-10 text-gray-500'
                  >
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Footer with floating buttons */}
        <div className='px-6 py-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between relative'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Last updated: {new Date().toLocaleString()}
          </span>

          <div className='flex gap-3 absolute right-6 top-1/2 transform -translate-y-1/2'>
            <button className='w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700'>
              <Plus className='w-5 h-5' />
            </button>
            <button className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700'>
              <List className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
