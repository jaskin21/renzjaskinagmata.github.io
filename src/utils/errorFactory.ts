import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 *
 * @param error FetchBaseQueryError
 * @param customMessage Default error message
 * @returns
 */
export const handleFetchBaseQueryError = (
  error: FetchBaseQueryError,
  customMessage = 'Bad request',
  useCustomMessage = false
): string => {
  if (useCustomMessage) {
    return customMessage;
  }

  if ((error as FetchBaseQueryError).status === 400) {
    const errorData = (error as FetchBaseQueryError).data as { error?: string };
    return errorData?.error || customMessage;
  } else if ((error as FetchBaseQueryError).status === 'FETCH_ERROR') {
    return 'Network error. Please check your connection.';
  } else if ((error as FetchBaseQueryError).status === 'PARSING_ERROR') {
    return 'Error parsing the response. Please try again.';
  } else {
    return 'An unknown error occurred. Please try again.';
  }
};
