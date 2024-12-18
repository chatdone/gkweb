import { ApolloError } from '@apollo/client';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof ApolloError) {
    return error.message;
  } else if (Array.isArray(error)) {
    const errorMessage = error.map((e) => e.message);

    return errorMessage.join('\n');
  } else {
    return error as string;
  }
};
