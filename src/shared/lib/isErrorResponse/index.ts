import { JsonApiRequestError } from '@farfetched/core';

export type ErrorWithResponse = JsonApiRequestError & {
  response?: {
    detail?: string;
  };
};

export const isErrorResponse = (error: JsonApiRequestError): error is ErrorWithResponse => {
  const errorWithResponse = error as ErrorWithResponse;
  return Boolean(errorWithResponse.response?.detail && typeof errorWithResponse.response.detail === 'string');
};
