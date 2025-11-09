import { ServerResponse } from 'node:http';
import { CustomError } from './custom-error';
import { sendResponse } from './send-response';

export const handleErrors = (error: unknown, res: ServerResponse): void => {
  if (error instanceof CustomError) {
    sendResponse(res, JSON.stringify(error.msg), error.statusCode);
    return;
  }
  sendResponse(res, JSON.stringify('Oops! Something went wrong'), 500);
};
