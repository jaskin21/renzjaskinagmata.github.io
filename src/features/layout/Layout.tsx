import { Invoice } from '@phosphor-icons/react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  // const location = useLocation();

  // const isActive = (path: string) =>
  //   location.pathname === path
  //     ? 'block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white'
  //     : 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700';

  return (
    <div>
      <header>
        <nav className='bg-gray-200 border-gray-500 px-4 lg:px-6 py-2.5 dark:bg-gray-800 mb-10'>
          <div className='flex flex-wrap justify-between items-center mx-auto max-w-screen-xl '>
            <Link to='/' className='flex items-center gap-2'>
              <Invoice size={44} weight='duotone' />
              <h1 className='ml-2 text-2xl thin'>Expense Tracker App</h1>
            </Link>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
