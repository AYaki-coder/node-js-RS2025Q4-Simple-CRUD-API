import http from 'node:http';
import { config } from './common/config';
import { ServerResponse, IncomingMessage } from 'http';
import { App } from './app';

const server = http.createServer();

server.on('request', (req: IncomingMessage, res: ServerResponse) => {
  new App(req, res).run();
});

server.listen(config.port);
