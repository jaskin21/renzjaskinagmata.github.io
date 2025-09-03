import {
  useCreateExpenseMutation,
  useGetExpensesQuery,
} from '../stores/apiSlice';

const NotFoundPage = () => {
  const { data: expenses , isLoading } = useGetExpensesQuery();
  const [createExpense] = useCreateExpenseMutation();

  if (isLoading) return <p>Loading...</p>;
  return (
    <section className='bg-white dark:bg-gray-900'>
      <h1>Expenses</h1>
      <ul>
        {expenses?.data.map((expense) => (
          <li key={expense.id}>
            {expense.description} - ${expense.amount} ({expense.createdAt})
          </li>
        ))}
      </ul>
      <button
        onClick={() => createExpense({ description: 'Snacks', amount: 15 })}
      >
        Add Expense
      </button>
    </section>
  );
};

export default NotFoundPage;
