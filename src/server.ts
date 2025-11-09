import http from 'node:http';

import { ServerResponse, IncomingMessage } from 'http';
import { Api } from './api';
import { handleErrors } from './handle-errors';

export const startServer = (port: number) => {
  const server = http.createServer();
  const api = new Api();

  server.on('request', (req: IncomingMessage, res: ServerResponse) => {
    try {
      api.run(req, res);
    } catch (error) {
      handleErrors(error, res);
    }
  });

  server.listen(port);
};
