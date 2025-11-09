import http from 'node:http';
import { config } from './common/config';
import { ServerResponse, IncomingMessage } from 'http';
import { Api } from './api';
import { handleErrors } from './handle-errors';

const server = http.createServer();
const api = new Api();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
  try {
    api.run(req, res);
  } catch (error) {
    handleErrors(error, res);
  }
});

server.listen(config.port);
