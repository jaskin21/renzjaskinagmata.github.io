import { useCallback } from 'react';
import { toast } from 'react-toastify';

const useToast = () => {
  const showSuccessToast = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showErrorToast = useCallback((message: string) => {
    toast.error(message);
  }, []);

  return { showSuccessToast, showErrorToast };
};

export default useToast;