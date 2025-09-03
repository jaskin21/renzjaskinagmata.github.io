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
import { useGetExpensesQuery } from '../stores/apiSlice';
import { Expense } from '../types/apiSlice';
import { useState } from 'react';

export default function ExpensesTable() {
  const { data, isLoading, isError } = useGetExpensesQuery();
  const expenses: Expense[] = data?.data || [];

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className='max-w-screen-xl mx-auto px-6'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* Table header */}
        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Expense Summary
          </h2>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Total Records: {expenses.length}
          </span>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-100 dark:bg-gray-800'>
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
                    colSpan={4}
                    className='text-center py-10 text-gray-500 dark:text-gray-400'
                  >
                    Loading expenses...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={4}
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
                          setIsEditing(false); // reset editing mode
                        }}
                        className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                      >
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
                              {/* You can hook this form up to react-hook-form + RTK mutation */}
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
                    colSpan={4}
                    className='text-center py-10 text-gray-500'
                  >
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className='px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-sm'>
          <span className='text-gray-500 dark:text-gray-400'>
            Last updated: {new Date().toLocaleString()}
          </span>
          <a
            href='#'
            className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
          >
            Summary
          </a>
        </div>
      </div>
    </div>
  );
}