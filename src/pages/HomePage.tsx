import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from '../stores/apiSlice';
import { Expense } from '../types/apiSlice';
import { useState } from 'react';
import { Plus, List, Trash2, Loader2 } from 'lucide-react';
import DeleteConfirmationModal from '../components/hook/DeleteConfirmationModal';
import useDeleteConfirmation from '../hook/useConfirmationDelete';
import { handleFetchBaseQueryError } from '../utils/errorFactory';
import useToast from '../hook/useToast';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import ExpenseInfoDialog from '../components/home/ExpenseInfoDialog';
import ExpenseFormDialog from '../components/home/ExpenseFormDialog';
import SummaryDrawer from '../components/home/SummaryDrawer';
import { format } from 'date-fns';

export default function ExpensesTable() {
  const { showSuccessToast, showErrorToast } = useToast();

  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useGetExpensesQuery(
    search ? { search } : undefined
  );
  const expenses: Expense[] = data?.data || [];

  // dialog state
  const [infoExpense, setInfoExpense] = useState<Expense | null>(null);
  const [formExpense, setFormExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openSummary, setOpenSummary] = useState(false);

  // delete confirmation
  const {
    isModalOpen: isDeleteModalOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
    confirmDelete,
    setConfirmCallback: setDeleteConfirmCallback,
  } = useDeleteConfirmation();
  const [deleteExpense] = useDeleteExpenseMutation();

  // bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allChecked =
    expenses.length > 0 && selectedIds.length === expenses.length;
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleCheck = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCheckAll = () => {
    setSelectedIds(allChecked ? [] : expenses.map((e) => e.id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      setDeleteConfirmCallback(async () => {
        await Promise.all(selectedIds.map((id) => deleteExpense(id).unwrap()));
        showSuccessToast(`Deleted ${selectedIds.length} items successfully!`);
        setSelectedIds([]);
        await refetch();
      });
      openDeleteModal();
    } catch (error) {
      const errorMessage = handleFetchBaseQueryError(
        error as FetchBaseQueryError,
        'Invalid request!',
        true
      );
      showErrorToast(`${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSingle = (id: string) => {
    if (!id) return;
    setDeleteConfirmCallback(async () => {
      setIsDeleting(true);
      try {
        await deleteExpense(id).unwrap();
         showSuccessToast(`Item deleted successfully!`);
        await refetch();
        setInfoExpense(null);
      } catch (error) {
        const errorMessage = handleFetchBaseQueryError(
          error as FetchBaseQueryError,
          'Invalid request!',
          true
        );
        showErrorToast(`${errorMessage}`);
      } finally {
        setIsDeleting(false);
      }
    });
    openDeleteModal();
  };

  return (
    <div className='max-w-screen-xl mx-auto px-6 relative'>
      <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4'>
          <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Expense Records
          </h2>

          <div className='flex-1 flex justify-center'>
            <input
              type='text'
              placeholder='Search expenses...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isDeleting}
              data-testid="search-bar"
              className='w-full max-w-xs px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 disabled:opacity-50'
            />
          </div>

          <div className='flex items-center gap-4'>
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting || selectedIds.length === 0}
              data-testid="bulk-delete"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 transition-all
                ${selectedIds.length === 0 ? 'invisible' : 'visible'}`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span className='hidden sm:inline'>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className='w-4 h-4' />
                  <span className='hidden sm:inline'>Delete Selected</span>
                </>
              )}
            </button>
            <span className='text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap'>
              Total Records: {expenses.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <Table className={isDeleting ? 'opacity-50 pointer-events-none' : ''}>
            <TableHeader>
              <TableRow className='bg-gray-100 dark:bg-gray-800'>
                <TableHead className='px-4 py-4'>
                  <input
                    type='checkbox'
                    checked={allChecked}
                    onChange={toggleCheckAll}
                    disabled={isDeleting}
                  />
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-10'>
                    Loading expenses...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className='text-center py-10 text-red-500'
                  >
                    Failed to load expenses.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !isError &&
                expenses.map((expense) => (
                  <TableRow
                    key={expense.id}
                    data-testid={`expense-row-${expense.id}`}
                    onClick={() => setInfoExpense(expense)}
                    className='hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer'
                  >
                    <TableCell className='px-4 py-4'>
                      <input
                        type='checkbox'
                        checked={selectedIds.includes(expense.id)}
                        disabled={isDeleting}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleCheck(expense.id)}
                      />
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>
                      {format(new Date(expense.createdAt), 'MMMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(expense.updatedAt), 'MMMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <TableCell>
                        <TableCell>
                          {expense.amount.toLocaleString('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                          })}
                        </TableCell>
                      </TableCell>
                    </TableCell>
                  </TableRow>
                ))}
              {!isLoading && !isError && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-10'>
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className='px-6 py-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between relative'>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            Last updated: {new Date().toLocaleString()}
          </span>
          <div className='flex gap-3 absolute right-6 top-1/2 transform -translate-y-1/2'>
            <button
              disabled={isDeleting}
              onClick={() => {
                setFormExpense(null);
                setIsFormOpen(true);
              }}
              data-testid="add-expense"
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 ${
                isDeleting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Plus className='w-5 h-5' />
            </button>
            <button
              disabled={isDeleting}
              onClick={() => setOpenSummary(true)}
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 ${
                isDeleting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <List className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Info Dialog */}
      {infoExpense && (
        <ExpenseInfoDialog
          expense={infoExpense}
          onClose={() => setInfoExpense(null)}
          onEdit={() => {
            setFormExpense(infoExpense);
            setInfoExpense(null);
            setIsFormOpen(true);
          }}
          onDelete={() => handleDeleteSingle(infoExpense.id)}
        />
      )}

      {/* Form Dialog */}
      <ExpenseFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        expense={formExpense}
        onSaved={() => {
          setIsFormOpen(false);
          refetch();
        }}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete()}
        message='Are you sure you want to delete this item?'
      />

      {/* Drawer lives once at the root of the page */}
      <SummaryDrawer
        open={openSummary}
        onOpenChange={setOpenSummary}
      />
    </div>
  );
}
