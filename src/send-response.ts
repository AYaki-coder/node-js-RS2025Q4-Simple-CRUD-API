import { ServerResponse } from 'node:http';

export const sendResponse = (response: ServerResponse, message: string, code: number) => {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(message);
};
