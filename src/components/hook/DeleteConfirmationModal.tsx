type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
};

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = 'Are you sure you want to delete this?',
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[99999] flex justify-center items-start bg-black bg-opacity-50 pointer-events-auto'>
      <div className='relative mt-20 p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700 pointer-events-auto'>
        <button
          type='button'
          className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white'
          onClick={onClose}
        >
          <svg
            className='w-3 h-3'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 14 14'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13'
            />
          </svg>
          <span className='sr-only'>Close modal</span>
        </button>
        <div className='p-4 md:p-5 text-center'>
          <svg
            className='mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>
          <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
            {message}
          </h3>
          <button
            data-testid='confirm-delete'
            onClick={onConfirm}
            className='text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 mr-2'
          >
            Yes, I'm sure
          </button>
          <button
            onClick={onClose}
            className='py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
